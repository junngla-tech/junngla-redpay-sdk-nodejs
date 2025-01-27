import { Exclude, Expose, instanceToPlain, Transform } from "class-transformer";
import { AuthorizationMode } from "../enum";
import { IAccount, IRedPayConfig } from "../interface";
import { RedPayConfigProvider } from "../provider/RedPayConfigProvider";
import { RedPayIntegrity } from "../services/RedPayIntegrity";
import { SbifCode, AccountType } from "../types";
import { ClassBase } from "./ClassBase";

type AuthorizationAccountWithId = {
  account: AuthorizationAccount;
  id: string;
};

/**
 * Clase utilizada para generar la firma de un AuthorizationAccount con un secreto específico (modo)
 * y calcular automáticamente el timestamp asociado.
 */

export class SignedAuthorizationAccount extends ClassBase<SignedAuthorizationAccount> {
  /**
   * Identificador unico del SignedAuthorizationAccount.
   */
  @Expose()
  id!: string;

  /**
   * Cuenta asociada al AuthorizationAccount.
   */
  @Expose()
  account!: AuthorizationAccount;

  /**
   * Timestamp generado automáticamente al momento de la creación del AuthorizationAccount.
   */
  @Expose()
  timestamp!: number;

  /**
   * Firma generada utilizando el secreto y los datos proporcionados.
   */
  @Expose()
  signature!: string;

  setAuthorization(mode: AuthorizationMode) {
    const config = RedPayConfigProvider.getInstance().getConfig();

    const { id, account } = this.getAccountForMode(config, mode);

    this.id = id;
    this.account = account;
    this.timestamp = Date.now();

    const secret = this.getSecretForMode(config, mode);
    this.signature = RedPayIntegrity.generateSignature(
      { id: this.id, account: instanceToPlain(this.account), timestamp: this.timestamp },
      secret
    );
  }

  /**
   * Obtiene el secreto correspondiente al modo proporcionado.
   * @param config - Configuración global de RedPay.
   * @param mode - Modo de autorización de cuenta, determina qué secreto utilizar.
   * @returns El secreto correspondiente al modo.
   * @throws Error - Si el modo no es soportado o no hay un secreto definido para el modo.
   */
  private getSecretForMode(
    config: IRedPayConfig,
    mode: AuthorizationMode
  ): string {
    switch (mode) {
      case AuthorizationMode.Authorize:
        return this.ensureSecret(config.secrets.authorize);
      case AuthorizationMode.Chargeback:
        return this.ensureSecret(config.secrets.chargeback);
      case AuthorizationMode.ChargebackAutomatic:
        return this.ensureSecret(config.secrets.chargeback_automatic);
      default:
        throw new Error(`Authorization mode "${mode}" is not supported.`);
    }
  }

  /**
   * Obtiene la cuenta correspondiente al modo proporcionado + su identificador.
   * @param config - Configuración global de RedPay.
   * @param mode - Modo de autorización de cuenta, determina qué cuenta utilizar.
   * @returns
   */
  private getAccountForMode(
    config: IRedPayConfig,
    mode: AuthorizationMode
  ): AuthorizationAccountWithId {
    switch (mode) {
      case AuthorizationMode.Authorize:
        return this.ensureAccount(config.accounts?.authorize);
      case AuthorizationMode.Chargeback:
        return this.ensureAccount(config.accounts?.chargeback);
      case AuthorizationMode.ChargebackAutomatic:
        return this.ensureAccount(config.accounts?.chargeback_automatic);
      default:
        throw new Error(`Authorization mode "${mode}" is not supported.`);
    }
  }

  private ensureAccount(
    account: IAccount | undefined
  ): AuthorizationAccountWithId {
    if (!account) {
      throw new Error("Account is undefined for the given mode.");
    }

    const accountPlain = instanceToPlain(account);

    const authorizationAccount = new AuthorizationAccount();
    authorizationAccount.number = accountPlain.number;
    authorizationAccount.bank = accountPlain.sbif_code;
    authorizationAccount.type = accountPlain.type;

    return {
      id: accountPlain.id,
      account: authorizationAccount
    };
  }

  /**
   * Asegura que el secreto esté definido.
   * @param secret - El secreto a validar.
   * @returns El secreto validado.
   * @throws Error - Si el secreto es undefined.
   */
  private ensureSecret(secret: string | undefined): string {
    if (!secret) {
      throw new Error("Secret is undefined for the given mode.");
    }
    return secret;
  }
}

export class AuthorizationAccount extends ClassBase<AuthorizationAccount> {
  /**
   * Número de la cuenta.
   */
  @Expose()
  number!: string;

  /**
   * Código bancario según el estándar de la SBIF (Superintendencia de Bancos e Instituciones Financieras de Chile).
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  bank!: SbifCode;

  /**
   * Código SBIF asociado al banco de la cuenta.
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.bank)
  private sbif_code!: SbifCode;

  /**
   * Tipo de cuenta (por ejemplo, Cuenta Corriente o Cuenta Vista).
   */
  @Expose()
  type!: AccountType;
}
