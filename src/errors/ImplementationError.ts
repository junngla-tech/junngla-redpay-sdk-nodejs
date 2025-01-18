import { BaseError } from "./ClassBase";

export class ImplementationError extends BaseError {
  constructor() {
    super({
      status: 500,
      data: {
        message: "An error occurred in your implementation",
      },
    });
  }
}
