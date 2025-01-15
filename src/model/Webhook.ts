import { STATUS_CODE_OK } from "../config/constants";
import { OrderIsRevokedError, OrderReuseLimitError } from "../errors";
import { RedPayConfigProvider } from "../provider";
import { RedPayIntegrity } from "../services";
import { WebhookPreAuthorization } from "../types";
import { Order } from "./Order";

export abstract class Webhook {
  /**
   * Procesa un webhook siguiendo un flujo predefinido: validación de firma, obtención de orden,
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
   * Valida si una orden excede el límite de reutilización permitido.
   *
   * @param {Order} order - La orden que se valida.
   * @throws {OrderReuseLimitError} Si la orden ha excedido el límite de reutilización.
   */
  private validateOrderReuse(order: Order): void {
    const count = this.countAuthorizationByOrder(order.uuid);
    if (count === -1) return;

    if (order.reusability <= count)
      throw new OrderReuseLimitError();
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
   * Obtiene una orden asociada a un token UUID. Este método debe ser implementado por las subclases.
   *
   * @abstract
   * @param {string} token_uuid - El identificador único del token.
   * @returns {Promise<Order>} Una promesa que se resuelve con la orden obtenida.
   */
  abstract getOrder(token_uuid: string): Promise<Order>;

  /**
   * Maneja eventos informativos del webhook. Este método debe ser implementado por las subclases.
   *
   * @abstract
   * @param {WebhookPreAuthorization} webhook - El payload del webhook.
   */
  abstract onInfoEvent(webhook: WebhookPreAuthorization): Promise<void>;
}
