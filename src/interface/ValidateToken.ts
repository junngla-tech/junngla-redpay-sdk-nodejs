import { TokenType } from "../enum";

interface IValidateTokenBase {
  operation_uuid: string;
  gloss: string;
  detail: string;
  token_uuid: string;
  signature: string;
}

interface IData {
  amount: number;
}

export interface IValidateWithData extends IValidateTokenBase {
  token_type: Exclude<TokenType, TokenType.T1>; // Cualquier tipo excepto T1
  data: IData;
}

export interface IValidateWithoutData extends IValidateTokenBase {
  token_type: TokenType.T1;
  data?: never; // Explicitamente no permite `data`
}