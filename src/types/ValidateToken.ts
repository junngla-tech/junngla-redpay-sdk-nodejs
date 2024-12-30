import { UserType } from "../enum";

/**
 * Representa la estructura para la validación de un token.
 */
export type ValidateToken = {
  /**
   * UUID único del token que se desea validar.
   */
  token_uuid: string;

  /**
   * Identificador único del usuario o comercio.
   */
  enroller_user_id: string;

  /**
   * Tipo de usuario que solicita la validación del token.
   * Puede ser `collector` o `payer`.
   */
  user_type: UserType;
};
