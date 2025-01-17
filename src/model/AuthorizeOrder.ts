import { Expose } from "class-transformer";
import { ClassBase } from "./ClassBase";

export class AuthorizeOrder extends ClassBase<AuthorizeOrder> {
  @Expose()
  authorization_uuid!: string;

  @Expose()
  token_uuid!: string;

  @Expose()
  user_id!: string;

  @Expose()
  is_confirmed: boolean = false;

  @Expose()
  status_code?: string | null;
}
