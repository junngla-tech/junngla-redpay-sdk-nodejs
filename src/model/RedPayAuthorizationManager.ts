import { STATUS_CODE_OK, STATUS_CODE_RETRY } from "../config/constants";
import {
  ImplementationError,
  OrderIsRevokedError,
  OrderReuseLimitError,
  ProcessAuthorizeError,
} from "../errors";
import { RedPayConfigProvider } from "../provider";
import { RedPayIntegrity, RedPayService } from "../services";
import { WebhookPreAuthorization } from "../types";
import { AuthorizeOrder } from "./AuthorizeOrder";
import { Order } from "./Order";
import { ValidateAuthorizationCollectorRequest } from "./ValidateAuthorization";
import { IError } from "../interface";
import { UserType } from "../enum";

export abstract class RedPayAuthorizationManager {
  private intervalId?: NodeJS.Timeout;
  private isProcessing = false;
  protected readonly redPayService: RedPayService;

  constructor(redPayService?: RedPayService) {
    this.redPayService = redPayService || new RedPayService();
  }

  /**
 * Procesa un webhook de pre-autorización siguiendo un flujo predefinido.
 * 
 * Este método realiza las siguientes acciones:
 * 1. **Validación de Firma**: Verifica que la firma incluida en el webhook sea válida.
 * 2. **Obtención de la Orden**: Recupera la orden asociada al `token_uuid` proporcionado en el webhook.
 * 3. **Validación del Código de Estado**:
 *    - Determina si el código de estado del webhook indica un evento válido o informativo.
 * 4. **Verificación de Revocación**: Comprueba si la orden ha sido revocada previamente.
 * 5. **Validación de Reutilización**: Garantiza que la orden pueda ser reutilizada según el límite establecido.
 * 6. **Ejecución de Eventos**:
 *    - Si el código de estado es válido, ejecuta el evento de pre-autorización (`onPreAuthorizeEvent`).
 *    - Si no, ejecuta el evento informativo (`onInfoEvent`).
 * 
 * @param {WebhookPreAuthorization} webhook - El payload del webhook que contiene los datos del evento.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el procesamiento del webhook finaliza.
 * 
 * @throws {Error} Si alguna de las validaciones falla o se detecta una inconsistencia en el flujo.
 */
  public async processWebhookPreAuthorize(webhook: WebhookPreAuthorization): Promise<void> {
    this.validateSignature(webhook);

    const { token_uuid } = webhook;

    // Flujo de procesamiento del webhook.
    const order = await this.getOrder(token_uuid);
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
   *
   * Este método realiza las siguientes acciones:
   * - Verifica si ya hay un intervalo activo y, de ser así, no inicia otro.
   * - Configura un intervalo que se ejecuta cada 1000 ms.
   * - En cada iteración:
   *   1. Verifica si ya hay un procesamiento en curso para evitar concurrencia.
   *   2. Recupera las órdenes pendientes mediante `pendingAuthorizeOrders`.
   *   3. Si no hay órdenes pendientes, detiene el procesamiento llamando a `stop`.
   *   4. Procesa todas las órdenes pendientes llamando a `processAuthorizeOrders`.
   * - Maneja errores lanzados durante el procesamiento y clasifica errores de implementación (`ImplementationError`) y otros errores (`ProcessAuthorizeError`).
   * - Marca el estado de procesamiento (`isProcessing`) como `false` al finalizar cada iteración.
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
        if (error instanceof ImplementationError) {
          throw new ImplementationError(error);
        }

        const err = error as IError;
        throw new ProcessAuthorizeError(
          err.data?.operation_uuid,
          err.data?.status_code
        );
      } finally {
        this.isProcessing = false;
      }
    }, 1000);
  }

  /**
   * Detiene el procesamiento periódico de órdenes.
   *
   * Este método:
   * - Limpia el intervalo activo mediante `clearInterval`.
   * - Elimina el identificador del intervalo (`intervalId`).
   * - Restablece el estado de procesamiento (`isProcessing`) a `false`.
   */
  public stop(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    delete this.intervalId;
    this.isProcessing = false;
  }

  /**
   * Procesa múltiples autorizaciones de órdenes.
   *
   * @param {AuthorizeOrder[]} authorizeOrders - Lista de órdenes a autorizar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando todas las autorizaciones se procesan.
   */
  private async processAuthorizeOrders(
    authorizeOrders: AuthorizeOrder[]
  ): Promise<void> {
    for (const order of authorizeOrders) {
      await this.processSingleAuthorization(order);
    }
  }

  /**
   * Procesa una sola autorización de orden.
   *
   * Este método:
   * - Envía una solicitud para validar la autorización mediante `redPayService.validateAuthorization`.
   * - En caso de éxito, ejecuta `onSuccess`.
   * - En caso de error, maneja el error con `handleAuthorizationError`.
   *
   * @param {AuthorizeOrder} authorizeOrder - Orden de autorización a procesar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la autorización es procesada.
   */
  private async processSingleAuthorization(
    authorizeOrder: AuthorizeOrder
  ): Promise<void> {
    let response;
    try {
      response = await this.redPayService.validateAuthorization(
        new ValidateAuthorizationCollectorRequest({
          authorization_uuid: authorizeOrder.authorization_uuid,
          user_id: authorizeOrder.user_id,
          user_type: UserType.COLLECTOR,
        })
      );
    } catch (err) {
      await this.handleAuthorizationError(authorizeOrder, err as IError);
    }

    if (!response) return;

    try {
      await this.onSuccess(authorizeOrder, response.status_code!);
    } catch (err) {
      throw new ImplementationError(err as Error);
    }
  }

  /**
   * Maneja errores de autorización de órdenes.
   *
   * Este método:
   * - Si el error tiene un `status_code` de reintento, espera 2 segundos y vuelve a intentar procesar la orden.
   * - Si el error no permite reintento, llama a `onError` para manejar el fallo.
   *
   * @param {AuthorizeOrder} authorizeOrder - Orden que causó el error.
   * @param {IError} error - Error que ocurrió durante el procesamiento.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el error es manejado.
   */
  private async handleAuthorizationError(
    authorizeOrder: AuthorizeOrder,
    error: IError
  ): Promise<void> {
    if (error.data?.status_code === STATUS_CODE_RETRY) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await this.processSingleAuthorization(authorizeOrder);
    } else {
      await this.onError(authorizeOrder, error.data!.status_code!);
    }
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
