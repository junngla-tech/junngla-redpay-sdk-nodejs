import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";
import { SignedAuthorizationAccount } from "./SignedAuthorization";
import { ClassBase } from "./ClassBase";
import { AuthorizationMode } from "../enum";
import { RedPayConfigProvider } from "../provider";

/**
 * Representa una solicitud de devolución (chargeback) con la información necesaria para procesarla.
 * Extiende la clase genérica `ClassBase` para ChargebackRequest.
 */
export class ChargebackRequest extends ClassBase<ChargebackRequest> {
  /**
   * Identificador único del comercio que genera la solicitud.
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
   * UUID de la autorización asociada a la devolución.
   * @type {string}
   */
  @Expose()
  authorization_uuid!: string;

  /**
   * Monto asociado a la devolución.
   * Puede ser parcial o total del monto de la autorización.
   * @type {number}
   */
  @Expose()
  amount!: number;

  /**
   * Cuenta de autorización firmada con el modo `Chargeback`.
   * Solo se incluye al convertir a un objeto plano.
   * @type {SignedAuthorizationAccount}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => {
    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.Chargeback);
    return filler;
  })
  private filler!: SignedAuthorizationAccount;

  /**
   * Cuenta de autorización firmada con el modo `ChargebackAutomatic`, generada si está configurada.
   * Solo se incluye al convertir a un objeto plano.
   * @type {SignedAuthorizationAccount | undefined}
   * @private
   */
  @Expose({ toPlainOnly: true })
  @Transform(() => {
    const config = RedPayConfigProvider.getInstance().getConfig();

    if (!config.secrets?.chargeback_automatic) return undefined;

    const filler = new SignedAuthorizationAccount();
    filler.setAuthorization(AuthorizationMode.ChargebackAutomatic);
    return filler;
  })
  private debit_filler?: SignedAuthorizationAccount;
}

/**
 * Representa los detalles de una devolción procesada.
 */
class Chargeback {
  /**
   * UUID de la devolución.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly uuid!: string;

  /**
   * Referencia asociada a la devolución.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly reference!: string;

  /**
   * UUID de la liquidación asociada a la devolución.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly settlement_uuid!: string;

  /**
   * Identificador único del comercio, mapeado desde `enroller_user_id`.
   * @type {string}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => obj.enroller_user_id)
  readonly user_id!: string;

  /**
   * Identificador interno del enrolador del comercio.
   * @type {string}
   * @private
   */
  @Exclude()
  private enroller_user_id!: string;

  /**
   * Monto asociado a la devolución.
   * @type {number}
   * @readonly
   */
  @Expose()
  readonly amount!: number;

  /**
   * Cuenta de autorización firmada con el modo `Chargeback`.
   * @type {SignedAuthorizationAccount}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => obj.filler)
  readonly signed_authorization_account!: SignedAuthorizationAccount;

  /**
   * Cuenta de autorización firmada con el modo `ChargebackAutomatic`.
   * @type {SignedAuthorizationAccount | undefined}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => obj.debit_filler)
  readonly signed_authorization_account_automatic?: SignedAuthorizationAccount;

  /**
    * Firma de integridad de la operación.
   * @type {string}
   * @readonly
   */
  @Expose()
  readonly signature!: string;

  /**
   * Información privada de la cuenta firmada para el modo `Chargeback`.
   * @type {SignedAuthorizationAccount}
   * @private
   */
  @Exclude()
  private filler!: SignedAuthorizationAccount;

  /**
   * Información privada de la cuenta firmada para el modo `ChargebackAutomatic`.
   * @type {SignedAuthorizationAccount | undefined}
   * @private
   */
  @Exclude()
  private debit_filler?: SignedAuthorizationAccount;
}

/**
 * Representa la respuesta a una solicitud de devolución.
 */
export class ChargebackResponse {
  /**
   * Detalles de la devolución procesada.
   * @type {Chargeback}
   * @readonly
   */
  @Expose()
  @Transform(({ obj }) => plainToInstance(Chargeback, obj.chargeback))
  readonly chargeback!: Chargeback;

  /**
   * UUID de la operación asociada a la devolución.
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
