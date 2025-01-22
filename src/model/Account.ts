import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IAccount, IAccounts } from "../interface/RedPayConfig";
import { SbifCode } from "../types/SbifCode";
import { AccountType } from "../types/AccountType";
import { ClassBase } from "./ClassBase";

/**
 * Representa una cuenta individual con sus propiedades y transformaciones.
 * Extiende la clase genérica `ClassBase` para la clase Account.
 */
export class Account extends ClassBase<Account> implements IAccount {
  /**
   * Identificador único para la cuenta.
   * @type {string}
   * @visibility Se incluye al transformar a clase (`toClassOnly`) y se excluye al convertir a un objeto plano (`toPlainOnly`).
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  account_id!: string;

  /**
   * Identificador interno y privado para la cuenta.
   * Este se mapea al valor de `account_id` al transformar a un objeto plano.
   * @type {string}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(({ obj }) => obj.account_id)
  private id!: string;

  /**
   * Número de la cuenta representado como una cadena de texto al transformar a un objeto plano.
   * @type {number}
   */
  @Expose()
  @Transform(({ obj }) => obj.number.toString(), { toPlainOnly: true })
  number!: number;

  /**
   * Código bancario según el estándar de la SBIF (Superintendencia de Bancos e Instituciones Financieras de Chile).
   * @type {SbifCode}
   */
  @Expose()
  sbif_code!: SbifCode;

  /**
   * Tipo de la cuenta (por ejemplo, corriente, de ahorro).
   * @type {AccountType}
   */
  @Expose()
  type!: AccountType;
}

/**
 * Representa un conjunto de cuentas utilizadas para diferentes propósitos.
 * Extiende la clase genérica `ClassBase` para la clase Accounts.
 */
export class Accounts extends ClassBase<Accounts> implements IAccounts {
  /**
   * La cuenta utilizada para procesos de autorización.
   * Se requiere para el rol `PAYER`.
   * @type {Account | undefined}
   */
  @Expose()
  @Type(() => Account)
  authorize?: Account;

  /**
   * La cuenta utilizada para manejar devoluciones de cargos (chargebacks).
   * Esta configuración es para el rol `COLLECTOR` y es opcional.
   * @type {Account | undefined}
   */
  @Expose()
  @Type(() => Account)
  chargeback?: Account;

  /**
   * La cuenta utilizada para manejar devoluciones de cargos automáticas.
   * Esta configuración es para el rol `COLLECTOR` y es opcional.
   * @type {Account | undefined}
   */
  @Expose()
  @Type(() => Account)
  chargeback_automatic?: Account;
}
