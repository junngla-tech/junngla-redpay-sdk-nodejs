import { Filler } from "../model";

interface IFillerData {
  filler: Filler;
}

export interface IAmount extends IFillerData {
  amount: number;
  max_amount?: never;
}

export interface IMaxAmount extends IFillerData {
  amount?: never;
  max_amount: number;
}

export interface IAuthorizeResponse {
  token_uuid: string;
  operations: IOperations;
  is_med: boolean;
  timestamp: string;
  filler: Filler;
  settlement: ISettlement;
  operation_uuid: string;
  signature: string;
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
