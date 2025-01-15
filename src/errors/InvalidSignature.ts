import { BaseError } from "./ClassBase";

export class InvalidSignatureError extends BaseError {
  constructor() {
    super({
      message: "Invalid signature",
      status_code: 401,
    });
  }
}
