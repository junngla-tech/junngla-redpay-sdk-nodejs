export interface IRedPayConfig {
  secrets: ISecrets;
  environment: string;
  certificates: ICertificates;
}

export interface ISecrets {
  integrity: string;
  authorize?: string;
  chargeback?: string;
  chargebackAutomatic?: string;
}

export interface ICertificates {
  certPath: string;
  keyPath: string;
  verifySSL?: boolean;
}
