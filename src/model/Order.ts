import { Expose, Transform } from "class-transformer";
import { ClassBase } from "./ClassBase";

export class Order extends ClassBase<Order> {
  @Expose()
  uuid!: string;

  @Expose()
  private is_confirmed: boolean = false;

  @Expose()
  @Transform(({ value }) => value ?? 1)
  reusability?: number;

  @Expose()
  revoked_at?: Date | null;

  /**
   * Setter que siempre establece el estado de confirmación a `true`.
   */
  set isConfirmed(_value: boolean) {
    this.is_confirmed = true;
  }
}
