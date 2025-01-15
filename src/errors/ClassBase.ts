import { IError } from "../interface";

export abstract class BaseError extends Error {
  public operation_uuid?: string;
  public message: string;
  public status_code_redpay?: string;
  public status_code?: number;
  public signature?: string;

  constructor({ operation_uuid, message, status_code, signature }: IError) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.operation_uuid = operation_uuid;
    this.message = message;
    this.status_code = status_code;
    this.signature = signature;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializa el error en el formato definido por IError.
   * @returns {IError} Representación del error.
   */
  serializeError(): IError {
    return {
      operation_uuid: this.operation_uuid,
      message: this.message,
      status_code_redpay: this.status_code_redpay,
      status_code: this.status_code,
      signature: this.signature,
    };
  }
}
