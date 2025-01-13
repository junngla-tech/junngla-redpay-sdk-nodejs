import { Exclude, Expose, Transform, Type } from "class-transformer";
import { UserCollectorRequest } from "./User";
import { ClassBase } from "./ClassBase";

export class RevokeTokenRequest extends ClassBase<RevokeTokenRequest> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user!: UserCollectorRequest;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user.user_id)
  private enroller_user_id!: string;

  @Expose()
  token_uuid!: string;
}

export class RevokeTokenResponse {
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Transform(({ obj }) => obj.description)
  readonly gloss!: string;

  @Expose()
  readonly detail!: string;

  @Expose()
  @Type(() => Date)
  readonly revoked_at!: Date;

  @Expose()
  readonly operation_uuid!: string;

  @Expose()
  readonly signature!: string;

  @Exclude()
  private description!: string;
}
