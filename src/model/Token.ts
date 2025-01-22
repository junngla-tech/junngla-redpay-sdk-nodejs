import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from "class-transformer";
import { IData, IPaymentToken } from "../interface";
import { UserType, TokenType } from "../enum";
import { ClassBase } from "./ClassBase";

/**
 * Datos específicos asociados a un token de tipo T0.
 */
export class TokenDataT0 extends ClassBase<TokenDataT0> implements IData {
  /**
   * Monto asociado al token.
   * @type {number}
   */
  @Expose()
  amount!: number;
}

/**
 * Datos específicos asociados a un token de tipo T2.
 */
export class TokenDataT2 extends ClassBase<TokenDataT2> implements IData {
  /**
   * Monto asociado al token.
   * @type {number}
   */
  @Expose()
  amount!: number;
}

/**
 * Datos específicos asociados a un token de tipo T3.
 */
export class TokenDataT3 extends ClassBase<TokenDataT3> implements IData {
  /**
   * Monto asociado al token.
   * @type {number}
   */
  @Expose()
  amount!: number;
}

/**
 * Datos específicos asociados a un token de tipo T4.
 */
export class TokenDataT4 extends ClassBase<TokenDataT4> implements IData {
  /**
   * Monto asociado al token.
   * @type {number}
   */
  @Expose()
  amount!: number;
}

/**
 * Clase abstracta que sirve como base para todos los tipos de tokens.
 */
export abstract class TokenBase extends ClassBase<TokenBase> {
  /**
   * Identificador único del usuario asociado al token.
   * @type {string}
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  /**
   * Identificador del enrolador del usuario.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.user_id, { toPlainOnly: true })
  private enroller_user_id!: string;

  /**
   * Descripción o detalle del token.
   * @type {string}
   */
  @Expose()
  detail!: string;

  /**
   * Datos adicionales del token en formato JSON.
   * @type {string | undefined}
   */
  @Expose()
  extra_data?: string;

  /**
   * Tiempo de vida del token en segundos.
   * @type {number | undefined}
   */
  @Expose()
  lifetime?: number;

  /**
   * Reusabilidad del token (cuántas veces puede ser utilizado).
   * @type {number | undefined}
   */
  @Expose()
  reusability?: number;
}

/**
 * Token de tipo T0: Compra.
 */
export class TokenT0Request extends TokenBase {
  /**
   * Datos específicos del token.
   * @type {TokenDataT0}
   */
  @Expose()
  @Type(() => TokenDataT0)
  data!: TokenDataT0;

  /**
   * Tipo de token: T0.
   * @type {string}
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T0)
  get token_type(): string {
    return TokenType.T0;
  }

  constructor(data?: Partial<TokenT0Request> | string) {
    super(data);
  }
}

/**
 * Token de tipo T1: Suscripción.
 */
export class TokenT1Request extends TokenBase {
  /**
   * Tipo de token: T1.
   * @type {string}
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T1)
  get token_type(): string {
    return TokenType.T1;
  }
}

/**
 * Token de tipo T2: Cobro de suscripción.
 */
export class TokenT2Request extends TokenBase {
  /**
   * Datos específicos del token.
   * @type {TokenDataT2}
   */
  @Expose()
  @Type(() => TokenDataT2)
  data!: TokenDataT2;

  /**
   * Tipo de token: T2.
   * @type {string}
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T2)
  get token_type(): string {
    return TokenType.T2;
  }
}

/**
 * Token de tipo T3: Envío de dinero (Alias Send).
 */
export class TokenT3Request extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   * @type {UserType}
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   * @type {TokenDataT3}
   */
  @Expose()
  @Type(() => TokenDataT3)
  data!: TokenDataT3;

  /**
   * Tipo de token: T3.
   * @type {string}
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T3)
  get token_type(): string {
    return TokenType.T3;
  }
}

/**
 * Token de tipo T4: Compra (Alias Pay).
 */
export class TokenT4Request extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   * @type {UserType}
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   * @type {TokenDataT4}
   */
  @Expose()
  @Type(() => TokenDataT4)
  data!: TokenDataT4;

  /**
   * Tipo de token: T4.
   * @type {string}
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T4)
  get token_type(): string {
    return TokenType.T4;
  }
}

/**
 * Representa la respuesta de un token generado.
 */
export class TokenResponse extends ClassBase<TokenResponse> {
  /**
   * Identificador único del comercio.
   * @type {string}
   * @readonly
   */
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Transform(({ obj }) => obj.enroller_user_id)
  readonly user_id!: string;

  /**
   * UUID del token generado.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly token_uuid!: string;

  /**
   * Número del token.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly token_number!: string;

  /**
   * URL asociada al token.
   * @description Este valor es el que se debe utilizar para renderizar el token como un QR.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly token_url!: string;

  /**
   * Detalle del token.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly detail!: string;

  /**
   * Datos adicionales asociados al token.
   * @type {string | undefined}
   * @readonly
   */
  @Expose()
  readonly extra_data?: string;

  /**
   * Tiempo de vida del token en segundos.
   * @type {number}
   * @readonly
   */
  @Expose()
  readonly lifetime!: number;

  /**
   * Reusabilidad del token.
   * @type {number}
   * @readonly
   */
  @Expose()
  readonly reusability!: number;

  /**
   * Datos específicos asociados al token.
   * @type {TokenDataT0 | TokenDataT2 | TokenDataT3 | TokenDataT4 | undefined}
   * @readonly
   */
  @Expose()
  readonly data?: TokenDataT0 | TokenDataT2 | TokenDataT3 | TokenDataT4;

  /**
   * Tipo del token.
   * @type {TokenType}
   * @readonly
   */
  @Expose()
  readonly token_type!: TokenType;
}

/**
 * Representa la respuesta generada para un token.
 */
export class GenerateTokenResponse extends ClassBase<TokenResponse> {
  /**
   * Token de pago asociado a la operación.
   * @type {IPaymentToken}
   * @private
   */
  @Exclude()
  private readonly payment_token!: IPaymentToken;

  /**
   * Token generado como parte de la respuesta.
   * @type {TokenResponse}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => plainToInstance(TokenResponse, obj.payment_token))
  @Type(() => TokenResponse)
  readonly token!: TokenResponse;

  /**
   * UUID de la operación asociada al token.
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
