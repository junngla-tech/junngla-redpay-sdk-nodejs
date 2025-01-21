import { Expose, Transform } from "class-transformer";
import { ClassBase } from "./ClassBase";

export class Order extends ClassBase<Order> {
  @Expose()
  token_uuid!: string;

  @Expose()
  user_id!: string;

  @Expose()
  amount!: number;

  @Expose()
  @Transform(({ value }) => value ?? 1)
  reusability?: number;

  @Expose()
  revoked_at?: Date | null;
}
