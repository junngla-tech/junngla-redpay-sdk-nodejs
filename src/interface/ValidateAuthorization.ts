import { Filler } from "../model";

interface IValidateAuthorizationBaseResponse {
  token_uuid: string;
  operations: IOperations;
  is_med: boolean;
  timestamp: string; //TODO: Revisar tipo
  operation_uuid: string;
  signature: string;
}

export interface IValidateAuthorizationCollectorResponse
  extends IValidateAuthorizationBaseResponse {
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

export interface IValidateAuthorizationPayerResponse
  extends IValidateAuthorizationBaseResponse {
  filler: Filler;
  settlement: ISettlement;
}

interface ISettlement {
  uuid: string;
  reference: string;
  amount: number;
  status: string;
}
