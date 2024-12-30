/**
 * Representa la estructura de una solicitud de revocación de token.
 */
export type RevokeRequest = {
  /**
   * Identificador único del comercio que solicita la revocación.
   */
  enroller_user_id: string;

  /**
   * Identificador único del token que se desea revocar.
   */
  token_uuid: string;
};
