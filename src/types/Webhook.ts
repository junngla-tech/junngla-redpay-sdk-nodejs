export type WebhookPreAuthorization = {
  token_uuid: string;
  is_med?: boolean;
  amount: number;
  operations: {
    generation_uuid: string;
    verification_uuid: string;
    authorization_uuid: string;
  };
  data?: {
    subscription_uuid: string;
  };
  collector_id?: string;
  payer_id?: string;
  message?: string;
  status_code: string;
  status?: string;
  extra_data: string;
  timestamp: string;
  signature: string;
};
