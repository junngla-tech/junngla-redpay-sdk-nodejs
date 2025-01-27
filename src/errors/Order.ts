import { BaseError } from "./ClassBase";

export class OrderIsRevokedError extends BaseError {
  constructor() {
    super({
      status: 406,
      data: {
        message: "Order is revoked",
      }
    });
  }
}

export class OrderReuseLimitError extends BaseError {
  constructor() {
    super({
      status: 406,
      data: {
        message: "Order reuse limit reached",
      }
    });
  }
}
