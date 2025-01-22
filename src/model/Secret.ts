import { Expose } from "class-transformer";
import { ISecrets } from "../interface";
import { ClassBase } from "./ClassBase";

/**
 * Representa los secretos utilizados para la configuración de seguridad y operaciones de RedPay.
 * Extiende la clase genérica `ClassBase` y cumple con la interfaz `ISecrets`.
 */
export class Secrets extends ClassBase<Secrets> implements ISecrets {
  /**
   * Secreto utilizado para verificar la integridad de los datos.
   * @type {string}
   */
  @Expose()
  integrity!: string;

  /**
   * Secreto utilizado para operaciones de autorización.
   * Es opcional y puede no estar definido.
   * @type {string | undefined}
   */
  @Expose()
  authorize?: string;

  /**
   * Secreto utilizado para gestionar devoluciones de cargos (chargebacks).
   * Es opcional y puede no estar definido.
   * @type {string | undefined}
   */
  @Expose()
  chargeback?: string;

  /**
   * Secreto utilizado para devoluciones de cargos automáticas (chargeback automatic).
   * Es opcional y puede no estar definido.
   * @type {string | undefined}
   */
  @Expose()
  chargeback_automatic?: string;
}
