import "reflect-metadata";
import { Expose, Type } from "class-transformer";
import { ScheduleMode, UserType } from "../enum";
import {
  IGeo,
  ISettlement,
  ISettlementSchedule,
  IUserAccount,
} from "../interface";
import { AccountId, SbifCode } from "../types";

/**
 * Representa la información de una cuenta de usuario.
 */
class UserAccount implements IUserAccount {
  /**
   * Identificador único de la cuenta.
   */
  @Expose()
  id!: string;

  /**
   * Código SBIF del banco propietario.
   */
  @Expose()
  owner_id!: SbifCode;

  /**
   * Tipo de cuenta, representado por `AccountId`.
   */
  @Expose()
  type!: AccountId;

  /**
   * Identificación tributaria asociada a la cuenta.
   */
  @Expose()
  tax_id!: string;
}

/**
 * Representa las coordenadas geográficas de un usuario.
 */
class Geo implements IGeo {
  /**
   * Latitud.
   */
  @Expose()
  lat!: number;

  /**
   * Longitud.
   */
  @Expose()
  lng!: number;
}

/**
 * Representa un horario de liquidación para un usuario recaudador.
 */
class SettlementSchedule implements ISettlementSchedule {
  /**
   * Modo de programación, como días de la semana o días del mes.
   */
  @Expose()
  mode!: ScheduleMode;

  /**
   * Lista de valores según el modo seleccionado.
   */
  @Expose()
  value!: number[];
}

/**
 * Representa la configuración de liquidación para un usuario recaudador.
 */
class Settlement implements ISettlement {
  /**
   * Programación de liquidación asociada.
   */
  @Expose()
  @Type(() => SettlementSchedule)
  schedule!: SettlementSchedule;
}

/**
 * Clase base abstracta para usuarios.
 */
abstract class UserBase {
  /**
   * Identificador del enrolador asociado al usuario.
   */
  @Expose()
  enroller_user_id!: string;

  /**
   * Información de la cuenta bancaria asociada al usuario.
   */
  @Expose()
  @Type(() => UserAccount)
  account!: UserAccount;

  /**
   * Correo electrónico del usuario.
   */
  @Expose()
  email!: string;

  /**
   * Nombre del usuario o razón social.
   */
  @Expose()
  name!: string;

  /**
   * Identificación tributaria del usuario.
   */
  @Expose()
  tax_id!: string;

  /**
   * Tipo de usuario, definido en las subclases concretas.
   */
  abstract get user_type(): UserType;
}

/**
 * Representa un usuario recaudador (collector).
 */
class UserCollector extends UserBase {
  /**
   * Dirección tributaria del recaudador.
   */
  @Expose()
  tax_address!: string;

  /**
   * Nombre de fantasía del recaudador.
   */
  @Expose()
  gloss!: string;

  /**
   * Información geográfica del recaudador.
   */
  @Expose()
  @Type(() => Geo)
  geo!: Geo;

  /**
   * Configuración de liquidación del recaudador.
   */
  @Expose()
  @Type(() => Settlement)
  settlement!: Settlement;

  /**
   * Tipo de usuario: siempre `collector` para esta clase.
   */
  @Expose()
  get user_type(): UserType {
    return UserType.COLLECTOR;
  }
}

/**
 * Representa un usuario pagador (payer).
 */
class UserPayer extends UserBase {
  /**
   * Información geográfica del pagador (opcional).
   */
  @Expose()
  @Type(() => Geo)
  geo?: Geo;

  /**
   * Tipo de usuario: siempre `payer` para esta clase.
   */
  @Expose()
  get user_type(): UserType {
    return UserType.PAYER;
  }
}

export {
  UserBase,
  UserCollector,
  UserPayer,
  Settlement,
  SettlementSchedule,
  UserAccount,
  Geo,
};
