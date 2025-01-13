import { plainToClass } from "class-transformer";
import { RedPayConfig } from "../model";

/**
 * Proveedor de configuración para RedPay.
 * Permite establecer y obtener una configuración global única para la librería.
 */
export class RedPayConfigProvider {
  private static instance: RedPayConfigProvider;
  private config: RedPayConfig | null = null;

  // Constructor privado para evitar instanciación directa
  private constructor() {}

  /**
   * Obtiene la instancia única del provider.
   * @returns La instancia de RedPayConfigProvider.
   */
  public static getInstance(): RedPayConfigProvider {
    if (!RedPayConfigProvider.instance) {
      RedPayConfigProvider.instance = new RedPayConfigProvider();
    }
    return RedPayConfigProvider.instance;
  }

  /**
   * Establece la configuración de RedPay. Solo puede configurarse una vez.
   * @param config - Configuración a establecer.
   * @throws Error si la configuración ya fue establecida o si faltan datos obligatorios.
   */
  public setConfig(config: Partial<RedPayConfig>): void {
    if (this.config) {
      throw new Error("La configuración de RedPay ya está establecida y no puede ser modificada.");
    }

    // Validar y transformar la configuración
    const transformedConfig = plainToClass(RedPayConfig, config);
    this.validateConfig(transformedConfig);

    this.config = transformedConfig;
  }

  /**
   * Obtiene la configuración completa de RedPay.
   * @returns La configuración actual de RedPay.
   * @throws Error si la configuración no está completa.
   */
  public getConfig(): RedPayConfig {
    if (!this.config) {
      throw new Error("La configuración de RedPay no está inicializada.");
    }
    return this.config;
  }

  /**
   * Valida que la configuración tenga todos los campos obligatorios.
   * @param config - Configuración a validar.
   * @throws Error si falta algún campo obligatorio.
   */
  private validateConfig(config: RedPayConfig): void {
    const requiredFields = ["secrets", "environment", "certificates", "type"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const missingFields = requiredFields.filter((field) => !(config as any)[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `La configuración de RedPay está incompleta. Faltan los campos: ${missingFields.join(", ")}.`
      );
    }
  }
}
