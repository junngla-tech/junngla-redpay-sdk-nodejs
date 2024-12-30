import { ScheduleMode, UserType } from "../enum";
import { AccountId, SbifCode } from "../types";

export interface IUserAccount {
  id: string;
  owner_id: SbifCode;
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
}

export interface IUserCollectorResponse extends IUserCollector {
  required_activation: boolean;
  closed_loop: boolean;
}

export interface IUserPayer extends IUserBase {
  user_type: UserType.PAYER;
  geo?: IGeo;
}

export interface IUserPayerResponse extends IUserPayer {
  closed_loop: boolean;
}
