import { Expose, Transform } from "class-transformer";
import { ClassBase } from "./ClassBase";

/**
 * Representa una orden con los datos necesarios para su gestión.
 * Extiende la clase genérica `ClassBase` para la clase Order.
 */
export class Order extends ClassBase<Order> {
  /**
   * UUID del token asociado a la orden.
   * @type {string}
   */
  @Expose()
  token_uuid!: string;

  /**
   * Identificador único del comercio que genera la orden.
   * @type {string}
   */
  @Expose()
  user_id!: string;

  /**
   * Monto asociado a la orden.
   * @type {number}
   */
  @Expose()
  amount!: number;

  /**
   * cantidad de autorizaciones que puede recibir la orden. Si no se especifica, por defecto se asigna el valor `1`.
   * @type {number | undefined}
   */
  @Expose()
  @Transform(({ value }) => value ?? 1)
  reusability?: number;

  /**
   * Fecha en la que la orden fue revocada, si aplica. Puede ser `null` o no estar definida.
   * @type {Date | null | undefined}
   */
  @Expose()
  revoked_at?: Date | null;
}
