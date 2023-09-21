import * as crypto from 'crypto';
import * as jsonabc from 'jsonabc';
import { BinaryLike } from 'crypto';

/**
 * @IntegrityService Se encarga de la encriptacion, desencriptacion, generar y validar signature.
 */

/**
 * Funcion que procesa la data dada en sus parametros para generar un signature valido.
 * @param input Este parametro recibe la data que se quiere generar el signature.
 * @param secret Este paraemtro recibe el secreto con el que se quiere generar el signature.
 * @returns
 */
const hashHmacSha256 = (input: object | string, secret: BinaryLike): string => {
  if (typeof input !== 'string') {
    input = JSON.stringify(input);
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.setEncoding('hex');
  hmac.write(input);
  hmac.end();

  return hmac.read() as string;
};

/**
 * Función que genera una firma válida.
 * @param object Este parámetro recibe la data y la procesa para poder finalmente generar el signature con la functión hashHmacSha256.
 * @param secret Este parámetro recibe el secreto con el que se quiere generar el signature.
 * @returns
 */
export const generateSignature = (
  object: object,
  secret: BinaryLike,
): string => {

  // Ordenamos los atributos del objeto
  object = jsonabc.sortObj(object);

  // Preparamos nuestra variable que acumulara el mensaje a hashear
  let message: string = '';

  // Concatenamos cada valor del objeto
  Object.entries(object).map(([key, val]) => {
    if (key === 'signature') { return; }
    message += key + JSON.stringify(val);
  });

  // Hasheamos el mensaje
  return hashHmacSha256(message, secret);
};

/**
 * Devuelve un objeto complementado con su firma
 * @param object Objeto a firmar
 * @param secret Secreto a usar para firmar
 */
export const getSignedObject = <T>(
  object: T,
  secret: BinaryLike,
): T & { signature: string } => {
  return {
    ...object,
    signature: generateSignature(JSON.parse(JSON.stringify(object)), secret),
  };
};

/**
 * Funcion que valida el signature enviado por el cliente, generando (nosotros) un
 * signature con su data y el secreto comparandola con el signature enviado de su parte.
 * @param subject Este parametro recibe la data enviada por el cliente.
 * @param secret Este paraemtro recibe el secreto con el que se quiere generar el signature.
 * @returns
 */
export const validateSignature = (subject: { signature: string }, secret: string) => {
  const hash = generateSignature(subject, secret as BinaryLike);

  return hash === subject.signature;
};
