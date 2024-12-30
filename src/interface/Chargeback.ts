import { Filler } from "../model";

export interface IChargebackResponse {
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
  filler: Filler;
  debit_filler?: Filler;
  signature: string;
}
