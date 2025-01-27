import { Expose, Type } from "class-transformer";
import { Secrets } from "./Secret";
import { Certificate } from "./Certificate";
import { Accounts } from "./Account";
import { Enroller, RedPayEnvironment } from "../enum";
import { IRedPayConfig } from "../interface";
import { ClassBase } from "./ClassBase";

/**
 * Representa la configuración de RedPay, incluyendo secretos, certificados, cuentas y entorno.
 * Extiende la clase genérica `ClassBase` y cumple con la interfaz `IRedPayConfig`.
 */
export class RedPayConfig
  extends ClassBase<RedPayConfig>
  implements IRedPayConfig
{
  /**
   * Contiene los secretos necesarios para la configuración de RedPay.
   * @type {Secrets}
   */
  @Expose()
  @Type(() => Secrets)
  secrets!: Secrets;

  /**
   * Nombre del entorno en el que opera la configuración.
   * @type {RedPayEnvironment}
   */
  @Expose()
  environment!: RedPayEnvironment;

  /**
   * Certificados mTLS asociados a la configuración de RedPay.
   * @type {Certificate}
   */
  @Expose()
  @Type(() => Certificate)
  certificates!: Certificate;

  /**
   * Tipo de enrolador asociado a la configuración.
   * @type {Enroller}
   */
  @Expose()
  type!: Enroller;

  /**
   * Cuentas configuradas para operaciones de RedPay.
   * El rol `COLLECTOR` debe configurar las cuentas de `chargeback` y `chargeback_automatic` si es que desea manejar devoluciones.
   * El rol `PAYER` debe configurar la cuenta de `authorize`.
   * @type {Accounts | undefined}
   */
  @Expose()
  @Type(() => Accounts)
  accounts?: Accounts;
}
