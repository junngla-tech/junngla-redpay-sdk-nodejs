import * as crypto from "crypto";
import * as jsonabc from "jsonabc";
import { BinaryLike } from "crypto";

/**
 * Interfaz que representa un objeto firmado.
 */
export interface SignedObject {
  signature: string;
  // Keys can be strings, numbers, or symbols.
  // If you know it to be strings only, you can also restrict it to that.
  // For the value you can use any or unknown,
  // with unknown being the more defensive approach.
  [x: string | number | symbol]: unknown;
}

/**
 * Servicio encargado de generar y validar firmas (signature) utilizando HMAC SHA256.
 */
export class RedPayIntegrity {
  /**
   * Genera un hash HMAC SHA256 basado en la entrada y un secreto.
   * @param input - Datos para generar el hash (objeto o string).
   * @param secret - Secreto utilizado para generar el hash.
   * @returns Hash HMAC SHA256 en formato hexadecimal.
   */
  public static readonly hashHmacSha256 = (
    input: object | string,
    secret: crypto.BinaryLike
  ): string => {
    if (typeof input !== "string") {
      input = JSON.stringify(input);
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.setEncoding("hex");
    hmac.write(input);
    hmac.end();

    return hmac.read() as string;
  };

  /**
   * Genera una firma válida para un objeto dado.
   * @param object - Objeto a firmar.
   * @param secret - Secreto utilizado para generar la firma.
   * @returns Firma (signature) del objeto.
   */
  public static readonly generateSignature = (
    object: object,
    secret: BinaryLike
  ): string => {
    // Limpiamos el objeto eliminando atributos `undefined`.
    object = JSON.parse(JSON.stringify(object));

    // Ordenamos los atributos del objeto.
    object = jsonabc.sortObj(object);

    // Concatenamos los valores del objeto (excepto `signature`) en un mensaje.
    let message = "";
    Object.entries(object).forEach(([key, val]) => {
      if (key === "signature") return;
      message += key + JSON.stringify(val);
    });

    // Generamos el hash del mensaje.
    return this.hashHmacSha256(message, secret);
  };

  /**
   * Devuelve un objeto complementado con su firma.
   * @param object - Objeto a firmar.
   * @param secret - Secreto utilizado para generar la firma.
   * @returns Objeto firmado.
   */
  public static readonly getSignedObject = <T>(
    object: T,
    secret: BinaryLike
  ): T & SignedObject => {
    return {
      ...object,
      signature: this.generateSignature(object as object, secret),
    };
  };

  /**
   * Valida una firma comparándola con el `signature` proporcionado en el objeto.
   * @param subject - Objeto que contiene la firma y los datos a validar.
   * @param secret - Secreto utilizado para generar y validar la firma.
   * @returns `true` si la firma es válida, de lo contrario, `false`.
   */
  public static readonly validateSignature = (
    subject: SignedObject,
    secret: string
  ): boolean => {
    const generatedHash = this.generateSignature(subject, secret as BinaryLike);
    return generatedHash === subject.signature;
  };

  /**
   * Valida una firma y lanza una excepción si no es válida.
   * @param subject - Objeto que contiene la firma y los datos a validar.
   * @param secret - Secreto utilizado para generar y validar la firma.
   * @throws Error si la firma no es válida.
   * @returns `void`
   */
  public static readonly validateSignatureOrFail = (
    subject: SignedObject,
    secret: string
  ): void => {
    if (!this.validateSignature(subject, secret)) {
      throw new Error("Invalid signature");
    }
  };
}
