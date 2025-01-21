import { BaseError } from "./ClassBase";

export class ImplementationError extends BaseError {
  constructor(originalError?: Error) {
    super(
      {
        status: 500,
        data: {
          message: "An error occurred in your implementation",
        },
      },
      originalError
    );
  }
}
