 // TODO: donde realizar este import? es necesario para class-transformer
import { Expose, Type } from "class-transformer";
import { TokenType, UserType } from "../enum";
import { IData, ITokenBase } from "../interface";

/**
 * Clase que representa los datos específicos de un token.
 */
class TokenData implements IData {
  /**
   * Monto asociado al token.
   */
  @Expose()
  amount!: number;
}

/**
 * Clase abstracta que sirve como base para todos los tipos de tokens.
 */
abstract class TokenBase implements ITokenBase {
  /**
   * Identificador del enrolador asociado al token.
   */
  @Expose()
  enroller_user_id!: string;

  /**
   * Descripción o detalle del token.
   */
  @Expose()
  detail?: string;

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

  /**
   * Tipo de token, representado por la enumeración `TokenType`.
   */
  @Expose()
  token_type!: TokenType;
}

/**
 * Token de tipo T0: Incluye datos específicos asociados.
 */
class TokenT0 extends TokenBase {
  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenData)
  data!: TokenData;
}

/**
 * Token de tipo T1: No incluye datos específicos.
 */
class TokenT1 extends TokenBase {}

/**
 * Token de tipo T2: Incluye datos específicos asociados.
 */
class TokenT2 extends TokenBase {
  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenData)
  data!: TokenData;
}

/**
 * Token de tipo T3: Asociado a un usuario con tipo definido y datos específicos.
 */
class TokenT3 extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenData)
  data!: TokenData;
}

/**
 * Token de tipo T4: Similar al T3, incluye usuario y datos específicos.
 */
class TokenT4 extends TokenBase {
  /**
   * Tipo de usuario asociado al token.
   */
  @Expose()
  user_type!: UserType;

  /**
   * Datos específicos del token.
   */
  @Expose()
  @Type(() => TokenData)
  data!: TokenData;
}

export { TokenT0, TokenT1, TokenT2, TokenT3, TokenT4 };
