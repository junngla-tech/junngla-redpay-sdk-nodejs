import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  TransformFnParams,
  Type,
} from "class-transformer";
import {
  IGeo,
  ISettlement,
  ISettlementSchedule,
  IUserAccount,
  IWithdrawal,
} from "../interface";
import { SbifCode, AccountId } from "../types";
import { ScheduleMode, UserType, WithdrawalMode } from "../enum";
import { ClassBase } from "./ClassBase";

/**
 * Transforma la configuración de retiro de fondos según las reglas predefinidas.
 * @param {TransformFnParams} value - Valor transformado.
 * @returns {Withdrawal | undefined} Configuración de retiro transformada.
 */
const transformWithdrawal = ({
  value,
  obj,
}: TransformFnParams): Withdrawal | undefined => {
  if (obj.settlement) {
    const predefinedMode = Object.entries(predefinedSchedules).find(
      ([, schedule]) =>
        schedule &&
        schedule.schedule.mode === obj.settlement.schedule.mode &&
        JSON.stringify(schedule.schedule.value) ===
          JSON.stringify(obj.settlement.schedule.value)
    );

    return predefinedMode
      ? new Withdrawal({ mode: predefinedMode[0] as WithdrawalMode })
      : new Withdrawal({
          mode: WithdrawalMode.MANUAL,
          settlement: new Settlement({
            schedule: obj.settlement.schedule,
          }),
        });
  }
  return value;
};

/**
 * Representa la información de una cuenta de usuario.
 */
export class UserAccount
  extends ClassBase<UserAccount>
  implements IUserAccount
{
  /**
   * Identificador único de la cuenta.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value, obj }) => +obj.id || value, { toClassOnly: true })
  number!: number;

  @Expose({ toPlainOnly: true })
  @Exclude({ toClassOnly: true })
  @Transform(({ obj }) => obj.number?.toString(), { toPlainOnly: true })
  private id!: string;

  /**
   * Código SBIF del banco propietario.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value, obj }) => obj.owner_id || value, { toClassOnly: true })
  bank!: SbifCode;

  @Expose({ toPlainOnly: true })
  @Exclude({ toClassOnly: true })
  @Transform(({ obj }) => obj.bank, { toPlainOnly: true })
  private owner_id!: SbifCode;

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
export class Geo extends ClassBase<Geo> implements IGeo {
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
export class SettlementSchedule
  extends ClassBase<SettlementSchedule>
  implements ISettlementSchedule
{
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
export class Settlement extends ClassBase<Settlement> implements ISettlement {
  /**
   * Programación de liquidación asociada.
   */
  @Expose()
  @Type(() => SettlementSchedule)
  schedule!: SettlementSchedule;
}

export class Withdrawal extends ClassBase<Withdrawal> implements IWithdrawal {
  /**
   * Modo de retiro de fondos.
   * `DAILY` - Todos los días.
   * `BIWEEKLY` - Cada dos semanas (quincenal).
   * `MONTHLY` - Mensual.
   * `MANUAL` - Configuración manual.
   */
  @Expose()
  mode!: WithdrawalMode;

  /**
   * Configuración personalizada de liquidación (opcional).
   * Es requerido si `mode` es `manual`.
   */
  @Expose()
  @Type(() => Settlement)
  settlement?: Settlement;
}

/**
 * Clase base abstracta para usuarios.
 */
abstract class UserBase extends ClassBase<UserBase> {
  /**
   * Identificador del enrolador asociado al usuario.
   * Esta propiedad se expone cuando se instancia un objeto.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value, obj }) => obj.enroller_user_id || value, {
    toClassOnly: true,
  })
  user_id!: string;

  /**
   * Identificador del enrolador en formato de objeto plano.
   * Esta propiedad se expone cuando se transforma a un objeto plano.
   */
  @Expose({ toPlainOnly: true })
  @Exclude({ toClassOnly: true })
  @Transform(({ obj }) => obj.user_id, { toPlainOnly: true })
  private enroller_user_id!: string;

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

  @Expose({ toPlainOnly: true })
  get user_type(): string {
    throw new Error("user_type getter must be implemented in derived classes");
  }
}

/**
 * Representa un usuario recaudador (collector).
 */
export class UserCollectorRequest extends UserBase {
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
   * Configuración de retiro de fondos del recaudador. Solo visible en instancias.
   */
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Type(() => Withdrawal)
  @Transform(transformWithdrawal, { toClassOnly: true })
  withdrawal!: Withdrawal;

  /**
   * Configuración de liquidación del recaudador. Solo visible en objetos planos.
   */
  @Expose({ toPlainOnly: true })
  @Exclude({ toClassOnly: true })
  @Transform(
    ({ obj }) => {
      const mode = obj.withdrawal?.mode as WithdrawalMode;
      return predefinedSchedules[mode] ?? obj.withdrawal?.settlement;
    },
    { toPlainOnly: true }
  )
  private settlement!: Settlement;

