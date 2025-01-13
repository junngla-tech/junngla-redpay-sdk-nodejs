import { Expose, Type } from "class-transformer";
import { Secrets } from "./Secret";
import { Certificate } from "./Certificate";
import { Accounts } from "./Account";
import { Enroller } from "../enum";
import { IRedPayConfig } from "../interface";
import { ClassBase } from "./ClassBase";

export class RedPayConfig
  extends ClassBase<RedPayConfig>
  implements IRedPayConfig
{
  @Expose()
  @Type(() => Secrets)
  secrets!: Secrets;

  @Expose()
  environment!: string;

  @Expose()
  @Type(() => Certificate)
  certificates!: Certificate;

  @Expose()
  type!: Enroller;

  @Expose()
  @Type(() => Accounts)
  accounts?: Accounts;
}
