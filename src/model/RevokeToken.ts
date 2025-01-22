import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ClassBase } from "./ClassBase";

/**
 * Representa una solicitud para revocar un token.
 * Extiende la clase genérica `ClassBase` para la clase RevokeTokenRequest.
 */
export class RevokeTokenRequest extends ClassBase<RevokeTokenRequest> {
  /**
   * Identificador único del comercio que solicita la revocación del token.
   * Solo se incluye al transformar a clase y se excluye al convertir a objeto plano.
   * @type {string}
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  /**
   * Identificador del comercio, mapeado desde `user_id`.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id)
  private enroller_user_id!: string;

  /**
   * UUID del token que se desea revocar.
   * @type {string}
   */
  @Expose()
  token_uuid!: string;
}

/**
 * Representa la respuesta a una solicitud de revocación de un token.
 */
export class RevokeTokenResponse {
  /**
   * Glosa asociada a la revocación del token.
   * Solo se incluye al transformar a objeto plano, mapeada desde `description`.
   * @type {string}
   * @readonly
   */
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Transform(({ obj }) => obj.description)
  readonly gloss!: string;

  /**
   * Detalle adicional sobre la revocación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly detail!: string;

  /**
   * Fecha en la que el token fue revocado.
   * @type {Date}
   * @readonly
   */
  @Expose()
  @Type(() => Date)
  readonly revoked_at!: Date;

  /**
   * UUID de la operación asociada a la revocación del token.
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

  /**
   * Descripción interna de la operación. 
   * No se expone al convertir a un objeto plano.
   * @type {string}
   * @private
   */
  @Exclude()
  private description!: string;
}
