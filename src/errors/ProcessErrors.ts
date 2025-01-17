import { BaseError } from "./ClassBase";

export class ProcessAuthorizeError extends BaseError {
  constructor(operation_uuid?: string, status_code?: string) {
    super({
      status: 400,
      data: {
        message: "Failed to authorize process",
        operation_uuid,
        status_code,
      },
    });
  }
}
