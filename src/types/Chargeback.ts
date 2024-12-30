import { Filler } from "../model";

/**
 * Representa la estructura de una solicitud de devolución (Chargeback).
 */
export type ChargebackRequest = {
  /**
   * Identificador único de la autorización que se desea devolver.
   */
  authorization_uuid: string;

  /**
   * Identificador único del comercio.
   */
  enroller_user_id: string;

  /**
   * Monto que se desea devolver.
   */
  amount: number;

  /**
   * Objeto `Filler` que es una segunda llave de seguridad requerido en todos los modelos de operación de devolución.
   */
  filler: Filler;

  /**
   * Objeto `Filler` opcional que es requerido solamente cuando el enrolador tiene una configuración de devoluciones con cargo automatico.
   */
  debit_filler?: Filler;
};
