import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSignedObject, validateSignature } from "../Integrity.service";
import { IError } from "../interface";
import { IRedPayConfig } from "../interface/RedPayConfig";
import { RedPayEnvironment } from "../enum";
import { API_URL_INTEGRATION, API_URL_PRODUCTION } from "../config/constants";
import { Agent } from "https";
import { RedPayConfigProvider } from "../provider/RedPayConfigProvider";
import * as fs from "fs";

/**
 * Cliente RedPay para realizar solicitudes HTTP firmadas y validar integridad.
 */
export class RedPayClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly httpsAgent: Agent;
  private readonly config: IRedPayConfig;

  /**
   * Inicializa una instancia del cliente RedPay.
   * Configura los certificados, URL base y los interceptores.
   */
  constructor() {
    this.config = RedPayConfigProvider.getConfig();

    this.httpsAgent = new Agent({
      rejectUnauthorized: this.config.certificates.verifySSL ?? true,
      cert: fs.readFileSync(this.config.certificates.certPath),
      key: fs.readFileSync(this.config.certificates.keyPath),
    });

    this.axiosInstance = axios.create({
      baseURL: this.getApiUrl(),
      httpsAgent: this.httpsAgent,
    });

    this.setupInterceptors();
  }

  /**
   * Obtiene la URL base según el entorno configurado.
   * @returns La URL base para las solicitudes.
   */
  private getApiUrl(): string {
    return this.config.environment === RedPayEnvironment.Production
      ? API_URL_PRODUCTION
      : API_URL_INTEGRATION;
  }

  /**
   * Obtiene el secreto de integridad configurado.
   * @returns El secreto de integridad.
   */
  private getSecretIntegrity(): string {
    return this.config.secrets.integrity;
  }

  /**
   * Configura los interceptores de Axios para firmar solicitudes y validar respuestas.
   */
  private setupInterceptors(): void {
    // Interceptor de solicitud: Agregar firma al body o params.
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (config.data) {
          config.data = getSignedObject(config.data, this.getSecretIntegrity());
        }

        if (config.params) {
          config.params = getSignedObject(
            config.params,
            this.getSecretIntegrity()
          );
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de respuesta: Validar firma recibida.
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        const signatureIsValid = validateSignature(
          response.data,
          this.getSecretIntegrity()
        );

        if (!signatureIsValid) {
          // TODO: Verificar si se debe retornar un error específico.
          return Promise.reject({
            message: "Invalid signature",
            signature: response?.data?.signature,
          } as IError);
        }

        return response;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Realiza una solicitud HTTP genérica firmada.
   * @param method - Método HTTP ("get", "post", "put").
   * @param path - Ruta de la solicitud.
   * @param data - Datos para el cuerpo o parámetros de la solicitud.
   * @returns Una promesa con la respuesta deserializada.
   */
  private async request<T>(
    method: "get" | "post" | "put",
    path: string,
    data?: object
  ): Promise<T> {
    try {
      const config = method === "get" ? { params: data } : { data };
      const response = await this.axiosInstance.request<T>({
        method,
        url: path,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          status: error.response.status,
          data: error.response.data,
        };
      }
      throw new Error("Unexpected error occurred during the request.");
    }
  }

  /**
   * Realiza una solicitud GET firmada.
   * @param path - Ruta de la solicitud.
   * @param params - Parámetros de la solicitud.
   * @returns Una promesa con la respuesta deserializada.
   */
  public async get<T>(path: string, params?: object): Promise<T> {
    return this.request<T>("get", path, params);
  }

  /**
   * Realiza una solicitud POST firmada.
   * @param path - Ruta de la solicitud.
   * @param body - Cuerpo de la solicitud.
   * @returns Una promesa con la respuesta deserializada.
   */
  public async post<T>(path: string, body: object): Promise<T> {
    return this.request<T>("post", path, body);
  }

  /**
   * Realiza una solicitud PUT firmada.
   * @param path - Ruta de la solicitud.
   * @param body - Cuerpo de la solicitud.
   * @returns Una promesa con la respuesta deserializada.
   */
  public async put<T>(path: string, body: object): Promise<T> {
    return this.request<T>("put", path, body);
  }
}
