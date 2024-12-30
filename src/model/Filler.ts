import { FillerMode } from "../enum";
import { generateSignature } from "../Integrity.service";
import { IRedPayConfig } from "../interface";
import { RedPayConfigProvider } from "../provider/RedPayConfigProvider";
import { FillerAccount } from "./Account";

/**
 * Clase utilizada para generar la firma de un Filler con un secreto específico (modo)
 * y calcular automáticamente el timestamp asociado.
 */
export class Filler {
  /**
   * Identificador unico del Filler.
   */
  readonly id: string;

  /**
   * Cuenta asociada al Filler.
   */
  readonly account: FillerAccount;

  /**
   * Timestamp generado automáticamente al momento de la creación del Filler.
   */
  readonly timestamp: number;

  /**
   * Firma generada utilizando el secreto y los datos proporcionados.
   */
  readonly signature: string;

  /**
   * Constructor para crear una instancia de Filler.
   * @param id - Identificador único del Filler.
   * @param account - Cuenta asociada al Filler.
   * @param mode - Modo del Filler, determina el secreto utilizado para generar la firma.
   * @throws Error - Si el modo proporcionado no es soportado o no hay un secreto definido para el modo.
   */
  constructor(id: string, account: FillerAccount, mode: FillerMode) {
    const config = RedPayConfigProvider.getConfig();

    this.id = id;
    this.account = account;
    this.timestamp = Date.now();

    const secret = this.getSecretForMode(config, mode);
    this.signature = generateSignature(
      { id: this.id, account: this.account, timestamp: this.timestamp },
      secret
    );
  }

  /**
   * Obtiene el secreto correspondiente al modo proporcionado.
   * @param config - Configuración global de RedPay.
   * @param mode - Modo del Filler, determina qué secreto utilizar.
   * @returns El secreto correspondiente al modo.
   * @throws Error - Si el modo no es soportado o no hay un secreto definido para el modo.
   */
  private getSecretForMode(config: IRedPayConfig, mode: FillerMode): string {
    switch (mode) {
      case FillerMode.Authorize:
        return this.ensureSecret(config.secrets.authorize);
      case FillerMode.Chargeback:
        return this.ensureSecret(config.secrets.chargeback);
      case FillerMode.ChargebackAutomatic:
        return this.ensureSecret(config.secrets.chargebackAutomatic);
      default:
        throw new Error(`Filler mode "${mode}" is not supported.`);
    }
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
