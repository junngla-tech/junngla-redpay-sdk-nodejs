import { instanceToPlain, plainToInstance } from "class-transformer";
import {
  IRoleActions,
  IUserCollectorAPIResponse,
  IUserPayerAPIResponse,
  IValidateAuthorizationCollectorAPIResponse,
  IValidateAuthorizationPayerAPIResponse,
  IValidateTokenAPIResponse,
} from "../../interface";
import { UserParams } from "../../types";
import { RedPayClient } from "../../model/RedPayClient";
import {
  UserCollectorRequest,
  UserPayerRequest,
  GenerateUserResponse,
} from "../../model/User";
import { PathUrl } from "../../enum";
import { ValidateTokenRequest, ValidateTokenResponse } from "../../model/ValidateToken";
import {
  ValidateAuthorizationCollectorRequest,
  ValidateAuthorizationPayerRequest,
  ValidationAuthorizationResponse,
} from "../../model/ValidateAuthorization";

type UserAPIResponse = IUserPayerAPIResponse | IUserCollectorAPIResponse;
type ValidateAuthorizationResponse =
  | IValidateAuthorizationCollectorAPIResponse
  | IValidateAuthorizationPayerAPIResponse;
type PartialWithUserId<T> = Partial<T> & { user_id: string };

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
   * Crea un usuario utilizando una instancia de usuario.
   * @param userInstance - Objeto que debe ser una instancia del usuario.
   * @returns UserResponse - Una promesa con la respuesta del usuario creado.
   */
  public async createUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse> {
    const userPayload = instanceToPlain(userInstance);

    const response: UserAPIResponse = await this.client.post(
      PathUrl.User,
      userPayload
    );

    return plainToInstance(GenerateUserResponse, response);
  }

  /**
   * Actualiza un usuario utilizando un payload transformado.
   * @param userInstance - Instancia del usuario a actualizar.
   * @returns Una promesa con la respuesta del usuario actualizado.
   */
  public async updateUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse> {
    const userPayload = instanceToPlain(userInstance);

    const response: UserAPIResponse = await this.client.put(
      PathUrl.User,
      userPayload
    );

    return plainToInstance(GenerateUserResponse, response);
  }

  /**
   * Actualiza parcialmente un usuario utilizando un payload transformado.
   * @param userInstance - Objeto que debe ser una instancia o JSON del usuario.
   * @returns Una promesa con la respuesta del usuario actualizado.
   */
  public async updateUserPartial<
    T extends UserPayerRequest | UserCollectorRequest
  >(userInstance: PartialWithUserId<T>): Promise<GenerateUserResponse> {
    const validatedUserInstance = plainToInstance(
      userInstance.constructor as new () => T,
      userInstance,
      {
        excludeExtraneousValues: true,
      }
    );

    const { user: existingUser } = await this.getUserOrFail(
      validatedUserInstance
    );

    const updatedUserData = {
      ...existingUser,
      ...userInstance,
    };

    const updateDataToInstance = plainToInstance(
      userInstance.constructor as new () => T,
      updatedUserData
    );

    const userPayload = instanceToPlain(updateDataToInstance);

    const response: UserAPIResponse = await this.client.put(
      PathUrl.User,
      userPayload
    );

    return plainToInstance(GenerateUserResponse, response);
  }

  /**
   * Verifica un usuario.
   * @param userInstance - Instancia de usuario a verificar.
   * @returns Una promesa con la respuesta del usuario verificado.
   */
  public async getUser<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse> {
    const userPayload = instanceToPlain(userInstance);

    const userParams: UserParams = {
      enroller_user_id: userPayload.enroller_user_id,
      user_type: userPayload.user_type,
    };

    const response: UserAPIResponse = await this.client.get(
      PathUrl.UserVerify,
      userParams
    );

    return plainToInstance(GenerateUserResponse, response);
  }

  /**
   * Verifica un usuario o falla.
   * @param userInstance - Instancia de usuario a verificar.
   * @returns Una promesa con la respuesta del usuario verificado.
   * @throws Error - Si la solicitud falla.
   */
  public async getUserOrFail<T extends UserPayerRequest | UserCollectorRequest>(
    userInstance: T
  ): Promise<GenerateUserResponse> {
    const userPayload = instanceToPlain(userInstance);

    const userParams: UserParams = {
      enroller_user_id: userPayload.enroller_user_id,
      user_type: userPayload.user_type,
    };

    const response: UserAPIResponse = await this.client.getOrFail(
      PathUrl.UserVerify,
      userParams
    );

    return plainToInstance(GenerateUserResponse, response);
  }

  /**
   * Valida un token.
   * @param validateTokenInstance - Clase de validación de token (por ejemplo, `ValidateTokenRequest`).
   * @returns Una promesa con el resultado de la validación.
   */
  public async validateToken(
    validateTokenInstance: ValidateTokenRequest
  ): Promise<ValidateTokenResponse> {
    const validateTokenPayload = instanceToPlain(validateTokenInstance);
    const response: IValidateTokenAPIResponse = await this.client.post(
      PathUrl.ValidateToken,
      validateTokenPayload
    );

    return plainToInstance(ValidateTokenResponse, response);
  }

  /**
   * Valida una autorización.
   * @param validateAuthorizationInstance - Instancia de validación de autorización.
   * @returns Una promesa con el resultado de la validación de la autorización.
   */
  public async validateAuthorization<
    T extends
      | ValidateAuthorizationCollectorRequest
      | ValidateAuthorizationPayerRequest
  >(
    validateAuthorizationInstance: T
  ): Promise<ValidationAuthorizationResponse> {
    const validateAuthorizationPayload = instanceToPlain(
      validateAuthorizationInstance
    );

    const response: ValidateAuthorizationResponse = await this.client.post(
      PathUrl.ValidateAuthorization,
      validateAuthorizationPayload
    );

    return plainToInstance(ValidationAuthorizationResponse, response);
  }
}
