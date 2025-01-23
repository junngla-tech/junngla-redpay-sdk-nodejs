import {
  AccountUser,
  AuthorizeRequest,
  Bank,
  Geo,
  Order,
  RedPayService,
  TokenDataT0,
  TokenT0Request,
  User,
  UserAccount,
  UserCollectorRequest,
  UserPayerRequest,
  UserType,
  ValidateTokenRequest,
  Withdrawal,
  WithdrawalMode,
} from "redpay-sdk-nodejs";

import * as path from "path";
import { FileUtils } from "./utils/file";

export class Demo {
  private redPayService: RedPayService;
  private dirPath: string;

  constructor() {
    this.redPayService = new RedPayService();
    this.dirPath = path.resolve(__dirname, "./json");
  }

  /**
   * Obtener usuarios de tipos `Collector` y `Payer`.
   *
   * @description
   * Este método es una demostración para obtener o crear usuarios de tipo `Collector` y `Payer` en la plataforma RedPay.
   * En el contexto de este demo, se utilizan datos predefinidos para simular la operación.
   * En una implementación real, los datos deben ser dinámicos y adaptados a las necesidades del sistema.
   *
   * Proceso del demo:
   * 1. Se intentan obtener los usuarios desde el servicio RedPay utilizando solicitudes predefinidas.
   * 2. Si los usuarios no existen, se crean utilizando datos ficticios.
   *
   * **Nota**: Este código no es final y debe ser adaptado para manejar los datos de entrada, validaciones y errores de manera adecuada
   * en el entorno de producción.
   */
  async getUsers(): Promise<{
    collector: User;
    payer: User;
  }> {
    const email = "example@example.com"; // Email ficticio para el demo

    // Simulación de geolocalización
    const geo = new Geo({
      lat: 1.1234,
      lng: 1.1234,
    });

    // Configuración de cuenta bancaria ficticia
    const account = new UserAccount({
      number: 34681774,
      bank: Bank.BANCO_BICE,
      /**
       * Para `PAYER` el RUT debe ser el del enrolador pagador.
       * Para `COLLECTOR` el RUT debe ser del comercio.
       */
      tax_id: "92279892-3", 
      type: AccountUser.CUENTA_CORRIENTE,
    });

    const withdrawal = new Withdrawal({
      mode: WithdrawalMode.MONTHLY,
    });

    // Datos ficticios para el usuario tipo `Collector`
    const userCollectorRequest = new UserCollectorRequest({
      user_id: "demo_recaudador", // ID de usuario ficticio
      email,
      geo,
      name: "Comercio de fantasía", // Nombre ficticio
      account,
      tax_address: "Calle de fantasía 1234", // Dirección ficticia
      tax_id: "92279892-3", // El RUT debe ser el mismo que el de la cuenta.
      gloss: "Comercio de fantasía", // Glosa ficticia
      withdrawal,
    });

    // Datos ficticios para el usuario tipo `Payer`
    const userPayerRequest = new UserPayerRequest({
      user_id: "demo_pagador", // ID de usuario ficticio
      email,
      name: "Pagador de prueba", // Nombre ficticio
      account,
      tax_id: "18185630-0", // RUT ficticio
    });

    try {
      /**
       * Intentar obtener los usuarios de tipo `Collector` y `Payer`.
       *
       * En el demo, se simula que los usuarios ya existen en la plataforma RedPay.
       */
      const [collector, payer] = await Promise.all([
        this.redPayService.getUserOrFail(userCollectorRequest),
        this.redPayService.getUserOrFail(userPayerRequest),
      ]);

      return { collector: collector.user, payer: payer.user };
    } catch (error) {
      /**
       * Si los usuarios no existen, se crean utilizando datos ficticios.
       *
       * **Nota**: En una implementación real, debe manejarse un flujo más robusto para tratar errores
       * y asegurarse de que los datos enviados sean correctos.
       */
      const [collector, payer] = await Promise.all([
        this.redPayService.createUser(userCollectorRequest),
        this.redPayService.createUser(userPayerRequest),
      ]);
      return { collector: collector.user, payer: payer.user };
    }
  }

