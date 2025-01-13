import { UserType } from "../enum";

/**
 * Representa los parámetros necesarios para operaciones relacionadas con usuarios.
 */
export type UserParams = {
  /**
   * Identificador único del usuario o comercio.
   */
  enroller_user_id: string;

  /**
   * Tipo de usuario, definido por `UserType` (por ejemplo, COLLECTOR o PAYER).
   */
  user_type: UserType;
};
