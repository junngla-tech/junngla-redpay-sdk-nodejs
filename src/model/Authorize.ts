import { Exclude, Expose, Transform, Type } from "class-transformer";
import { AuthorizationMode, TokenType } from "../enum";
import { SignedAuthorizationAccount } from "./SignedAuthorization";
import { ClassBase } from "./ClassBase";
import { ISettlement } from "../interface";

/**
 * Representa los datos relacionados con una solicitud de autorización.
 * Extiende la clase genérica `ClassBase` para Data.
 */
class Data extends ClassBase<Data> {
  /**
   * Monto asociado a la operación de autorización.
   * @type {number | undefined}
   */
  @Expose()
  amount?: number;

  /**
   * Monto máximo permitido para la operación de suscripción.
   * @type {number | undefined}
   */
  @Expose()
  max_amount?: number;

  /**
   * Información adicional sobre la autorización firmada.
   * @type {SignedAuthorizationAccount}
   */
  @Expose()
  filler!: SignedAuthorizationAccount;
}

/**
 * Representa una solicitud de autorización con datos relacionados con el token, el usuario y la validación.
 * Extiende la clase genérica `ClassBase` para AuthorizeRequest.
 */
export class AuthorizeRequest extends ClassBase<AuthorizeRequest> {
  /**
   * Identificador único del usuario que realiza la solicitud.
   * @type {string}
   * @visibility Incluido solo al transformar a clase y excluido al convertir a objeto plano.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  /**
   * Identificador del usuario, mapeado desde `user_id`.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id)
  private enroller_user_id!: string;

  /**
   * Identificador único del token asociado a la solicitud.
   * @type {string}
   */
  @Expose()
  token_uuid!: string;

  /**
   * UUID de la operación de validación previamente realizada.
   * @type {string}
   * @visibility Incluido solo al transformar a clase y excluido al convertir a objeto plano.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  validation_uuid!: string;

  /**
   * UUID del padre, mapeado desde `validation_uuid`.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.validation_uuid)
  private parent_uuid!: string;

  /**
   * Tipo de token asociado a la solicitud.
   * @type {TokenType}
   */
  @Expose()
  token_type!: TokenType;

  /**
   * Monto asociado a la solicitud.
   * @type {number}
   * @visibility Incluido solo al transformar a clase y excluido al convertir a objeto plano.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  amount!: number;

  /**
   * Datos adicionales de la operación, generados dinámicamente según el tipo de token.
   * @type {Data}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => {
    const { token_type, amount } = obj;

    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.Authorize);

    const data = new Data();
    data.filler = filler;
    token_type !== TokenType.T1
      ? (data.amount = amount)
      : (data.max_amount = amount);

    return data;
  })
  private data!: Data;
}

/**
 * Representa las operaciones relacionadas con una solicitud de autorización.
 */
export class Operations {
  /**
   * UUID generado para la operación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly generation_uuid!: string;

  /**
   * UUID utilizado para la verificación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly verification_uuid!: string;

  /**
   * UUID utilizado para la autorización.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly authorization_uuid!: string;
}

/**
 * Representa la respuesta a una solicitud de autorización.
 */
export class AuthorizeResponse {
  /**
   * UUID del token asociado a la respuesta.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly token_uuid!: string;

  /**
   * Detalles de las operaciones realizadas.
   * @type {Operations}
   * @readonly
   */
  @Expose()
  readonly operations!: Operations;

  /**
   * Indica si la operación utilizara med o no.
   * Si es verdadero, se utilizará med y se generará una liquidación.
   * Si es falso, no se utilizará med, no se generará una liquidación y el enrolador deberá realizar el movimiento de fondos manualmente.
   * @type {boolean}
   * @readonly
   */
  @Expose()
  readonly is_med!: boolean;

  /**
   * Marca de tiempo de la operación.
   * @type {Date}
   * @readonly
   */
  @Expose()
  @Type(() => Date)
  readonly timestamp!: Date;

  /**
   * Información sobre la cuenta de autorización firmada.
   * @type {SignedAuthorizationAccount}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => obj.filler)
  readonly signed_authorization_account!: SignedAuthorizationAccount;

  /**
   * Información privada sobre la cuenta de autorización firmada.
   * @type {SignedAuthorizationAccount}
   * @private
   */
  @Exclude()
  private filler!: SignedAuthorizationAccount;

  /**
   * Información opcional sobre la liquidación.
   * @type {ISettlement | undefined}
   * @readonly
   */
  @Expose()
  readonly settlement?: ISettlement;

  /**
   * Identificador único del colector.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly collector_id!: string;

  /**
   * UUID de la operación asociada.
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
