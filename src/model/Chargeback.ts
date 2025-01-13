import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";
import { SignedAuthorizationAccount } from "./SignedAuthorization";
import { UserCollectorRequest } from "./User";
import { ClassBase } from "./ClassBase";
import { AuthorizationMode } from "../enum";
import { RedPayConfigProvider } from "../provider";

export class ChargebackRequest extends ClassBase<ChargebackRequest> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user!: UserCollectorRequest;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user.user_id)
  private enroller_user_id!: string;

  @Expose()
  authorization_uuid!: string;

  @Expose()
  amount!: number;

  @Expose({ toPlainOnly: true })
  @Transform(() => {
    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.Chargeback);
    return filler;
  })
  private filler!: SignedAuthorizationAccount;

  @Expose({ toPlainOnly: true })
  @Transform(() => {
    const config = RedPayConfigProvider.getInstance().getConfig();

    if (!config.secrets?.chargeback_automatic) return undefined;

    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.ChargebackAutomatic);
    return filler;
  })
  private debit_filler?: SignedAuthorizationAccount;
}

class Chargeback {
  @Expose()
  readonly uuid!: string;

  @Expose()
  readonly reference!: string;

  @Expose()
  readonly settlement_uuid!: string;

  @Expose()
  @Transform(({ obj }) => obj.enroller_user_id)
  readonly user_id!: string;

  @Exclude()
  private enroller_user_id!: string;

  @Expose()
  readonly amount!: number;

  @Expose()
  @Transform(({ obj }) => obj.filler)
  readonly signed_authorization_account!: SignedAuthorizationAccount;

  @Exclude()
  private filler!: SignedAuthorizationAccount;

  @Expose()
  @Transform(({ obj }) => obj.debit_filler)
  readonly signed_authorization_account_automatic?: SignedAuthorizationAccount;

  @Exclude()
  private debit_filler?: SignedAuthorizationAccount;

  @Expose()
  readonly signature!: string;
}

export class ChargebackResponse {
  @Expose()
  @Transform(({ obj }) => plainToInstance(Chargeback, obj.chargeback))
  readonly chargeback!: Chargeback;

  @Expose()
  readonly operation_uuid!: string;

  @Expose()
  readonly signature!: string;
}
