import { TokenType } from "../enum";
import { IData } from "./Token";

export interface IValidateTokenAPIResponse {
  operation_uuid: string;
  gloss: string;
  detail: string;
  token_uuid: string;
  signature: string;
  token_type: TokenType;
  data?: IData;
}
