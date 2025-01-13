import { ICertificates } from "../interface";
import { ClassBase } from "./ClassBase";

export class Certificate
  extends ClassBase<Certificate>
  implements ICertificates
{
  cert_path!: string;

  key_path!: string;

  verify_SSL?: boolean;
}
