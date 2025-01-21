import {
  Exclude,
  Expose,
  Transform,
  Type,
} from "class-transformer";
import { ClassBase } from "./ClassBase";
import { TokenType, UserType } from "../enum";

export class ValidateTokenRequest extends ClassBase<ValidateTokenRequest> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id)
  private enroller_user_id!: string;

  @Expose()
  token_uuid!: string;

  @Expose()
  user_type!: UserType;
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
