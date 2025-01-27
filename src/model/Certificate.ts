import { ICertificates } from "../interface";
import { ClassBase } from "./ClassBase";

/**
 * Representa los certificados mTLS necesarios para la comunicación con los servicios de RedPay.
 * Extiende la clase genérica `ClassBase` y cumple con la interfaz `ICertificates`.
 */
export class Certificate
  extends ClassBase<Certificate>
  implements ICertificates
{
  /**
   * Ruta al archivo del certificado (archivo `.crt`).
   * @type {string}
   */
  cert_path!: string;

  /**
   * Ruta al archivo de la clave privada asociada al certificado (archivo `.key`).
   * @type {string}
   */
  key_path!: string;

  /**
   * Indica si se debe verificar la conexión SSL al utilizar el certificado.
   * Valor por defecto: `true`.
   * @type {boolean}
   */
  verify_SSL?: boolean = true;
}
