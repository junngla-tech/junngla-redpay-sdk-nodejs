import { RoleActionsEP, RoleActionsER } from "../../interface";
import { RedPayBase } from "./RedPayBase";
import { RedPayEPService } from "./RedPayEPService";
import { RedPayERService } from "./RedPayERService";

/**
 * Servicio combinado para Enroladores Duales (RedPayDual).
 * Combina métodos de `RedPayERService` y `RedPayEPService`.
 */
export class RedPayDualService extends RedPayBase implements RoleActionsER, RoleActionsEP {
  private erService!: RedPayERService;
  private epService!: RedPayEPService;

  // Propiedades de los métodos combinados
  generateToken!: RoleActionsER["generateToken"];
  revokeToken!: RoleActionsER["revokeToken"];
  generateChargeback!: RoleActionsER["generateChargeback"];
  authorizeToken!: RoleActionsEP["authorizeToken"];

  constructor() {
    super();
    this.initializeServices();
    this.initializeMethods();
  }

  /**
   * Inicializa las instancias de los servicios `RedPayERService` y `RedPayEPService`.
   */
  private initializeServices(): void {
    this.erService = new RedPayERService();
    this.epService = new RedPayEPService();
  }

  /**
   * Asigna los métodos de `erService` y `epService` a las propiedades de esta clase.
   */
  private initializeMethods(): void {
    // Métodos de RoleActionsER
    this.generateToken = this.erService.generateToken.bind(this.erService);
    this.revokeToken = this.erService.revokeToken.bind(this.erService);
    this.generateChargeback = this.erService.generateChargeback.bind(this.erService);

    // Métodos de RoleActionsEP
    this.authorizeToken = this.epService.authorizeToken.bind(this.epService);
  }
}
