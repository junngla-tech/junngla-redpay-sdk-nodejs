import { Expose } from "class-transformer";
import { ISecrets } from "../interface";
import { ClassBase } from "./ClassBase";

export class Secrets extends ClassBase<Secrets> implements ISecrets {
  @Expose()
  integrity!: string;

  @Expose()
  authorize?: string;

  @Expose()
  chargeback?: string;

  @Expose()
  chargeback_automatic?: string;
}
