import {
  AuthorizeRequest,
  GenerateTokenResponse,
  RevokeTokenRequest,
  TokenBase,
  UserCollectorRequest,
  UserPayerRequest,
  GenerateUserResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  RevokeTokenResponse,
  AuthorizeResponse,
  ValidateAuthorizationCollectorRequest,
  ValidateAuthorizationPayerRequest,
  ValidationAuthorizationResponse,
} from "../model";
import { ChargebackRequest, ChargebackResponse } from "../model/Chargeback";

/**
 * Interfaz que define las acciones comunes para los roles de integración (Collector y Payer).
 */
export interface IRoleActions {
  /**
   * Crea un usuario en el sistema.
   * @param userInstance Instancia del usuario a crear.
   * @returns Una promesa con la respuesta del usuario creado.
   */
  createUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse>;

  /**
   * Actualiza un usuario existente.
   * @param userInstance Instancia del usuario a actualizar.
   * @returns Una promesa con la respuesta del usuario actualizado.
   */
  updateUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse>;

  /**
   * Actualiza un usuario existente de forma parcial.
   * @param userClass Clase del usuario a actualizar (UserPayer o UserCollector).
   * @param userInstance Instancia del usuario a actualizar parcialmente.
   * @returns Una promesa con la respuesta del usuario actualizado parcialmente.
   */
  updateUserPartial<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse>;

  /**
   * Verifica un usuario en el sistema.
   * @param userInstance Instancia del usuario a buscar.
   * @returns Una promesa con la respuesta de verificación del usuario.
   */
  getUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse>;

  getUserOrFail<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse>;

  /**
   * Valida una autorización en el sistema.
   * @param validateAuthorizationInstance - Instancia de validación de autorización.
   * @returns Una promesa con la respuesta de validación.
   */
  validateAuthorization<
    T extends
      | ValidateAuthorizationCollectorRequest
      | ValidateAuthorizationPayerRequest
  >(
    validateAuthorizationInstance: T
  ): Promise<ValidationAuthorizationResponse>;

  /**
   * Valida un token en el sistema.
   * @param validateTokenInstance - Instancia de `ValidateTokenRequest` que contiene los datos necesarios para validar un token.
   * @returns Una promesa con la respuesta de validación.
   */
  validateToken(
    validateTokenInstance: ValidateTokenRequest
  ): Promise<ValidateTokenResponse>;
}

/**
 * Interfaz que define las acciones específicas para el rol de Enrolador Recaudador (ER).
 */
export interface RoleActionsER extends IRoleActions {
  /**
   * Genera un token en el sistema.
   * @param tokenInstance - Instancia del token a generar.
   * @returns Una promesa con la respuesta del token generado.
   */
  generateToken<T extends TokenBase>(
    tokenInstance: T
  ): Promise<GenerateTokenResponse>;

  /**
   * Revoca un token existente.
   * @param revokeInstance - Instancia de `RevokeToken` que contiene los datos necesarios para revocar un token.
   * @returns Una promesa con la respuesta de revocación.
   */
  revokeToken(revokeInstance: RevokeTokenRequest): Promise<RevokeTokenResponse>;

  /**
   * Realiza un chargeback en el sistema.
   * @param chargebackInstance - Instancia de `Chargeback` que contiene los datos necesarios para realizar el chargeback.
   * @returns Una promesa con la respuesta del chargeback.
   */
  generateChargeback(
    chargebackInstance: ChargebackRequest
  ): Promise<ChargebackResponse>;
}

/**
 * Interfaz que define las acciones específicas para el rol de Enrolador Pagador (EP).
 */
export interface RoleActionsEP extends IRoleActions {
  /**
   * Autoriza un token en el sistema.
   * @param authorizeInstance - Instancia de `Authorize` que contiene los datos necesarios para autorizar un token.
   * @returns Una promesa con la respuesta de autorización.
   */
  authorizeToken(
    authorizeInstance: AuthorizeRequest
  ): Promise<AuthorizeResponse>;
}
