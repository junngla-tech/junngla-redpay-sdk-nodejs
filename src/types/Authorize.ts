import { TokenType } from "../enum";
import { IAmount, IMaxAmount } from "../interface";

/**
 * Tipo que define los datos adicionales requeridos para la autorización.
 * Puede ser de tipo `IAmount` o `IMaxAmount`.
 * @see IAmount - Interfaz que define la estructura de un monto.
 * @see IMaxAmount - Interfaz que define la estructura de un monto máximo. Solo se utiliza en tokens de tipo T2
 */
type Data = IAmount | IMaxAmount;

/**
 * Representa la estructura para autorizar un token.
 */
export type Authorize = {
  /**
   * Identificador único del enrolador que realiza la autorización.
   */
  enroller_user_id: string;

  /**
   * UUID único del token que se desea autorizar.
   */
  token_uuid: string;

  /**
   * UUID de la operación de validación previamente realizada.
   */
  parent_uuid: string;

  /**
   * Tipo de token que se está autorizando.
   * Referencia a los valores definidos en `TokenType`.
   */
  token_type: TokenType;

  /**
   * Datos adicionales relacionados con la autorización.
   * Puede contener la información del monto (`IAmount`) o del monto máximo (`IMaxAmount`).
   */
  data: Data;
};
