import { Expose } from "class-transformer";

export class Order {
  @Expose()
  uuid!: string;

  @Expose()
  status_code!: string;

  @Expose()
  reusability!: number;

  @Expose()
  is_confirmed!: boolean;

  @Expose()
  revoked_at?: Date | null;
}
