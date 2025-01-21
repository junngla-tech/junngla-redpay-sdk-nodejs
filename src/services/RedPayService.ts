import { Enroller } from "../enum";
import { RedPayConfigProvider } from "../provider";
import { RoleActionsER, RoleActionsEP, IRoleActions } from "../interface";
import { RedPayDualService, RedPayEPService, RedPayERService } from "./internal";

/**
 * Clase principal para manejar servicios de RedPay según el tipo de enrolador.
 * Proporciona métodos específicos y comunes para la gestión de usuarios y transacciones.
 */
export class RedPayService {
  /**
   * Instancia del servicio seleccionado dinámicamente.
   * Puede ser un `RedPayERService`, `RedPayEPService` o `RedPayDualService`.
   */
  private serviceInstance: RoleActionsER | RoleActionsEP;

  /**
   * Constructor de la clase `RedPayService`.
   * Inicializa la instancia del servicio basado en el tipo configurado.
   */
  constructor() {
    this.serviceInstance = this.initializeService();
  }

  /**
   * Inicializa el servicio correspondiente basado en el tipo configurado.
   * @returns Instancia del servicio configurado (`RedPayERService`, `RedPayEPService` o `RedPayDualService`).
   * @throws Error Si el tipo de enrolador no es soportado.
   */
  private initializeService(): RoleActionsER | RoleActionsEP {
    const config = RedPayConfigProvider.getInstance().getConfig();

    switch (config.type) {
      case Enroller.COLLECTOR:
        return new RedPayERService();
      case Enroller.PAYER:
        return new RedPayEPService();
      case Enroller.DUAL:
        return new RedPayDualService();
      default:
        throw new Error(`Tipo de enrolador no soportado: ${config.type}`);
    }
  }

  /**
   * Verifica si el servicio es de tipo `COLLECTOR`.
   * @param service Instancia del servicio a verificar.
   * @returns `true` si el servicio es de tipo `COLLECTOR`, de lo contrario `false`.
   */
  private isERService(
    service: RoleActionsER | RoleActionsEP
  ): service is RoleActionsER {
    return (
      service instanceof RedPayERService || service instanceof RedPayDualService
    );
  }

  /**
   * Verifica si el servicio es de tipo `PAYER`.
   * @param service Instancia del servicio a verificar.
   * @returns `true` si el servicio es de tipo `PAYER`, de lo contrario `false`.
   */
  private isEPService(
    service: RoleActionsER | RoleActionsEP
  ): service is RoleActionsEP {
    return (
      service instanceof RedPayEPService || service instanceof RedPayDualService
    );
  }

  // Métodos específicos

  /**
   * Genera un token. Solo disponible para servicios de tipo `COLLECTOR`.
   * @param args Argumentos necesarios para generar el token.
   * @returns Una promesa que resuelve en una respuesta de tipo `GenerateTokenResponse`.
   * @throws Error Si el método no está disponible para este tipo de servicio.
   * 
   * @example
   * ```typescript
   * const tokenInstance = new TokenT0Request();
   * const response = redPayService.generateToken(tokenInstance);
   * ````
   */
  public generateToken(...args: Parameters<RoleActionsER["generateToken"]>) {
    if (this.isERService(this.serviceInstance)) {
      return this.serviceInstance.generateToken(...args);
    }
    throw new Error(
      "El método generateToken no está disponible para este tipo de servicio."
    );
  }

  /**
   * Revoca un token. Solo disponible para servicios de tipo `COLLECTOR`.
   * @param args Argumentos necesarios para revocar el token.
   * @returns Una promesa que resuelve en una respuesta de tipo `RevokeTokenResponse`.
   * @throws Error Si el método no está disponible para este tipo de servicio.
   * 
   * @example
   * ```typescript
   * const revokeInstance = new RevokeTokenRequest();
   * const response = redPayService.revokeToken(revokeInstance);
   * ```
   */
  public revokeToken(...args: Parameters<RoleActionsER["revokeToken"]>) {
    if (this.isERService(this.serviceInstance)) {
      return this.serviceInstance.revokeToken(...args);
    }
    throw new Error(
      "El método revokeToken no está disponible para este tipo de servicio."
    );
  }

  /**
   * Realiza una devolución. Solo disponible para servicios de tipo `COLLECTOR`.
   * @param args Argumentos necesarios para realizar el chargeback.
   * @returns Una promesa que resuelve en una respuesta de tipo `ChargebackResponse`.
   * @throws Error Si el método no está disponible para este tipo de servicio.
   * 
   * @example
   * ```typescript
   * const chargebackInstance = new ChargebackRequest();
   * const response = redPayService.generateChargeback(chargebackInstance);
   * ```
   */
  public generateChargeback(
    ...args: Parameters<RoleActionsER["generateChargeback"]>
  ) {
    if (this.isERService(this.serviceInstance)) {
      return this.serviceInstance.generateChargeback(...args);
    }
    throw new Error(
      "El método chargeback no está disponible para este tipo de servicio."
    );
  }

