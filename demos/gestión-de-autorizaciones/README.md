# README: demo-gestión-autorizaciones

## Índice
1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Inicial](#configuración-inicial)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Uso del Proyecto](#uso-del-proyecto)
    - [Configuración de RedPayConfig](#configuración-de-redpayconfig)
    - [Endpoints Disponibles](#endpoints-disponibles)
6. [Ejecución del Proyecto](#ejecución-del-proyecto)
7. [Consideraciones Adicionales](#consideraciones-adicionales)
8. [Documentación](#documentación)
9. [API](#api)

## Introducción
El proyecto **demo-gestión-autorizaciones** es una implementación de referencia que utiliza el SDK de RedPay para realizar operaciones de gestión de autorizaciones, incluyendo pre-autorizaciones y eventos informativos.

Este proyecto proporciona un servidor Express que expone endpoints para gestionar órdenes de pago y procesar webhooks.

---

## Requisitos Previos
1. Node.js (v14 o superior).
2. NPM o Yarn.
3. Acceso a su integración creada en el Portal developer de RedPay para obtener las credenciales necesarias.

---

## Configuración Inicial

Antes de ejecutar el proyecto, asegúrese de configurar correctamente los parámetros de RedPayConfig. A continuación se describe cómo hacerlo:

### Configuración de RedPayConfig

Cree un archivo `config.ts` y configure los parámetros requeridos:

```typescript
import {
  Account,
  AccountAuthorization,
  Accounts,
  Bank,
  Certificate,
  Enroller,
  RedPayConfig,
  RedPayEnvironment,
  Secrets,
} from "redpay-sdk-nodejs";

const certificates = new Certificate({
  key_path: "<path_to_key>",
  cert_path: "<path_to_cert>",
});

const secrets = new Secrets({
  integrity: "<secret_integrity>",
  authorize: "<secret_authorization>",
  chargeback: "<secret_chargeback>",
  chargeback_automatic: "<secret_chargeback_automatic>",
});

const accounts = new Accounts({
  authorize: new Account({
    id: "<id_authorize>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
  chargeback: new Account({
    id: "<id_chargeback>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
  chargeback_automatic: new Account({
    id: "<id_chargeback_automatic>",
    number: 12345678,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
});

export const config = new RedPayConfig({
  type: Enroller.DUAL, // Rol de su integración
  certificates,
  environment: RedPayEnvironment.Integration,
  secrets,
  accounts,
});
```

Los valores como `key_path`, `cert_path`, secretos y configuración de `Accounts` deben obtenerse desde el portal developer de RedPay.

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
project-root/
├── src/
│   ├── config.ts                       # Configuración de RedPayConfig
│   ├── demo.ts                         # Clase Demo para gestionar órdenes y usuarios
│   ├── redpay-manager.ts               # Clase para manejar eventos de autorización
│   ├── index.ts                        # Servidor Express con los endpoints
│   ├── utils/
│   │    └── file.ts                    # Utilidades para manejo de archivos JSON
│   ├──json/
│   │    ├── orders/                    # Almacenamiento de órdenes de pago
│   │    ├── pre_authorization_event/   # Almacenamiento de eventos de autorización
│   │    ├── onSuccess/                 # Almacenamiento de eventos de autorización exitosos
│   │    └── onError/                   # Almacenamiento de eventos de autorización con error
└── package.json                        # Configuración del proyecto y dependencias
```

---

## Uso del Proyecto

### Configuración de RedPayConfig

1. Modifique el archivo `config.ts` con las credenciales y configuraciones de su entorno.
2. Asegúrese de que las rutas a las claves y certificados sean accesibles desde el entorno de ejecución.

### Endpoints Disponibles

#### 1. Crear una órden de pago
- **Endpoint**: `POST /single-order`
- **Descripción**: Crea una órden de pago y la procesa inmediatamente.
- **Respuesta**:
  ```json
  {
    "message": "Orden de pago generada correctamente"
  }
  ```

#### 2. Crear múltiples órdenes de pago
- **Endpoint**: `POST /multiple-orders`
- **Descripción**: Crea y procesa cinco órdenes de pago simultáneamente.
- **Respuesta**:
  ```json
  {
    "message": "Órdenes de pago generadas correctamente"
  }
  ```

#### 3. Procesar Webhook
- **Endpoint**: `POST /webhook`
- **Descripción**: Procesa un webhook recibido y ejecuta las acciones necesarias para pre-autorización o eventos informativos.
- **Respuesta**:
  ```json
  {
    "message": "Webhook procesado correctamente"
  }
  ```

---

## Ejecución del Proyecto

1. Instale las dependencias necesarias:
   ```bash
   npm install
   ```

2. Inicie el servidor:
   ```bash
   npm run start
   ```

3. El servidor estará disponible en:
   ```
   http://localhost:3000
   ```

---

## Consideraciones Adicionales

- **Logs**: Asegúrese de revisar los logs generados en la consola para depurar errores y confirmar el flujo del sistema.
- **Almacenamiento Local**: Este proyecto utiliza almacenamiento local basado en JSON para gestionar las órdenes y eventos como ejemplo.

---

Este README cubre todos los pasos necesarios para configurar, ejecutar y utilizar el proyecto **demo-gestión-autorizaciones**. Si tiene preguntas adicionales, no dude en contactar con el soporte de RedPay `soporteqri@junngla.com` o consultar la documentación oficial.

# Documentación

Visita nuestra documentación oficial: https://developers.redpay.cl/site/documentation/context

# API

Visita nuestra API oficial: https://developers.redpay.cl/site/reference-api/redpay/api-qri-v2