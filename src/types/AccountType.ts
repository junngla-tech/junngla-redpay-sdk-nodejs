/**
 * Tipo de cuenta bancaria basado en su descripción.
 * - `CORRIENTE`: Representa una cuenta corriente.
 * - `VISTA`: Representa una cuenta vista.
 */
export type AccountType = "CORRIENTE" | "VISTA";

/**
 * Identificador único del tipo de cuenta bancaria.
 * - `001`: Identificador para cuentas corrientes.
 * - `002`: Identificador para cuentas vistas.
 */
export type AccountId = "001" | "002";
