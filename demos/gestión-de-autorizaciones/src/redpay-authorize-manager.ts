import {
  AuthorizeOrder,
  Order,
  RedPayAuthorizationManager as _RedPayAuthorizationManager,
  WebhookPreAuthorization,
} from "redpay-sdk-nodejs";
import * as path from "path";
import { FileUtils } from "./utils/file";

/**
 * Clase que extiende `RedPayAuthorizationManager` para manejar operaciones de autorización,
 * incluyendo pre-autorización, eventos informativos y manejo de errores.
 */
export class RedPayAuthorizationManager extends _RedPayAuthorizationManager {
  private dirPath: string = path.resolve(__dirname, "./json");

  /**
   * Recupera una orden desde el sistema de almacenamiento.
   *
   * @param {string} token_uuid - Identificador único del token asociado a la orden.
   * @returns {Promise<Order>} Una promesa que resuelve con la orden recuperada.
   *
   * @throws {Error} Si ocurre un error al leer la orden del archivo.
   */
  async getOrder(token_uuid: string): Promise<Order> {
    const getOrder = await FileUtils.readFile<Order>(
      this.dirPath,
      "orders",
      token_uuid
    );
    return new Order(getOrder);
  }

  /**
   * Maneja el evento de pre-autorización, procesando el webhook recibido y almacenando la orden de autorización.
   *
   * @param {WebhookPreAuthorization} webhook - Payload del webhook de pre-autorización.
   * @param {Order} order - Orden asociada al webhook.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el evento de pre-autorización se procesa.
   */
  async onPreAuthorizeEvent(
    webhook: WebhookPreAuthorization,
    order: Order
  ): Promise<void> {
    console.log("Pre-autorización procesada");

    const authorizeOrder = new AuthorizeOrder({
      authorization_uuid: webhook.operations.authorization_uuid,
      token_uuid: webhook.token_uuid,
      user_id: order.user_id,
      is_confirmed: false,
    });

    await FileUtils.writeFile(
      this.dirPath,
      "pre_authorization_event",
      authorizeOrder.authorization_uuid,
      authorizeOrder
    );
  }

  /**
   * Maneja un evento informativo del webhook.
   *
   * @param {WebhookPreAuthorization} webhook - Payload del webhook informativo.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el evento informativo se procesa.
   */
  // TODO: Crear alias de tipo de PreAuthorizationEvent , y la propiedad se llama event: PreAuthorizationEvent
  async onInfoEvent(webhook: WebhookPreAuthorization): Promise<void> {
    console.log("Evento informativo recibido", JSON.stringify(webhook));
  }

  /**
   * Recupera las órdenes pendientes de autorización desde el sistema de almacenamiento.
   *
   * @returns {Promise<AuthorizeOrder[]>} Una promesa que resuelve con un arreglo de órdenes pendientes.
   *
   * @throws {Error} Si ocurre un error al leer las órdenes pendientes.
   */
  async pendingAuthorizeOrders(): Promise<AuthorizeOrder[]> {
    return await FileUtils.readFiles<AuthorizeOrder>(
      this.dirPath,
      "pre_authorization_event"
    );
  }

  /**
   * Maneja el éxito de una autorización, marcándola como confirmada y eliminando su pre-autorización.
   *
   * @param {AuthorizeOrder} authorizeOrder - Orden autorizada.
   * @param {string} status_code - Código de estado que indica el éxito de la autorización.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el éxito es manejado.
   *
   * @throws {Error} Si ocurre un error al escribir o eliminar archivos relacionados con la orden.
   */
  async onSuccess(
    authorizeOrder: AuthorizeOrder,
    status_code: string
  ): Promise<void> {
    try {
      console.log(
        "Validación de autorización exitosa:",
        JSON.stringify(authorizeOrder)
      );
      // Marcar la orden como confirmada
      authorizeOrder.is_confirmed = true;
      authorizeOrder.status_code = status_code;

      /**
       * @description
       * En este demo, la información de la orden confirmada se escribe en un archivo local para fines de simulación.
       *
       * **Nota**: En una implementación real, esta lógica debe ser reemplazada por el uso de una base de datos
       * para garantizar un manejo seguro, eficiente y escalable de las órdenes.
       *
       */
      await FileUtils.writeFile(
        this.dirPath,
        "onSuccess",
        authorizeOrder.authorization_uuid,
        authorizeOrder
      );

      const preAuthFilePath = path.join(
        this.dirPath,
        "pre_authorization_event",
        authorizeOrder.authorization_uuid
      );

      await FileUtils.deleteFileIfExists(preAuthFilePath);
    } catch (error) {
      console.error("Error en onSuccess:", error);
    }
  }

  /**
   * Maneja un error en la autorización, marcándola como fallida y eliminando su pre-autorización.
   *
   * @param {AuthorizeOrder} authorizeOrder - Orden que falló en la autorización.
   * @param {string} status_code - Código de estado que indica el fallo de la autorización.
   * @returns {Promise<void>} Una promesa que se resuelve cuando el error es manejado.
   *
   * @throws {Error} Si ocurre un error al escribir o eliminar archivos relacionados con la orden.
   */
  async onError(
    authorizeOrder: AuthorizeOrder,
    status_code: string
  ): Promise<void> {
    try {
      console.log(
        "Error en la validación de autorización:",
        JSON.stringify(authorizeOrder)
      );
      // Marcar la orden como rechazada
      authorizeOrder.is_confirmed = true;
      authorizeOrder.status_code = status_code;

      /**
       * @description
       * En este demo, la información de la orden confirmada se escribe en un archivo local para fines de simulación.
       *
       * **Nota**: En una implementación real, esta lógica debe ser reemplazada por el uso de una base de datos
       * para garantizar un manejo seguro, eficiente y escalable de las órdenes.
       *
       */
      await FileUtils.writeFile(
        this.dirPath,
        "onError",
        authorizeOrder.authorization_uuid,
        authorizeOrder
      );

      const preAuthFilePath = path.join(
        this.dirPath,
        "pre_authorization_event",
        authorizeOrder.authorization_uuid
      );

      await FileUtils.deleteFileIfExists(preAuthFilePath);
    } catch (error) {
      console.error("Error en onError:", error);
    }
  }
}
