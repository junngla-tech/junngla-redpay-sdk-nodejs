import { Expose } from "class-transformer";
import { ClassBase } from "./ClassBase";

/**
 * Representa una orden de autorización con los datos necesarios para su gestión.
 * Extiende la clase genérica `ClassBase` para AuthorizeOrder.
 */
export class AuthorizeOrder extends ClassBase<AuthorizeOrder> {
  /**
   * UUID de la autorización asociada a la orden.
   * @type {string}
   */
  @Expose()
  authorization_uuid!: string;

  /**
   * UUID del token asociado a la orden.
   * @type {string}
   */
  @Expose()
  token_uuid!: string;

  /**
   * Identificador único del usuario que genera la orden.
   * @type {string}
   */
  @Expose()
  user_id!: string;

  /**
   * Indica si la orden ha sido confirmada.
   * Valor por defecto: `false`.
   * @type {boolean}
   */
  @Expose()
  is_confirmed: boolean = false;

  /**
   * Código de estado personalizado de RedPay sobre la orden. Se debera asignar un valor cuando se procese la autorización de la orden con los eventos `onSuccess` o `onError`.
   * @type {string | null | undefined}
   */
  @Expose()
  status_code?: string | null;
}
