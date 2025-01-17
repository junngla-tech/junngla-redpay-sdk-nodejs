import { IError, RedPayError } from "../interface";

export abstract class BaseError extends Error {
  public status: number;
  public data: RedPayError;

  constructor({ status, data }: IError) {
    super(data.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializa el error en el formato definido por IError.
   * @returns {IError} Representación del error.
   */
  serializeError(): IError {
    return {
      status: this.status,
      data: this.data,
    };
  }
}
