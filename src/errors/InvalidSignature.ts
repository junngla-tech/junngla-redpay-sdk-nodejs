import { BaseError } from "./ClassBase";

export class InvalidSignatureError extends BaseError {
  constructor() {
    super({
      status: 401,
      data: {
        message: "Invalid signature",
      },
    });
  }
}
