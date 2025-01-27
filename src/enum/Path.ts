/**
 * Enum que define las rutas utilizadas en los servicios de RedPay.
 * Cada valor corresponde a un endpoint específico para realizar operaciones.
 */
export enum PathUrl {
  /** Ruta para generar un token de pago */
  Generate = "/payment-token/generate",

  /** Ruta para revocar un token de pago */
  Revoke = "/payment-token/revoke",

  /** Ruta para validar un token de pago */
  ValidateToken = "/payment-token/check",

  /** Ruta para autorizar un token de pago */
  Authorize = "/payment-token/authorize",

  /** Ruta para validar una autorización */
  ValidateAuthorization = "/authorization/check",

  /** Ruta para realizar un contracargo (chargeback) */
  Chargeback = "/chargeback",

  /** Ruta para la gestión de usuarios (crear, actualizar, etc.) */
  User = "/user",

  /** Ruta para verificar el enrolamiento de un usuario */
  UserVerify = "/user/verify-enrollment?",
}
