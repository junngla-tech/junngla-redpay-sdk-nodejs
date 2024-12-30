import { IRedPayConfig } from "../interface";

/**
 * Proveedor de configuración para RedPay.
 * Permite establecer y obtener una configuración global única para la librería.
 */
export class RedPayConfigProvider {
  /**
   * Instancia única de configuración.
   * Inicialmente es `null` hasta que se establece mediante `setConfig`.
   */
  private static instance: IRedPayConfig | null = null;

  /**
   * Establece la configuración global para la librería.
   * @param config - Configuración a establecer, de tipo `IRedPayConfig`.
   */
  static setConfig(config: IRedPayConfig): void {
    this.instance = config;
  }

  /**
   * Obtiene la configuración global de la librería.
   * Si la configuración no ha sido establecida, lanza un error.
   * @returns La configuración actual de tipo `IRedPayConfig`.
   * @throws Error - Si la configuración no ha sido inicializada.
   */
  static getConfig(): IRedPayConfig {
    if (!this.instance) {
      throw new Error("RedPayConfig no está configurado.");
    }
    return this.instance;
  }
}
