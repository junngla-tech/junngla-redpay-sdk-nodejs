import { TokenType } from "../enum";
import {
  TokenT0Request,
  TokenT1Request,
  TokenT2Request,
  TokenT3Request,
  TokenT4Request,
  UserCollectorRequest,
} from "../model";

export interface ITokenBase {
  user: UserCollectorRequest;
  detail: string;
  extra_data?: string;
  lifetime?: number;
  reusability?: number;
}

export interface IData {
  amount: number;
}

export interface ITokenAPIResponse {
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

export interface ITokenResponse {
  token: TokenT0Request | TokenT1Request | TokenT2Request | TokenT3Request | TokenT4Request;
  operation_uuid: string;
  signature: string;
}
