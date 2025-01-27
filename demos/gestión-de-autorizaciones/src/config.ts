import {
  Account,
  AccountAuthorization,
  Accounts,
  Bank,
  Certificate,
  Enroller,
  RedPayConfig,
  RedPayEnvironment,
  Secrets,
} from "redpay-sdk-nodejs";

const certificates = new Certificate({
  key_path: "<path_to_key>",
  cert_path: "<path_to_cert>",
});

const secrets = new Secrets({
  integrity: "<secret_integrity>",
  authorize: "<secret_authorization>",
  chargeback: "<secret_chargeback>",
  chargeback_automatic: "<secret_chargeback_automatic>",
});

const accounts = new Accounts({
  authorize: new Account({
    id: "<id_authorize>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
  chargeback: new Account({
    id: "<id_chargeback>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
  chargeback_automatic: new Account({
    id: "<id_chargeback_automatic>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
});

export const config = new RedPayConfig({
  type: Enroller.DUAL, 
  certificates,
  environment: RedPayEnvironment.Integration,
  secrets,
  accounts,
});
