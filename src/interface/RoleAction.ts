import { UserCollector, UserPayer } from "../model";
import {
  Authorize,
  ChargebackRequest,
  RevokeRequest,
  ValidateAuthorizationCollector,
  ValidateAuthorizationPayer,
  ValidateToken,
} from "../types";
import { IAuthorizeResponse } from "./Authorize";
import { IChargebackResponse } from "./Chargeback";
import { IRevokeResponse } from "./Revoke";
import { ITokenBase, ITokenResponse } from "./Token";
import { IUserCollectorResponse, IUserPayerResponse } from "./User";
import {
  IValidateAuthorizationCollectorResponse,
  IValidateAuthorizationPayerResponse,
} from "./ValidateAuthorization";
import { IValidateWithData, IValidateWithoutData } from "./ValidateToken";

/**
 * Interfaz que define las acciones comunes para los roles de integración (Collector y Payer).
 */
export interface IRoleActions {
  /**
   * Crea un usuario en el sistema.
   * @param tokenClass Clase del usuario a crear (UserPayer o UserCollector).
   * @param payload Datos necesarios para crear el usuario.
   * @returns Una promesa con la respuesta del usuario creado.
   */
  createUser<T extends UserPayer | UserCollector>(
    tokenClass: new () => T,
    payload: Omit<T, "user_type">
  ): Promise<IUserCollectorResponse | IUserPayerResponse>;

  /**
   * Actualiza un usuario existente.
   * @param tokenClass Clase del usuario a actualizar (UserPayer o UserCollector).
   * @param payload Datos actualizados del usuario.
   * @returns Una promesa con la respuesta del usuario actualizado.
   */
  updateUser<T extends UserPayer | UserCollector>(
    tokenClass: new () => T,
    payload: Omit<T, "user_type">
  ): Promise<IUserCollectorResponse | IUserPayerResponse>;

  /**
   * Verifica un usuario en el sistema.
   * @param payload Datos del usuario a verificar.
   * @returns Una promesa con la respuesta de verificación del usuario.
   */
  verifyUser(
    payload: UserPayer | UserCollector
  ): Promise<IUserCollectorResponse | IUserPayerResponse>;

  /**
   * Valida una autorización en el sistema.
   * @param payload Datos necesarios para validar la autorización.
   * @returns Una promesa con la respuesta de validación.
   */
  validateAuthorization(
    payload: ValidateAuthorizationCollector | ValidateAuthorizationPayer
  ): Promise<
    | IValidateAuthorizationCollectorResponse
    | IValidateAuthorizationPayerResponse
  >;

  /**
   * Valida un token en el sistema.
   * @param payload Datos necesarios para validar el token.
   * @returns Una promesa con la respuesta de validación.
   */
  validateToken(
    payload: ValidateToken
  ): Promise<IValidateWithData | IValidateWithoutData>;
}

/**
 * Interfaz que define las acciones específicas para el rol de Enrolador Recaudador (ER).
 */
export interface RoleActionsER extends IRoleActions {
  /**
   * Genera un token en el sistema.
   * @param tokenClass Clase del token a generar.
   * @param payload Datos necesarios para generar el token.
   * @returns Una promesa con la respuesta del token generado.
   */
  generateToken<T extends ITokenBase>(
    tokenClass: new () => T,
    payload: T
  ): Promise<ITokenResponse>;

  /**
   * Revoca un token existente.
   * @param payload Datos necesarios para revocar el token.
   * @returns Una promesa con la respuesta de revocación.
   */
  revokeToken(payload: RevokeRequest): Promise<IRevokeResponse>;

  /**
   * Realiza un chargeback en el sistema.
   * @param payload Datos necesarios para realizar el chargeback.
   * @returns Una promesa con la respuesta del chargeback.
   */
  chargeback(payload: ChargebackRequest): Promise<IChargebackResponse>;
}

/**
 * Interfaz que define las acciones específicas para el rol de Enrolador Pagador (EP).
 */
export interface RoleActionsEP extends IRoleActions {
  /**
   * Autoriza un token en el sistema.
   * @param payload Datos necesarios para autorizar el token.
   * @returns Una promesa con la respuesta de autorización.
   */
  authorizeToken(payload: Authorize): Promise<IAuthorizeResponse>;
}
