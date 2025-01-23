import { BaseError } from "./ClassBase";

export class RegisterAlreadyExist extends BaseError {
  constructor(resource: string, operation_uuid?: string, status_code?: string) {
    super({
      status: 400,
      data: {
        message: `${resource} already exist`,
        operation_uuid,
        status_code,
      },
    });
  }
}

export class UserNotFoundError extends BaseError {
  constructor(operation_uuid?: string, status_code?: string) {
    super({
      status: 404,
      data: { operation_uuid, message: "User not found", status_code },
    });
  }
}
