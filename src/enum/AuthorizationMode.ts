/**
 * Enum que representa los diferentes modos de operación de una devolución.
 * Utilizado para definir el propósito de la operación en servicios de RedPay.
 */
export enum AuthorizationMode {
  /** Representa una autorización de transacción */
  Authorize = "authorize",

  /** Representa una devolución (chargeback) */
  Chargeback = "chargeback",

  /** Representa una devolución automática */
  ChargebackAutomatic = "chargeback_automatic",
}
