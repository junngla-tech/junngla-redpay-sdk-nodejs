import {
  GenerateTokenResponse,
  RedPayBase,
  RevokeTokenRequest,
  RevokeTokenResponse,
  TokenBase,
} from "../../model";
import {
  IChargebackAPIResponse,
  IRevokeAPIResponse,
  ITokenAPIResponse,
  RoleActionsER,
} from "../../interface";
import { PathUrl } from "../../enum";
import { ChargebackRequest, ChargebackResponse } from "../../model/Chargeback";
import { instanceToPlain, plainToInstance } from "class-transformer";

/**
 * Servicio para operaciones relacionadas con Enroladores Recaudadores (RedPayER).
 * Extiende la funcionalidad base proporcionada por `RedPayBase`.
 */

export class RedPayERService extends RedPayBase implements RoleActionsER {
  /**
   * Genera un token utilizando un payload transformado.
   * @param tokenInstance - Instancia del token a generar.
   * @returns Una promesa que resuelve en una respuesta de tipo `ITokenResponse`.
   */
  public async generateToken<T extends TokenBase>(
    tokenInstance: T
  ): Promise<GenerateTokenResponse> {
    const tokenPayload = instanceToPlain(tokenInstance);

    const response: ITokenAPIResponse = await this.client.post(
      PathUrl.Generate,
      tokenPayload
    );

    return plainToInstance(GenerateTokenResponse, response);
  }

  /**
   * Revoca un token.
   * @param revokeInstance - Instancia de `RevokeToken` que contiene los datos necesarios para revocar un token.
   * @returns Una promesa que resuelve en una respuesta de tipo `IRevokeResponse`.
   */
  public async revokeToken(
    revokeInstance: RevokeTokenRequest
  ): Promise<RevokeTokenResponse> {
    const revokeTokenPayload = instanceToPlain(revokeInstance);
    const response: IRevokeAPIResponse = await this.client.post(
      PathUrl.Revoke,
      revokeTokenPayload
    );

    return plainToInstance(RevokeTokenResponse, response);
  }

  /**
   * Realiza una devolución (chargeback) de una transacción.
   * @param chargebackInstance - Instancia de `Chargeback` que contiene los datos necesarios para realizar el chargeback.
   * @returns Una promesa que resuelve en una respuesta de tipo `IChargebackResponse`.
   */
  public async generateChargeback(
    chargebackInstance: ChargebackRequest
  ): Promise<ChargebackResponse> {
    const chargebackPayload = instanceToPlain(chargebackInstance);
    const response: IChargebackAPIResponse = await this.client.post(PathUrl.Chargeback, chargebackPayload);

    return plainToInstance(ChargebackResponse, response);
  }
}
