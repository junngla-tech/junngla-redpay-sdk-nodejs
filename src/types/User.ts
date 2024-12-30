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

// export type Withdrawal = {
//   mode: Exclude<WithdrawalMode, WithdrawalMode.MANUAL>; // Cualquier tipo excepto MANUAL
//   settlement?: never;
// };

// export type WithdrawalManual = {
//   mode: WithdrawalMode.MANUAL;
//   settlement: Settlement;
// };

// export type UserCollectorType = UserBaseType & {
//   // user_type: UserType.COLLECTOR;
//   geo: IGeo;
//   gloss: string;
//   withdrawal: Withdrawal | WithdrawalManual;
//   tax_address: string;
// };

// export type UserPayerType = UserBaseType & {
//   // user_type: UserType.PAYER;
//   geo?: IGeo;
// };
