import { ScheduleMode, UserType, WithdrawalMode } from "../enum";
import { UserCollectorRequest, UserPayerRequest } from "../model";
import { AccountId, SbifCode } from "../types";

export interface IUserAccount {
  number: number;
  sbif_code: SbifCode;
  type: AccountId;
  tax_id: string;
}

export interface IGeo {
  lat: number;
  lng: number;
}

export interface ISettlementSchedule {
  mode: ScheduleMode;
  value: number[];
}

export interface ISettlement {
  schedule: ISettlementSchedule;
}

export interface IWithdrawal {
  mode: WithdrawalMode;
  settlement?: ISettlement;
}

export interface IUserBase {
  enroller_user_id: string;
  name: string;
  tax_id: string;
  email: string;
  account: IUserAccount;
}

export interface IUserCollector extends IUserBase {
  user_type: UserType.COLLECTOR;
  tax_address: string;
  gloss: string;
  geo: IGeo;
  settlement: ISettlement;
  closed_loop?: boolean;
}

export interface IUserCollectorAPIResponse {
  user: IUserCollector & { required_activation: boolean };
  operation_uuid: string;
  signature: string;
}

export interface IUserPayer extends IUserBase {
  user_type: UserType.PAYER;
  geo?: IGeo;
  closed_loop?: boolean;
}

export interface IUserPayerAPIResponse {
  user: IUserPayer;
  operation_uuid: string;
  signature: string;
}

export interface IUserResponse {
  user: UserCollectorRequest | UserPayerRequest;
  operation_uuid: string;
  signature: string;
}

