import { Exclude, Expose, Transform, Type } from "class-transformer";
import { UserPayerRequest } from "./User";
import { AuthorizationMode, TokenType } from "../enum";
import { SignedAuthorizationAccount } from "./SignedAuthorization";
import { ClassBase } from "./ClassBase";
import { ISettlement } from "../interface";

class Data extends ClassBase<Data> {
  @Expose()
  amount?: number;

  @Expose()
  max_amount?: number;

  @Expose()
  filler!: SignedAuthorizationAccount;
}

export class AuthorizeRequest extends ClassBase<AuthorizeRequest> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user!: UserPayerRequest;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user.user_id)
  private enroller_user_id!: string;

  @Expose()
  token_uuid!: string;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  validation_uuid!: string; // UUID de la operación de validación previamente realizada. (operation_uuid)

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.validation_uuid)
  private parent_uuid!: string;

  @Expose()
  token_type!: TokenType;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  amount!: number;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => {
    const { token_type, amount } = obj;

    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.Authorize);

    const data = new Data();
    data.filler = filler;
    token_type !== TokenType.T1
      ? (data.amount = amount)
      : (data.max_amount = amount);

    return data;
  })
  private data!: Data;
}

export class Operations {
  @Expose()
  readonly generation_uuid!: string;

  @Expose()
  readonly verification_uuid!: string;

  @Expose()
  readonly authorization_uuid!: string;
}

export class AuthorizeResponse {
  @Expose()
  readonly token_uuid!: string;

  @Expose()
  readonly operations!: Operations;

  @Expose()
  readonly is_med!: boolean;

  @Expose()
  @Type(() => Date)
  readonly timestamp!: Date;

  @Expose()
  @Transform(({ obj }) => obj.filler)
  readonly signed_authorization_account!: SignedAuthorizationAccount;

  @Exclude()
  private filler!: SignedAuthorizationAccount;

  @Expose()
  readonly settlement?: ISettlement;

  @Expose()
  readonly collector_id!: string;

  @Expose()
  readonly operation_uuid!: string;

  @Expose()
  readonly signature!: string;
}
