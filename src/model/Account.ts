import { IUserAccount } from "../interface";
import { AccountId, AccountType, SbifCode } from "../types";

/**
 * Clase que representa una cuenta bancaria utilizada en ciertas operaciones que se necesite un filler.
 */
export class FillerAccount {
  /**
   * Número de la cuenta.
   */
  private readonly number: string;

  /**
   * Código SBIF asociado al banco de la cuenta.
   */
  private readonly sbif_code: SbifCode;

  /**
   * Tipo de cuenta (por ejemplo, Cuenta Corriente o Cuenta Vista).
   */
  private readonly type: AccountType;

  /**
   * Constructor para crear una instancia de FillerAccount.
   * @param number - Número de la cuenta.
   * @param sbif_code - Código SBIF del banco.
   * @param type - Tipo de la cuenta.
   */
  constructor(number: string, sbif_code: SbifCode, type: AccountType) {
    this.number = number;
    this.sbif_code = sbif_code;
    this.type = type;
  }
}

/**
 * Clase que representa una cuenta bancario de un usuario.
 */
export class Account implements IUserAccount {
  /**
   * Identificador único de la cuenta.
   */
  id: string;

  /**
   * Identificador de la institución financiera (por ejemplo, "028").
   */
  owner_id: SbifCode;

  /**
   * Tipo de la cuenta bancaria.
   * Cuenta Corriente: "001"
   * Cuenta Vista: "002"
   */
  type: AccountId;

  /**
   * Identificación tributaria asociada a la cuenta.
   */
  tax_id: string;

  /**
   * Constructor para crear una instancia de Account.
   * @param id - Identificador único de la cuenta.
   * @param owner_id - Identificador del propietario de la cuenta.
   * @param type - Tipo de cuenta.
   * @param tax_id - Identificación tributaria asociada.
   */
  constructor({ id, owner_id, type, tax_id }: IUserAccount) {
    this.id = id;
    this.owner_id = owner_id;
    this.type = type;
    this.tax_id = tax_id;
  }
}
