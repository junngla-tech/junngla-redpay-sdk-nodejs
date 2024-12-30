import { plainToInstance } from "class-transformer";
import { PathUrl } from "../enum";
import {
  IChargebackResponse,
  IRevokeResponse,
  RoleActionsER,
  ITokenResponse,
  ITokenBase,
} from "../interface";
import { RedPayBase } from "../model";
import { ChargebackRequest, RevokeRequest } from "../types";

/**
 * Servicio para operaciones relacionadas con Enroladores Recaudadores (RedPayER).
 * Extiende la funcionalidad base proporcionada por `RedPayBase`.
 */
export class RedPayERService extends RedPayBase implements RoleActionsER {
  /**
   * Genera un token utilizando un payload transformado.
   * @param tokenClass - Clase del token para la transformación (por ejemplo, `TokenT0`).
   * @param payload - Objeto que debe ser una instancia o JSON del token.
   * @returns Una promesa que resuelve en una respuesta de tipo `ITokenResponse`.
   */
  public async generateToken<T extends ITokenBase>(
    tokenClass: new () => T,
    payload: T
  ): Promise<ITokenResponse> {
    const transformedPayload = plainToInstance(tokenClass, payload);
    return this.client.post(PathUrl.Generate, transformedPayload);
  }

  /**
   * Revoca un token.
   * @param payload - Objeto de tipo `RevokeRequest` que contiene los datos necesarios para revocar el token.
   * @returns Una promesa que resuelve en una respuesta de tipo `IRevokeResponse`.
   */
  public async revokeToken(payload: RevokeRequest): Promise<IRevokeResponse> {
    return this.client.post(PathUrl.Revoke, payload);
  }

  /**
   * Realiza una devolución (chargeback) de una transacción.
   * @param payload - Objeto de tipo `ChargebackRequest` que contiene los datos necesarios para una devolución.
   * @returns Una promesa que resuelve en una respuesta de tipo `IChargebackResponse`.
   */
  public async chargeback(
    payload: ChargebackRequest
  ): Promise<IChargebackResponse> {
    return this.client.post(PathUrl.Chargeback, payload);
  }
}
