import { TokenType } from "../enum";

export interface ITokenBase {
  enroller_user_id: string;
  detail?: string;
  extra_data?: string;
  lifetime?: number;
  reusability?: number;
}

export interface IData {
  amount: number;
}

export interface ITokenResponse {
  operation_uuid: string;
  signature: string;
  payment_token: IPaymentToken;
}

export interface IPaymentToken {
  detail: string;
  token_uuid: string;
  lifetime: number;
  extra_data: string;
  reusability: number;
  enroller_user_id: string;
  token_number?: string;
  token_url: string;
  token_type: TokenType;
  data?: IData;
}