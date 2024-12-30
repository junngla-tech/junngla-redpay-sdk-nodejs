import { PathUrl, UserType } from "../enum";
import { plainToInstance } from "class-transformer";
import { RedPayClient } from "./RedpayClient";
import {
  IRoleActions,
  IUserCollectorResponse,
  IUserPayerResponse,
  IValidateAuthorizationCollectorResponse,
  IValidateAuthorizationPayerResponse,
  IValidateWithData,
  IValidateWithoutData,
} from "../interface";
import {
  UserParams,
  ValidateAuthorizationCollector,
  ValidateAuthorizationPayer,
  ValidateToken,
} from "../types";
import { UserCollector, UserPayer } from "./User";

type ValidateResponse = IValidateWithData | IValidateWithoutData;
type ValidateAuthorizationResponse =
  | IValidateAuthorizationCollectorResponse
  | IValidateAuthorizationPayerResponse;
type ValidateAuthorizationRequest =
  | ValidateAuthorizationCollector
  | ValidateAuthorizationPayer;

type UserResponse = IUserPayerResponse | IUserCollectorResponse;

/**
 * Clase base para la interacción con la API de RedPay.
 * Proporciona métodos genéricos para la gestión de  usuarios y transacciones.
 */
export abstract class RedPayBase implements IRoleActions {
  /**
   * Cliente HTTP utilizado para realizar las solicitudes.
   */
  protected readonly client: RedPayClient;

  /**
   * Constructor de la clase base.
   * @param client - Una instancia opcional de `RedPayClient`.
   */
  constructor(client?: RedPayClient) {
    this.client = client || new RedPayClient();
  }

  /**
   * Crea un usuario utilizando un payload transformado.
   * @param userClass - Clase del usuario para la transformación (por ejemplo, `UserPayer`).
   * @param payload - Objeto que debe ser una instancia o JSON del usuario.
   * @returns Una promesa con la respuesta del usuario creado.
   */
  public async createUser<T extends UserPayer | UserCollector>(
    userClass: new () => T,
    payload: Omit<T, "user_type">
  ): Promise<UserResponse> {
    const userInstance = plainToInstance(userClass, payload);
    return this.client.post(PathUrl.User, userInstance);
  }

  /**
   * Actualiza un usuario utilizando un payload transformado.
   * @param userClass - Clase del usuario para la transformación (por ejemplo, `UserPayer`).
   * @param payload - Objeto que debe ser una instancia o JSON del usuario.
   * @returns Una promesa con la respuesta del usuario actualizado.
   */
  public async updateUser<T extends UserPayer | UserCollector>(
    userClass: new () => T,
    payload: Omit<T, "user_type">
  ): Promise<UserResponse> {
    const userInstance = plainToInstance(userClass, payload);
    return this.client.put(PathUrl.User, userInstance);
  }

  /**
   * Verifica un usuario.
   * @param payload - Objeto que debe ser una instancia de `UserPayer` o `UserCollector`.
   * @returns Una promesa con la respuesta del usuario verificado.
   */
  public async verifyUser(
    payload: UserPayer | UserCollector
  ): Promise<UserResponse> {
    const userParams: UserParams = {
      enroller_user_id: payload.enroller_user_id,
      user_type:
        payload instanceof UserPayer ? UserType.PAYER : UserType.COLLECTOR,
    };

    return this.client.get(PathUrl.UserVerify, userParams);
  }

  /**
   * Valida un token.
   * @param payload - Objeto que contiene la información necesaria para validar el token.
   * @returns Una promesa con el resultado de la validación.
   */
  public async validateToken(
    payload: ValidateToken
  ): Promise<ValidateResponse> {
    return this.client.post(PathUrl.ValidateToken, payload);
  }

  /**
   * Valida una autorización.
   * @param payload - Objeto que contiene la información necesaria para validar la autorización.
   * @returns Una promesa con el resultado de la validación.
   */
  public async validateAuthorization(
    payload: ValidateAuthorizationRequest
  ): Promise<ValidateAuthorizationResponse> {
    return this.client.post(PathUrl.ValidateAuthorization, payload);
  }
}
