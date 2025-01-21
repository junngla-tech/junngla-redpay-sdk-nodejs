import { IError, RedPayError } from "../interface";

export abstract class BaseError extends Error {
  public status: number;
  public data: RedPayError;
  public originalError?: Error; 

  constructor({ status, data }: IError, originalError?: Error) {
    super(data.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.data = data;
    this.originalError = originalError;

    if (originalError instanceof Error) {
      this.stack += `\nCaused by: ${originalError.stack}`;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializa el error en el formato definido por IError.
   * Incluye información del error original si está disponible.
   * @returns {IError & { originalError?: string }} Representación del error.
   */
  serializeError(): IError & { originalError?: string } {
    return {
      status: this.status,
      data: this.data,
      originalError: this.originalError
        ? this.originalError.message
        : undefined,
    };
  }
}
