export interface IError {
  status: number;
  data: RedPayError;
}

export interface RedPayError {
  operation_uuid?: string;
  message: string;
  status_code?: string;
  signature?: string;
}
