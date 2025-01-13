import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IAccount, IAccounts } from "../interface/RedPayConfig";
import { SbifCode } from "../types/SbifCode";
import { AccountType } from "../types/AccountType";
import { ClassBase } from "./ClassBase";

export class Account extends ClassBase<Account> implements IAccount {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  account_id!: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.account_id)
  private id!: string;

  @Expose()
  @Transform(({ obj }) => obj.number.toString(), { toPlainOnly: true })
  number!: number;

  @Expose()
  sbif_code!: SbifCode;

  @Expose()
  type!: AccountType;
}

export class Accounts extends ClassBase<Accounts> implements IAccounts {
  @Expose()
  @Type(() => Account)
  authorize?: Account;

  @Expose()
  @Type(() => Account)
  chargeback?: Account;

  @Expose()
  @Type(() => Account)
  chargeback_automatic?: Account;
}
