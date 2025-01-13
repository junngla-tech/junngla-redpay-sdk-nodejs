import { SignedAuthorizationAccount } from "../model";

export interface IAuthorizeAPIResponse {
  token_uuid: string;
  operations: IOperations;
  is_med: boolean;
  timestamp: string;
  filler: SignedAuthorizationAccount;
  settlement?: ISettlement;
  operation_uuid: string;
  signature: string;
  collector_id?: string;
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
