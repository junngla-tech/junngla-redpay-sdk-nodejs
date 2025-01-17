import {
  RETRY_LIMIT,
  STATUS_CODE_OK,
  STATUS_CODE_RETRY,
} from "../config/constants";
import { OrderIsRevokedError, OrderReuseLimitError, ProcessAuthorizeError } from "../errors";
import { RedPayConfigProvider } from "../provider";
import { RedPayIntegrity, RedPayService } from "../services";
import { WebhookPreAuthorization } from "../types";
import { AuthorizeOrder } from "./AuthorizeOrder";
import { Order } from "./Order";
import { ValidateAuthorizationCollectorRequest } from "./ValidateAuthorization";
import { IError } from "../interface";
import { UserCollectorRequest } from "./User";

export abstract class RedPayAuthorizationManagement {
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing = false;
  protected readonly redPayService: RedPayService;

  constructor(redPayService?: RedPayService) {
    this.redPayService = redPayService || new RedPayService();
  }

  /**
   * Procesa un webhook de pre-autorización siguiendo un flujo predefinido: validación de firma, obtención de orden,
   * validación de código de estado, verificación de revocación, validación de reutilización y evento de pre-autorización.
   *
   * @param {WebhookPreAuthorization} webhook - El payload del webhook que se procesa.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el procesamiento del webhook finaliza.
   */
  public async processWebhook(webhook: WebhookPreAuthorization): Promise<void> {
    this.validateSignature(webhook);

    // Flujo de procesamiento del webhook.
    const order = await this.getOrder(webhook.token_uuid);
    const isValid = this.checkStatusCodeFromWebhook(webhook);
    if (isValid) {
      this.checkIfOrderIsRevoked(order);
      this.validateOrderReuse(order);
      await this.onPreAuthorizeEvent(webhook, order);
    } else {
      await this.onInfoEvent(webhook);
    }
  }

  /**
   * Valida la firma del webhook para garantizar la integridad y autenticidad del mensaje.
   *
   * @param {WebhookPreAuthorization} webhook - El payload del webhook que contiene la firma.
   * @throws {InvalidSignatureError} Si la firma del webhook no es válida.
   */
  private validateSignature(webhook: WebhookPreAuthorization): void {
    const { secrets } = RedPayConfigProvider.getInstance().getConfig();
    RedPayIntegrity.validateSignatureOrFail(webhook, secrets.integrity);
  }

  /**
   * Verifica si el código de estado del webhook es válido.
   *
   * @param {WebhookPreAuthorization} webhook - El payload del webhook que contiene el código de estado.
   * @returns {boolean} `true` si el código de estado es válido, de lo contrario `false`.
   */
  private checkStatusCodeFromWebhook(
    webhook: WebhookPreAuthorization
  ): boolean {
    const { status_code } = webhook;
    return status_code === STATUS_CODE_OK;
  }

  /**
   * Verifica si una orden ha sido revocada.
   *
   * @param {Order} order - La orden que se verifica.
   * @throws {OrderIsRevokedError} Si la orden está revocada.
   */
  private checkIfOrderIsRevoked(order: Order): void {
    const isRevoked = !!order.revoked_at;
    if (isRevoked) throw new OrderIsRevokedError();
  }

  /**
   * Inicia el procesamiento periódico de órdenes.
   */
  public start(): void {
    if (this.intervalId) return; 

    this.intervalId = setInterval(async () => {
        if (this.isProcessing) return;
        this.isProcessing = true; 

        try {
            const orders = await this.pendingAuthorizeOrders(); 

            if (orders.length === 0) return this.stop();

            await this.processAuthorizeOrders(orders); 
        } catch (error) {
          throw new ProcessAuthorizeError()
        } finally {
            this.isProcessing = false;
        }
    }, 1000);
}

  /**
   * Detiene el procesamiento periódico de órdenes.
   */
  public stop(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isProcessing = false;
  }

  /**
   * Procesa múltiples autorizaciones de órdenes.
   */
  private async processAuthorizeOrders(authorizeOrders: AuthorizeOrder[]): Promise<void> {
    for (const order of authorizeOrders) {
      await this.processSingleAuthorization(order);
    }
  }

