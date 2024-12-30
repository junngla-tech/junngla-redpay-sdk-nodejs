import { PathUrl } from "../enum";
import { IAuthorizeResponse, RoleActionsEP } from "../interface";
import { RedPayBase } from "../model";
import { Authorize } from "../types";

/**
 * Servicio para operaciones relacionadas con Enroladores Pagadores (RedPayEP).
 * Extiende la funcionalidad base proporcionada por `RedPayBase`.
 */
export class RedPayEPService extends RedPayBase implements RoleActionsEP {
  /**
   * Autoriza un token.
   * @param payload - Objeto de tipo `Authorize` que contiene los datos necesarios para autorizar el token.
   * @returns Una promesa que resuelve en una respuesta de tipo `IAuthorizeResponse`.
   */
  public async authorizeToken(payload: Authorize): Promise<IAuthorizeResponse> {
    return this.client.post(PathUrl.Authorize, payload);
  }
}
