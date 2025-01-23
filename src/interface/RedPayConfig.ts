import { Enroller } from "../enum";
import { AccountType, SbifCode } from "../types";

export interface IRedPayConfig {
  secrets: ISecrets;
  environment: string;
  certificates: ICertificates;
  type: Enroller;
  accounts?: IAccounts;
}

export interface ISecrets {
  integrity: string;
  authorize?: string;
  chargeback?: string;
  chargeback_automatic?: string;
}

export interface ICertificates {
  cert_path: string;
  key_path: string;
  verify_SSL?: boolean;
}

export interface IAccounts {
  authorize?: IAccount;
  chargeback?: IAccount;
  chargeback_automatic?: IAccount;
}

export interface IAccount {
  id: string;
  number: number;
  bank: SbifCode;
  type: AccountType;
}
