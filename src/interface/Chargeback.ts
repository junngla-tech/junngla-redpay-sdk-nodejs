import { SignedAuthorizationAccount } from "../model";

export interface IChargebackAPIResponse {
  operation_uuid: string;
  chargeback: IChargeback;
  signature: string;
}

interface IChargeback {
  uuid: string;
  reference: string;
  settlement_uuid: string;
  enroller_user_id: string;
  amount: number;
  filler: SignedAuthorizationAccount;
  debit_filler?: SignedAuthorizationAccount;
  signature: string;
}
