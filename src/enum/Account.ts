/**
 * Enum que representa los tipos de cuenta que un usuario puede tener.
 *
 * - `CUENTA_CORRIENTE`: Representa una cuenta corriente con el código "001".
 * - `CUENTA_VISTA`: Representa una cuenta vista con el código "002".
 */
export enum AccountUser {
  /**
   * Cuenta Corriente.
   */
  CUENTA_CORRIENTE = "001",

  /**
   * Cuenta Vista.
   */
  CUENTA_VISTA = "002",
}

/**
 * Enum que representa los tipos de cuenta con descripciones textuales.
 *
 * - `CORRIENTE`: Representa una cuenta corriente.
 * - `VISTA`: Representa una cuenta vista.
 */
export enum AccountAuthorization {
  /**
   * Representa una cuenta corriente.
   */
  CORRIENTE = "CORRIENTE",

  /**
   * Representa una cuenta vista.
   */
  VISTA = "VISTA",
}
