/**
 * Representa la estructura base para la validación de autorizaciones.
 */
interface ValidateAuthorization {
  /**
   * Identificador único del usuario o comercio.
   */
  enroller_user_id: string;

  /**
   * Tipo de usuario, puede ser un tipo definido como `collector` o `payer`.
   */
  user_type: string;
}

/**
 * Representa la validación de autorizaciones para un recolector (collector).
 */
export type ValidateAuthorizationCollector = ValidateAuthorization & {
  /**
   * UUID de la autorización que se está validando.
   */
  authorization_uuid: string;
};

/**
 * Representa la validación de autorizaciones para un pagador (payer).
 */
export type ValidateAuthorizationPayer = ValidateAuthorization & {
  /**
   * UUID de la validación que se realizo sobre la transacción.
   */
  validation_uuid: string;

  /**
   * UUID de la autorización que se está validando (opcional).
   */
  authorization_uuid?: string;
};
