export interface IRevokeAPIResponse {
  detail: string;
  description: string;
  revoked_at: Date;
  amount: number;
  operation_uuid: string;
  signature: string;
}
