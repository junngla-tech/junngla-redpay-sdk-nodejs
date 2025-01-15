import { BaseError } from "./ClassBase";

export class OrderIsRevokedError extends BaseError {
  constructor() {
    super({
      message: "Order is revoked",
      status_code: 406,
    });
  }
}

export class OrderReuseLimitError extends BaseError {
  constructor() {
    super({
      message: "Order reuse limit reached",
      status_code: 406,
    });
  }
}
