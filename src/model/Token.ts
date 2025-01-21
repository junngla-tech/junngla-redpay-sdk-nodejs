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
   */
  @Expose()
  amount!: number;
}

/**
 * Clase abstracta que sirve como base para todos los tipos de tokens.
 */
export abstract class TokenBase extends ClassBase<TokenBase> {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  user_id!: string;

  @Expose({ toPlainOnly: true })
  // @Exclude({ toClassOnly: true })
  @Transform(({ obj }) => obj.user_id, { toPlainOnly: true })
  private enroller_user_id!: string;
  /**
   * Descripción o detalle del token.
   */
  @Expose()
  detail!: string;

  /**
   * Datos adicionales del token en formato JSON.
   */
  @Expose()
  extra_data?: string;

  /**
   * Tiempo de vida del token en segundos.
   */
  @Expose()
  lifetime?: number;

  /**
   * Reusabilidad del token (cuántas veces puede ser utilizado).
   */
  @Expose()
  reusability?: number;

}

/**
 * Token de tipo T0: Compra
 */
export class TokenT0Request extends TokenBase {
  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenDataT0)
  data!: TokenDataT0;

  /**
   * Tipo de token: T0.
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
 * Token de tipo T1: Suscripción
 */
export class TokenT1Request extends TokenBase {
  /**
   * Tipo de token: T1.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T1)
  get token_type(): string {
    return TokenType.T1;
  }
}

/**
 * Token de tipo T2: Cobro de suscripción
 */
export class TokenT2Request extends TokenBase {
  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenDataT2)
  data!: TokenDataT2;

  /**
   * Tipo de token: T2.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T2)
  get token_type(): string {
    return TokenType.T2;
  }
}

/**
 * Token de tipo T3: Envío de dinero de producto Alias Send
 */
export class TokenT3Request extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenDataT3)
  data!: TokenDataT3;

  /**
   * Tipo de token: T3.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T3)
  get token_type(): string {
    return TokenType.T3;
  }
}

/**
 * Token de tipo T4: Compra de producto Alias Pay
 */
export class TokenT4Request extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenDataT4)
  data!: TokenDataT4;

  /**
   * Tipo de token: T4.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => TokenType.T4)
  get token_type(): string {
    return TokenType.T4;
  }
}

export class TokenResponse extends ClassBase<TokenResponse> {
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Transform(({ obj }) => obj.enroller_user_id)
  readonly user_id!: string;

  @Exclude()
  private readonly enroller_user_id!: string;

  @Expose()
  readonly token_uuid!: string;

  @Expose()
  readonly token_number!: string;

  @Expose()
  readonly token_url!: string;

  @Expose()
  readonly detail!: string;

  @Expose()
  readonly extra_data?: string;

  @Expose()
  readonly lifetime!: number;

  @Expose()
  readonly reusability!: number;

  @Expose()
  readonly data?: TokenDataT0 | TokenDataT2 | TokenDataT3 | TokenDataT4;

  @Expose()
  readonly token_type!: TokenType;
}

export class GenerateTokenResponse extends ClassBase<TokenResponse> {
  @Exclude()
  private readonly payment_token!: IPaymentToken;

  @Expose()
  @Transform(({ obj }) => plainToInstance(TokenResponse, obj.payment_token))
  @Type(() => TokenResponse)
  readonly token!: TokenResponse;

  @Expose()
  readonly operation_uuid!: string;

  @Expose()
  readonly signature!: string;
}
