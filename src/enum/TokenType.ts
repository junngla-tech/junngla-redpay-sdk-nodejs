/**
 * Enum que define los tipos de tokens disponibles en el sistema.
 */
export enum TokenType {
  /** Token de transacción */
  T0 = "T0",

  /** Token de suscripción */
  T1 = "T1",

  /** Token de cobro de suscripción */
  T2 = "T2",

  /** Token de envío de dinero (AliasSend) */
  T3 = "T3",

  /** Token de transacción con un alias (AliasPay) */
  T4 = "T4",

  /** Token del portal de recarga devoluciones */
  T6 = "T6",
}
