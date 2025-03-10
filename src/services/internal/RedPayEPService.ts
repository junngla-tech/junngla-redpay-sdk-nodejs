import { instanceToPlain, plainToInstance } from "class-transformer";
import { PathUrl } from "../../enum";
import { IAuthorizeAPIResponse, RoleActionsEP } from "../../interface";
import { AuthorizeRequest, AuthorizeResponse } from "../../model";
import { RedPayBase } from "./RedPayBase";

/**
 * Servicio para operaciones relacionadas con Enroladores Pagadores (RedPayEP).
 * Extiende la funcionalidad base proporcionada por `RedPayBase`.
 */

export class RedPayEPService extends RedPayBase implements RoleActionsEP {
  /**
   * Autoriza un token.
   * @param authorizeInstance - Instancia de `Authorize` que contiene los datos necesarios para autorizar un token.
   * @returns Una promesa que resuelve en una respuesta de tipo `AuthorizeResponse`.
   * 
   * @docs https://developers.redpay.cl/site/documentation/redpay/payer-duties#transaction-authorization
   * @api https://developers.redpay.cl/site/reference-api/redpay/api-qri-v2#tag/Gestion-transaccional/operation/authorizateTransaction
   */
  public async authorizeToken(
    authorizeInstance: AuthorizeRequest
  ): Promise<AuthorizeResponse> {
    const authorizePayload = instanceToPlain(authorizeInstance);

    const response: IAuthorizeAPIResponse = await this.client.post(
      PathUrl.Authorize,
      authorizePayload
    );

    return plainToInstance(AuthorizeResponse, response);
  }
}
