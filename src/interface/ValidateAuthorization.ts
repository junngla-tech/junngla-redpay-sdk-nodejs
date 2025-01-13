import { SignedAuthorizationAccount } from "../model";

interface IValidateAuthorizationBaseAPIResponse {
  token_uuid: string;
  operations: IOperations;
  is_med: boolean;
  timestamp: Date;
  operation_uuid: string;
  signature: string;
}

export interface IValidateAuthorizationCollectorAPIResponse
  extends IValidateAuthorizationBaseAPIResponse {
  amount: number;
  collector_id: string;
  payer_id: string;
  status_code: string;
  extra_data: string;
}

interface IOperations {
  generation_uuid: string;
  verification_uuid: string;
  authorization_uuid: string;
}

interface ISettlement {
  uuid: string;
  reference: string;
  amount: number;
  status: string;
}

export interface IValidateAuthorizationPayerAPIResponse
  extends IValidateAuthorizationBaseAPIResponse {
  filler: SignedAuthorizationAccount;
  settlement: ISettlement;
}



