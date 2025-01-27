import {
  Exclude,
  Expose,
  Transform,
  Type,
} from "class-transformer";
import { ClassBase } from "./ClassBase";
import { TokenType, UserType } from "../enum";

/**
 * Representa la solicitud para validar un token.
 */
export class ValidateTokenRequest extends ClassBase<ValidateTokenRequest> {
  /**
   * Identificador único del usuario que realiza la validación.
   * Esta propiedad se expone solo al transformar a clase y se excluye al convertir a objeto plano.
   * @type {string}
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  /**
   * Identificador del enrolador del usuario, mapeado desde `user_id`.
   * Esta propiedad se expone al convertir a objeto plano.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id)
  private enroller_user_id!: string;

  /**
   * UUID del token que se desea validar.
   * @type {string}
   */
  @Expose()
  token_uuid!: string;

  /**
   * Tipo de usuario que realiza la solicitud de validación.
   * @type {UserType}
   */
  @Expose()
  user_type!: UserType;
}

/**
 * Representa los datos asociados a la validación del token.
 */
export class ValidateTokenData {
  /**
   * Monto asociado al token validado.
   * @type {number}
   * @readonly
   */
  @Expose()
  readonly amount!: number;
}

/**
 * Representa la respuesta de la validación de un token.
 */
export class ValidateTokenResponse {
  /**
   * Nombre de fantasía o glosa asociada al token.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly gloss!: string;

  /**
   * Detalles adicionales sobre el token validado.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly detail!: string;

  /**
   * UUID del token validado.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly token_uuid!: string;

  /**
   * Tipo de token validado.
   * @type {TokenType}
   * @readonly
   */
  @Expose()
  readonly token_type!: TokenType;

  /**
   * Datos asociados al token validado (opcional).
   * @type {ValidateTokenData | undefined}
   * @readonly
   */
  @Expose()
  @Type(() => ValidateTokenData)
  readonly data?: ValidateTokenData;

  /**
   * UUID de la operación asociada a la validación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly operation_uuid!: string;

  /**
   * Firma de integridad de la operación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly signature!: string;
}
