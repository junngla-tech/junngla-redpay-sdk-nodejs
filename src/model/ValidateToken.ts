import {
  Exclude,
  Expose,
  instanceToPlain,
  Transform,
  Type,
} from "class-transformer";
import { UserCollectorRequest, UserPayerRequest } from "./User";
import { ClassBase } from "./ClassBase";
import { TokenType } from "../enum";

export class ValidateTokenRequest extends ClassBase<ValidateTokenRequest> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user!: UserCollectorRequest | UserPayerRequest;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user.user_id)
  private enroller_user_id!: string;

  @Expose()
  token_uuid!: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => {
    const userPlain = instanceToPlain(obj.user);
    return userPlain.user_type;
  })
  private user_type!: string;
}

export class ValidateTokenData {
  @Expose()
  readonly amount!: number;
}

export class ValidateTokenResponse  {
  @Expose()
  readonly gloss!: string;

  @Expose()
  readonly detail!: string;

  @Expose()
  readonly token_uuid!: string;

  @Expose()
  readonly token_type!: TokenType;

  @Expose()
  @Type(() => ValidateTokenData)
  readonly data?: ValidateTokenData;

  @Expose()
  readonly operation_uuid!: string;

  @Expose()
  readonly signature!: string;
}