  /**
   * Procesa una sola autorización de orden.
   */
  private async processSingleAuthorization(authorizeOrder: AuthorizeOrder): Promise<void> {
    try {
      
      const response = await this.redPayService.validateAuthorization(
        new ValidateAuthorizationCollectorRequest({
          authorization_uuid: authorizeOrder.authorization_uuid,
          user: new UserCollectorRequest({ user_id: authorizeOrder.user_id }),
        })
      );

      await this.onSuccess(authorizeOrder, response.status_code!);
    } catch (err) {
      await this.handleAuthorizationError(authorizeOrder, err as IError);
    }
  }

  /**
   * Maneja errores de autorización.
   */
  private async handleAuthorizationError(authorizeOrder: AuthorizeOrder, error: IError): Promise<void> {
    if (error.data?.status_code === STATUS_CODE_RETRY) {
      await this.retryAuthorization(authorizeOrder);
    } else {
      // TODO: Verificar que estado de error se debe enviar `uknown`.
      await this.onError(authorizeOrder, error.data?.status_code || "unknown");
    }
  }

  /**
   * Reintenta procesar una autorización con límite de intentos.
   */
  private async retryAuthorization(authorizeOrder: AuthorizeOrder, retry = 1): Promise<void> {

    if (retry > RETRY_LIMIT) {
      return await this.onError(authorizeOrder, STATUS_CODE_RETRY);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.processSingleAuthorization(authorizeOrder);
  }

  /**
   * Valida si una orden excede el límite de reutilización permitido.
   *
   * @param {Order} order - La orden que se valida.
   * @throws {OrderReuseLimitError} Si la orden ha excedido el límite de reutilización.
   */
  private validateOrderReuse(order: Order): void {
    const count = this.countAuthorizationByOrder(order.token_uuid);
    if (count === -1) return;

    if (order.reusability! <= count) throw new OrderReuseLimitError();
  }

  /**
   * Cuenta el número de autorizaciones asociadas a una orden.
   * Este método puede ser personalizado (override) según sea necesario.
   *
   * @protected
   * @param {string} token_uuid - El identificador único de la orden.
   * @returns {number} El número de autorizaciones asociadas a la orden o `-1` si no está implementado.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected countAuthorizationByOrder(token_uuid: string): number {
    // Si quieres usar esta funcionalidad, retorne la cantidad de reutilizaciones de la orden.
    return -1;
  }

  /**
   * Obtiene una orden asociada a un token UUID. Este método debe ser implementado por las subclases.
   *
   * @abstract
   * @param {string} token_uuid - El identificador único del token.
   * @returns {Promise<Order>} Una promesa que se resuelve con la orden obtenida.
   */
  abstract getOrder(token_uuid: string): Promise<Order>;

  /**
   * Método abstracto para obtener órdenes pendientes de autorización.
   */
  abstract pendingAuthorizeOrders(): Promise<AuthorizeOrder[]>;

  /**
   * Maneja el evento de pre-autorización. Este método debe ser implementado por las subclases.
   *
   * @abstract
   * @param {WebhookPreAuthorization} webhook - El payload del webhook.
   * @param {Order} order - La orden asociada al webhook.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el evento se maneja.
   */
  abstract onPreAuthorizeEvent(
    webhook: WebhookPreAuthorization,
    order: Order
  ): Promise<void>;

  /**
   * Maneja eventos informativos del webhook. Este método debe ser implementado por las subclases.
   *
   * @abstract
   * @param {WebhookPreAuthorization} webhook - El payload del webhook.
   */
  abstract onInfoEvent(webhook: WebhookPreAuthorization): Promise<void>;

  /**
   * Evento abstracto para manejar el éxito del procesamiento de una autorización de orden.
   */
  abstract onSuccess(
    authorizeOrder: AuthorizeOrder,
    status_code: string
  ): Promise<void>;

  /**
   * Evento abstracto para manejar errores durante el procesamiento de una orden.
   */
  abstract onError(
    authorizeOrder: AuthorizeOrder,
    status_code: string
  ): Promise<void>;
}