  /**
   * Generar una orden de pago y guardar en un archivo.
   *
   * @description
   * Este método es una demostración para generar una orden de pago utilizando un token generado por la plataforma RedPay.
   * En este demo, se utilizan datos predefinidos para crear un token y almacenar la orden en un archivo local.
   *
   * Proceso del demo:
   * 1. Se genera un token para el usuario `Collector` utilizando datos ficticios.
   * 2. Se crea una orden de pago basada en la respuesta del token y se guarda en un archivo.
   *
   * **Nota**: Este código debe adaptarse en un entorno real para:
   * - Generar tokens con datos dinámicos basados en entradas reales.
   * - Almacenar las órdenes de manera segura (por ejemplo, en una base de datos).
   */
  async generateOrder(collector_user_id: string) {
    // Configuración del token con datos ficticios para el demo
    const tokenRequest = new TokenT0Request({
      user_id: collector_user_id, // ID del usuario Collector
      data: new TokenDataT0({
        amount: 10000, // Monto ficticio
      }),
      lifetime: 300, // Tiempo de vida del token en segundos
      reusability: 1, // Configuración de reutilización
      detail: "Token de fantasía", // Descripción ficticia
    });

    // Generar token utilizando el servicio RedPay
    const response = await this.redPayService.generateToken(tokenRequest);

    // Nombre del archivo basado en el token UUID generado
    const fileName = response.token.uuid;

    // Crear una orden de pago utilizando los datos del token
    const order = new Order({
      // Datos ficticios basados en la respuesta del token
      token_uuid: response.token.uuid,
      reusability: response.token.reusability,
      user_id: collector_user_id,
      amount: response.token.data?.amount,
    });

    // Guardar la orden en un archivo local
    await FileUtils.writeFile(this.dirPath, "orders", fileName, order);

    // Retornar la respuesta del token (ficticio)
    return response;
  }

  /**
   * Procesar la orden de pago: validar token y autorizar.
   *
   * @description
   * Este método es una demostración para procesar una orden de pago utilizando el flujo de validación y autorización de RedPay.
   *
   * Proceso del demo:
   * 1. Leer la orden de pago desde un archivo local basado en el `token_uuid`.
   * 2. Validar el token asociado al usuario `Payer`.
   * 3. Autorizar el pago utilizando los datos de validación y token.
   *
   * **Nota**: Este código debe ser adaptado para:
   * - Manejar el almacenamiento y acceso de órdenes desde una base de datos o sistema seguro.
   * - Gestionar adecuadamente errores en la validación y autorización.
   * - Obtendra el token_uuid o token_url cuando scanee el QR generado por el collector (comercio).
   */
  async processPayOrder(token_uuid: string, payer_user_id: string) {
    // Leer la orden de pago desde un archivo local
    const order: Order = await FileUtils.readFile(
      this.dirPath,
      "orders",
      token_uuid
    );

    // Configuración para validar el token
    const validateTokenRequest = new ValidateTokenRequest({
      token_uuid, // UUID del token a validar
      user_id: payer_user_id, // ID del usuario Payer
      user_type: UserType.PAYER, // Tipo de usuario (Payer)
    });

    // Validar el token utilizando el servicio RedPay
    const validateTokenResponse = await this.redPayService.validateToken(
      validateTokenRequest
    );

    // Configuración para autorizar el pago
    const authorizeRequest = new AuthorizeRequest({
      amount: order.amount, // Monto de la orden
      token_type: validateTokenResponse.token_type, // Tipo de token validado
      user_id: payer_user_id, // ID del usuario Payer
      token_uuid, // UUID del token
      validation_uuid: validateTokenResponse.operation_uuid, // UUID de validación generado
    });

    // Autorizar el token utilizando el servicio RedPay
    return this.redPayService.authorizeToken(authorizeRequest);
  }
}
