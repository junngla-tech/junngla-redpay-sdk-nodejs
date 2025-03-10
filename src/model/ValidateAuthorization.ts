import { Exclude, Expose, Transform } from "class-transformer";
import { ClassBase } from "./ClassBase";
import { AuthorizeResponse } from "./Authorize";
import { UserType } from "../enum";

/**
 * Representa la estructura base para la validación de autorizaciones.
 */
abstract class ValidateAuthorization extends ClassBase<ValidateAuthorization> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id)
  private enroller_user_id!: string;

  @Expose()
  user_type!: UserType;
}

/**
 * Representa la validación de autorizaciones para un recolector (collector).
 */
export class ValidateAuthorizationCollectorRequest extends ValidateAuthorization {
  /**
   * UUID de la autorización que se está validando.
   */
  @Expose()
  authorization_uuid!: string;

  constructor(data?: Partial<ValidateAuthorizationCollectorRequest> | string) {
    super(data);
  }
}

/**
 * Representa la validación de autorizaciones para un pagador (payer).
 */
export class ValidateAuthorizationPayerRequest extends ValidateAuthorization {
  /**
   * UUID de la validación que se realizó sobre la transacción.
   */
  @Expose()
  validation_uuid?: string;

  /**
   * UUID de la autorización que se está validando (opcional).
   */
  @Expose()
  authorization_uuid?: string;

  constructor(data?: Partial<ValidateAuthorizationPayerRequest> | string) {
    super(data);
  }
}

export class ValidationAuthorizationResponse extends AuthorizeResponse {
  /**
   * Monto asociado al token.
   * Este campo se incluye en el rol recaudador (collector).
   */
  @Expose()
  readonly amount?: number;

  /**
   * ID del usuario que realiza la autorización.
   * Este campo se incluye en el rol recaudador (collector).
   */
  @Expose()
  readonly payer_id?: string;

  /**
   * Código de estado de la autorización.
   * Este campo se incluye en el rol recaudador (collector).
   */
  @Expose()
  readonly status_code?: string;

  /**
   * Datos adicionales que se desean almacenar.
   * Este campo se incluye en el rol recaudador (collector).
   */
  @Expose()
  readonly extra_data?: string;
}
