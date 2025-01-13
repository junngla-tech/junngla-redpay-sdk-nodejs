import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL_INTEGRATION, API_URL_PRODUCTION } from "../config/constants";
import { Agent } from "https";
import * as fs from "fs";
import { RedPayConfigProvider } from "../provider";
import { RedPayEnvironment } from "../enum";
import { RedPayIntegrity } from "../services/RedPayIntegrity";
import { IError, IRedPayConfig } from "../interface";

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
    this.config = RedPayConfigProvider.getInstance().getConfig();

    this.httpsAgent = new Agent({
      rejectUnauthorized: this.config.certificates.verify_SSL ?? true,
      cert: fs.readFileSync(this.config.certificates.cert_path),
      key: fs.readFileSync(this.config.certificates.key_path),
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
          config.data = RedPayIntegrity.getSignedObject(
            config.data,
            this.getSecretIntegrity()
          );
        }

        if (config.params) {
          config.params = RedPayIntegrity.getSignedObject(
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
        const signatureIsValid = RedPayIntegrity.validateSignature(
          response.data,
          this.getSecretIntegrity()
        );

        if (!signatureIsValid) {
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
      throw new Error(`Unexpected error occurred during the request: ${error}`);
    }
  }

  /**
   * Realiza una solicitud GET firmada.
   * @param path - Ruta de la solicitud.
   * @param params - Parámetros de la solicitud.
   * @returns Una promesa con la respuesta deserializada o un objeto vacío en caso de error.
   */
  public async get<T>(path: string, params?: object): Promise<T> {
    try {
      return await this.request<T>("get", path, params);
    } catch (error) {
      return {} as T; // Devuelve un objeto vacío en caso de error
    }
  }

  /**
   * Realiza una solicitud GET firmada.
   * @param path - Ruta de la solicitud.
   * @param params - Parámetros de la solicitud.
   * @returns Una promesa con la respuesta deserializada.
   */
  public async getOrFail<T>(path: string, params?: object): Promise<T> {
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