  /**
   * Autoriza un token. Solo disponible para servicios de tipo `PAYER`.
   * @param args Argumentos necesarios para autorizar el token.
   * @returns Una promesa que resuelve en una respuesta de tipo `AuthorizeResponse`.
   * @throws Error Si el método no está disponible para este tipo de servicio.
   * 
   * @example
   * ```typescript
   * const authorizeInstance = new AuthorizeRequest();
   * const response = redPayService.authorizeToken(authorizeInstance);
   * ```
   */
  public authorizeToken(...args: Parameters<RoleActionsEP["authorizeToken"]>) {
    if (this.isEPService(this.serviceInstance)) {
      return this.serviceInstance.authorizeToken(...args);
    }
    throw new Error(
      "El método authorizeToken no está disponible para este tipo de servicio."
    );
  }

  // Métodos comunes

  /**
   * Valida un token.
   * @param args Argumentos necesarios para validar el token.
   * 
   * @example
   * ```typescript
   * const validateTokenInstance = new ValidateTokenRequest();
   * const response = redPayService.validateToken(validateTokenInstance);
   * ```
   */
  public validateToken(...args: Parameters<IRoleActions["validateToken"]>) {
    return this.serviceInstance.validateToken(...args);
  }

  /**
   * Valida una autorización.
   * @param args Argumentos necesarios para validar la autorización.
   * @returns Una promesa que resuelve en una respuesta de tipo `ValidationAuthorizationResponse`.
   * 
   * @example - `COLLECTOR`
   * ```typescript
   * const validateAuthorizationInstance = new ValidateAuthorizationCollectorRequest();
   * const response = redPayService.validateAuthorization(validateAuthorizationInstance);
   * ```
   * 
   * @example - `PAYER`
   * ```typescript
   * const validateAuthorizationInstance = new ValidateAuthorizationPayerRequest();
   * const response = redPayService.validateAuthorization(validateAuthorizationInstance);
   * ```
   */
  public validateAuthorization(
    ...args: Parameters<IRoleActions["validateAuthorization"]>
  ) {
    return this.serviceInstance.validateAuthorization(...args);
  }

  /**
   * Crea un usuario.
   * @param args Argumentos necesarios para crear el usuario.
   * @returns Una promesa que resuelve en una respuesta de tipo `GenerateUserResponse`.
   * 
   * @example - `COLLECTOR`
   * ```typescript
   * const userInstance = new UserCollectorRequest();
   * const response = redPayService.createUser(userInstance);
   * ```
   * 
   * @example - `PAYER`
   * ```typescript
   * const userInstance = new UserPayerRequest();
   * const response = redPayService.createUser(userInstance);
   * ```
   */
  public createUser(...args: Parameters<IRoleActions["createUser"]>) {
    return this.serviceInstance.createUser(...args);
  }

  /**
   * Actualiza un usuario.
   * @param args Argumentos necesarios para actualizar el usuario.
   * 
   * @example - `COLLECTOR`
   * ```typescript
   * const userInstance = new UserCollectorRequest();
   * const response = redPayService.updateUser(userInstance);
   * ```
   * 
   * @example - `PAYER`
   * ```typescript
   * const userInstance = new UserPayerRequest();
   * const response = redPayService.updateUser(userInstance);
   * ```
   */
  public updateUser(...args: Parameters<IRoleActions["updateUser"]>) {
    return this.serviceInstance.updateUser(...args);
  }

  /**
   * Actualiza parcialmente un usuario.
   * @param args Argumentos necesarios para la actualización parcial.
   * @returns Una promesa que resuelve en una respuesta de tipo `GenerateUserResponse`.
   * 
   * @example - `COLLECTOR`
   * ```typescript
   * const userInstance = UserCollectorRequest();
   * const response = redPayService.updateUserPartial(userInstance);
   * ```
   * 
   * @example - `PAYER`
   * ```typescript
   * const userInstance = UserPayerRequest();
   * const response = redPayService.updateUserPartial(userInstance);
   * ```
   */
  public updateUserPartial(
    ...args: Parameters<IRoleActions["updateUserPartial"]>
  ) {
    return this.serviceInstance.updateUserPartial(...args);
  }

  /**
   * Obtiene un usuario.
   * @param args Argumentos necesarios para obtener el usuario.
   * @returns Una promesa que resuelve en una respuesta de tipo `GenerateUserResponse`.
   * 
   * @example - `COLLECTOR`
   * ```typescript
   * const userInstance = new UserCollectorRequest();
   * const response = redPayService.getUser(userInstance);
   * ```
   * 
   * @example - `PAYER`
   * ```typescript
   * const userInstance = new UserPayerRequest();
   * const response = redPayService.getUser(userInstance);
   * ```
   */
  public getUser(...args: Parameters<IRoleActions["getUser"]>) {
    return this.serviceInstance.getUser(...args);
  }

  /**
   * Obtiene un usuario o lanza un error si no existe.
   * @param args Argumentos necesarios para obtener el usuario.
   * @returns Una promesa que resuelve en una respuesta de tipo `GenerateUserResponse`.
   * @throws Error - Si la solicitud falla.
   */
  public getUserOrFail(...args: Parameters<IRoleActions["getUserOrFail"]>) {
    return this.serviceInstance.getUserOrFail(...args);
  }
}