  /**
   * Tipo de usuario: siempre `collector` para esta clase.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => UserType.COLLECTOR)
  get user_type(): string {
    return UserType.COLLECTOR;
  }

  constructor(data?: Partial<UserCollectorRequest> | string) {
    super(data);
  }
}

/**
 * Representa un usuario pagador (payer).
 */
export class UserPayerRequest extends UserBase {
  /**
   * Información geográfica del pagador (opcional).
   */
  @Expose()
  @Type(() => Geo)
  geo?: Geo;

  /**
   * Tipo de usuario: siempre `payer` para esta clase.
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => UserType.PAYER)
  get user_type(): string {
    return UserType.PAYER;
  }

  constructor(data?: Partial<UserPayerRequest> | string) {
    super(data);
  }
}

/**
 * Representa la respuesta del sistema para un usuario.
 */
export class User extends ClassBase<User> {
  /**
   * Identificador único del usuario.
   * Esta propiedad se expone solo al transformar a clase y se excluye al convertir a objeto plano.
   * @type {string}
   * @readonly
   */
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Transform(({ obj }) => obj.enroller_user_id)
  readonly user_id!: string;

  /**
   * Identificador interno del enrolador del usuario.
   * Esta propiedad no se expone en las transformaciones.
   * @type {string}
   * @private
   */
  @Exclude()
  private readonly enroller_user_id!: string;

  /**
   * Nombre del usuario o razón social.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly name!: string;

  /**
   * Correo electrónico del usuario.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly email!: string;

  /**
   * Tipo de usuario (por ejemplo, `collector` o `payer`).
   * @type {UserType}
   * @readonly
   */
  @Expose()
  readonly user_type!: UserType;

  /**
   * Identificación tributaria del usuario (RUT).
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly tax_id!: string;

  /**
   * Dirección tributaria del usuario (opcional).
   * @type {string | undefined}
   * @readonly
   */
  @Expose()
  readonly tax_address?: string;

  /**
   * Nombre de fantasía o glosa asociada al usuario (opcional).
   * @type {string | undefined}
   * @readonly
   */
  @Expose()
  readonly gloss?: string;

  /**
   * Información geográfica del usuario.
   * @type {Geo | undefined}
   * @readonly
   */
  @Expose()
  readonly geo?: Geo;

  /**
   * Información de la cuenta bancaria asociada al usuario.
   * @type {UserAccount}
   * @readonly
   */
  @Expose()
  readonly account!: UserAccount;

  /**
   * Indica si el comercio requiere activación en el Portal de Cartolas.
   * @type {boolean | undefined}
   * @readonly
   */
  @Expose()
  readonly required_activation?: boolean;

  /**
   * Configuración interna de liquidación del comercio.
   * Esta propiedad no se expone en las transformaciones.
   * @type {string}
   * @private
   */
  @Exclude()
  private readonly settlement!: string;

  /**
   * Configuración de retiro de fondos del recaudador.
   * Solo visible al transformar a clase y excluida en objetos planos.
   * @type {Withdrawal | undefined}
   */
  @Expose()
  @Exclude({ toPlainOnly: true })
  @Type(() => Withdrawal)
  @Transform(transformWithdrawal, { toClassOnly: true })
  withdrawal?: Withdrawal;

  /**
   * Constructor de la clase `UserReponse`.
   * Permite inicializar la instancia con datos parciales.
   * @param {Partial<User>} [data] - Datos opcionales para inicializar la instancia.
   */
  constructor(data?: Partial<User>) {
    super(data);
  }
}

/**
 * Respuesta del sistema para un usuario generado.
 */
export class GenerateUserResponse extends ClassBase<GenerateUserResponse> {
  /**
   * Usuario generado.
   */
  @Expose()
  @Transform(({ obj }) => plainToInstance(User, obj.user))
  @Type(() => User)
  user!: User;

  /**
   * UUID de la operación asociada.
   */
  @Expose()
  operation_uuid!: string;

  /**
   * Firma de integridad de la operación.
   */
  @Expose()
  signature!: string;
}

/**
 * Programaciones predefinidas de liquidación.
 */
const predefinedSchedules: Record<WithdrawalMode, Settlement | null> = {
  [WithdrawalMode.DAILY]: new Settlement({
    schedule: new SettlementSchedule({
      mode: ScheduleMode.DAYS_OF_WEEK,
      value: [1, 2, 3, 4, 5],
    }),
  }),
  [WithdrawalMode.BIWEEKLY]: new Settlement({
    schedule: new SettlementSchedule({
      mode: ScheduleMode.DAYS_OF_MONTH,
      value: [1, 15],
    }),
  }),
  [WithdrawalMode.MONTHLY]: new Settlement({
    schedule: new SettlementSchedule({
      mode: ScheduleMode.DAYS_OF_MONTH,
      value: [1],
    }),
  }),
  [WithdrawalMode.MANUAL]: null,
};
