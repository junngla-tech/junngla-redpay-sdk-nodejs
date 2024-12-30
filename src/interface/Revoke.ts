export interface IRevokeResponse {
  detail: string;
  description: string;
  revoked_at: string;
  amount: number;
  operation_uuid: string;
  signature: string;
}
