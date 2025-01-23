# RedPay SDK NodeJS

RedPay SDK NodeJS es una biblioteca diseñada para facilitar la integración con los servicios de RedPay en aplicaciones basadas en Node.js. Proporciona herramientas completas para la gestión de usuarios, generación y validación de tokens, y control de integridad en todas las interacciones con los servicios de RedPay.

# Estado del SDK: Versión BETA

El SDK se encuentra actualmente en su versión BETA. Estamos trabajando continuamente para mejorar su funcionalidad y confiabilidad. Valoramos enormemente tus comentarios y sugerencias, ya que son esenciales para optimizar esta herramienta.

Si encuentras algún problema o deseas compartir tus ideas, no dudes en contactarnos a través del correo electrónico: soporteqri@junngla.com. Estamos aquí para ayudarte.

Agradecemos tu confianza y colaboración durante esta etapa de desarrollo.

# Tabla de Contenidos

1. [Instalación](#instalación)
2. [RedPayClient: Gestión de peticiones HTTP](#redpayclient-gestión-de-peticiones-http)
3. [Enrolador recaudador](#enrolador-recaudador)
   - [Configuración inicial](#configuración-inicial)
   - [RedPayService](#redpayservice)
     - [Métodos generales](#métodos-generales)
     - [Métodos específicos](#métodos-específicos)
     - [Gestión de tokens](#gestión-de-tokens)
     - [Validación de token (opcional)](#validación-de-token-opcional)
     - [Validación de autorización](#validación-de-autorización)
     - [Detalles de la devolución](#detalles-de-la-devolución)
     - [Gestión de autorizaciones](#gestión-de-autorizaciones)
       - [Métodos principales](#métodos-principales)
       - [Métodos abstractos](#métodos-abstractos)
4. [Enrolador pagador (billetera digital)](#enrolador-pagador-billetera-digital)
   - [Configuración inicial](#configuración-inicial-1)
   - [RedPayService (Enrolador Pagador)](#redpayservice-enrolador-pagador)
     - [Métodos generales](#métodos-generales-1)
     - [Métodos específicos](#métodos-específicos-1)
     - [Ejemplo de implementación](#ejemplo-de-implementación)
     - [Validación de token](#validación-de-token)
     - [Autorización de transacciones](#autorización-de-transacciones)
     - [Validación de autorización (opcional)](#validación-de-autorización-opcional)
5. [Enrolador dual (Recaudador y Pagador)](#enrolador-dual-recaudador-y-pagador)
   - [Requisitos para implementar un enrolador dual](#requisitos-para-implementar-un-enrolador-dual)
6. [Control de integridad](#control-de-integridad)
   - [IntegrityService](#integrityservice)
     - [Métodos disponibles](#métodos-disponibles)
7. [Colaboración](#colaboración)
   - [Reporte de problemas de seguridad](#reporte-de-problemas-de-seguridad)
8. [Documentación](#documentación)
9. [API](#api)

# Instalación

Para instalar la biblioteca, utiliza npm o yarn:

```bash
npm install redpay-sdk-nodejs
# o
yarn add redpay-sdk-nodejs
```

# RedPayClient: Gestión de peticiones HTTP

El cliente de RedPay es una clase que permite realizar peticiones HTTP a los servicios de RedPay.

## Características

- Firma Automática: Las peticiones son firmadas automáticamente con el secreto de integridad.
- Validación de Respuestas: Se verifica la firma en las respuestas para evitar manipulaciones.

# Enrolador recaudador

## Configuración inicial

La configuración inicial de la librería es global y debe realizarse una única vez. Define los certificados, secretos y parámetros del entorno (producción o integración) necesarios para operar como recolector.

**Ejemplo de configuración:**

```typescript
import {
  RedPayConfigProvider,
  RedPayEnvironment,
  Certificate,
  Secrets,
  Accounts,
  Account,
  Bank,
  AccountAuthorization,
} from "redpay-sdk-nodejs";

// Certificados mTLS
const certificates = new Certificate({
  key_path: "private.key",
  cert_path: "certificate.crt",
});

const secrets = new Secrets({
  integrity: "90d966f496e3a3831ee62e55d4656471c5f6508b",
  chargeback: "4B3C60D59fA9EE7D3dC837Ff18e3d4b7fCcED2fe674",
});

const accounts = new Accounts({
  // Cuenta de devolución (opcional)
  chargeback: new Account({
    id: "demo",
    number: 22222222,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
});

RedPayConfigProvider.getInstance().setConfig({
  type: Enroller.COLLECTOR,
  certificates,
  environment: RedPayEnvironment.Integration,
  secrets,
  accounts,
});
```

## RedPayService

Este servicio ofrece las siguientes funcionalidades para las integraciones de tipo **Enrolador Recaudador**:

### Métodos generales:

- `createUser`: Crear un usuario recolector.
- `updateUser`: Actualizar información de un usuario recolector.
- `verifyUser`: Verificar la información de un usuario recolector.

### Métodos específicos:

- `generateToken`: Crear un token para operaciones.
- `validateToken`: Validar los detalles de un token (opcional).
- `revokeToken`: Revocar un token existente.
- `generateChargeback`: Realizar un contra cargo (devolución).
- `validateAuthorization`: Validar estado final de una transacción.

**Ejemplo de implementación: Generación de usuario (comercio)**

```typescript
import {
  RedPayService,
  UserCollectorRequest,
  UserAccount,
  Bank,
  AccountUser,
  Geo,
  Withdrawal,
} from "redpay-sdk-nodejs";

const userAccount = new UserAccount({
  number: 22222222,
  bank: Bank.BANCO_BICE,
  tax_id: "76222222-1",
  type: AccountUser.CUENTA_CORRIENTE,
});

const geo = new Geo({
  lat: 1.1234,
  lng: 1.1234,
});

const withdrawal = new Withdrawal({
  mode: WithdrawalMode.MONTHLY,
});

const userCollectorRequest = new UserCollectorRequest({
  user_id: "demo",
  email: "example@example.com",
  name: "Comercio de prueba",
  account: userAccount,
  geo: geo,
  tax_address: "Calle de fantasia 123",
  tax_id: "76222222-1",
  gloss: "Comercio de prueba",
  withdrawal: withdrawal,
});

const service = new RedPayService();

try {
  const userCreated = await service.createUser(userCollectorRequest);
} catch (e) {
  console.log("Error al crear el usuario", e);
}
```

#### Withdrawal

El objeto `Withdrawal` se utiliza para definir el modo de retiro de fondos de un usuario recolector que utiliza el Portal de Cartolas. Los modos disponibles son:

- `WithdrawalMode.MONTHLY`: Retiro mensual.
- `WithdrawalMode.WEEKLY`: Retiro quincenal.
- `WithdrawalMode.DAILY`: Retiro diario.
- `WithdrawalMode.MANUAL`: Retiro manual (personalizado).

Para el modo `MANUAL`, se debe definir el campo `settlement` con la frecuencia de retiro deseada.

### Gestión de tokens

Los tokens son componentes esenciales para las operaciones en RedPay. La librería permite manejar diversos tipos de tokens (T0, T1, T2, T3, T4), cada uno con características específicas.

#### Tipos de tokens

- T0: Token de transacción.
- T1: Token de suscripción.
- T2: Token de cobro de suscripción.
- T3: Token de envío de dinero.
- T4: Token de transacción con un alias.

**Ejemplo de implementación: Generación de token**

```typescript
import {
  RedPayService,
  TokenT0Request,
  TokenDataT0
  TokenType,
} from "redpay-sdk-nodejs";

const tokenT0Request = new TokenT0Request({
  user_id: userCollector.user_id,
  data: new TokenDataT0({
    amount: 1000,
  }),
  token_type: TokenType.T0,
  detail: "Token de Prueba",
});

const service = new RedPayService();

try {
  const tokenCreated = await service.generateToken(tokenT0Request);
} catch (e) {
  console.log("Error al crear el token", e);
}
```

**Ejemplo de implementación: Revocación de token**

```typescript
import { RedPayService, RevokeTokenRequest } from "redpay-sdk-nodejs";

const revokeTokenRequest = new RevokeTokenRequest({
  user_id: userCollector.user_id,
  token_uuid: "token_uuid",
});

const service = new RedPayService();

try {
  const tokenRevoked = await service.revokeToken(revokeTokenRequest);
} catch (e) {
  console.log("Error al revocar el token", e);
}
```

**Ejemplo de implementación: Validación de token**

```typescript
import {
  RedPayService,
  ValidateTokenRequest,
  UserType,
} from "redpay-sdk-nodejs";

const validateTokenRequest = new ValidateTokenRequest({
  user_id: userCollector.user_id,
  token_uuid: "token_uuid",
  user_type: UserType.COLLECTOR,
});

const service = new RedPayService();

try {
  const tokenValidated = await service.validateToken(validateTokenRequest);
} catch (e) {
  console.log("Error al validar el token", e);
}
```

### Validación de autorización

El método `validateAuthorization` permite validar el estado final de una autorización de transacción. Dependiendo de la propiedad `status_code` obtenida en la respuesta, se puede determinar si la transacción fue exitosa, fallida o se encuentra en proceso.

**Ejemplo de implementación: Validación de autorización**

```typescript
import {
  RedPayService,
  ValidateAuthorizationCollectorRequest,
  UserType,
} from "redpay-sdk-nodejs";

const validateAuthorizationRequest = new ValidateAuthorizationCollectorRequest({
  user_id: userCollector.user_id,
  authorization_uuid: "authorization_uuid",
  user_type: UserType.COLLECTOR,
});

const service = new RedPayService();

try {
  const authorizationValidated = await service.validateAuthorization(
    validateAuthorizationRequest
  );
} catch (e) {
  console.log("Error al validar una autorización", e);
}
```

### Detalles de la devolución

Para realizar una devolución, se debe definir previamente la cuenta `chargeback` en la configuración inicial de la librería.

Adicionalmente, si desea operar con el modelo devolución automática, se debe definir el `secrets.chargeback_automatic` y la cuenta `account.chargeback_automatic` en la configuración inicial de la librería.

**Ejemplo de implementación: Devolución (opcional)**

```typescript
import { RedPayService, ChargebackRequest } from "redpay-sdk-nodejs";

const chargeback = new ChargebackRequest({
  user_id: userCollector.user_id,,
  amount: 1000, // Monto a devolver (puede ser parcial o total)
  authorization,
});

const service = new RedPayService();

try {
  const chargebackCreated = await service.generateChargeback(chargeback);
} catch (e) {
  console.log("Error al generar devolución", e);
}
```

### Gestión de autorizaciones

La clase abstracta `RedPayAuthorizationManagement` permite procesar webhooks de pre-autorización siguiendo un flujo predefinido y validar las autorizaciónes. Proporciona una estructura base que incluye la validación de la firma (`signature`), la verificación de si el webhook es informativo, el estado de revocación de la orden, la validación de reutilización de órdenes y procesar autorizaciones de ordenes pendientes. Además, genera cuatro tipos de eventos, dos dependiendo de la naturaleza del webhook y dos dependiendo del estado de la autorización:

1. `onInfoEvent`: Disparado cuando se trata de un webhook informativo.
2. `onPreAuthorizeEvent`: Disparado cuando el webhook de pre-autorización es exitoso.
3. `onSuccess`: Disparado cuando el proceso de autorización es exitoso.
4. `onError`: Disparado cuando ocurre un error en el proceso de autorización.

La clase está diseñada para ser extendida por los desarrolladores, quienes deben implementar ciertos métodos abstractos para manejar las órdenes y los eventos específicos de su caso de uso.

#### Métodos principales

1. `processWebhookPreAuthorize`: Procesa el webhook ejecutando una secuencia que incluye:

   - Validación de la firma (`validateSignature`).
   - Obtención de la orden (`getOrder`).
   - Verificación del estado de revocación de la orden (`checkIfOrderIsRevoked`).
   - Validación opcional de reutilización de la orden (`validateOrderReuse`).
   - Ejecución del evento correspondiente: `onPreAuthorizeEvent` o `onInfoEvent`.

2. `start`: Inicia el proceso de validación de autorización, ejecutando un `setInterval` que incluye:

   - Obtención de las autorización de las órdenes pendientes (`processAuthorizeOrders`). Si no hay órdenes pendientes, se detiene el proceso (`stop`).
   - Procesamiento de las autorizaciones pendientes (`processAuthorizeOrder`).
     - Por cada autorización pendiente, se ejecuta el método `validateAuthorization` de RedPayService donde se obtiene el estado final de cada autorización pendiente:
       - Si la autorización es exitosa, se ejecuta el evento `onSuccess`.
       - Si la autorización requiere reintentos, se realizan hasta un maximo de 3 por cada authorización pendiente.
       - Si la autorización falla, se ejecuta el evento `onError`.

3. `stop`: Detiene el proceso de validación de autorización.

#### Métodos abstractos

Estos métodos deben ser implementados por las subclases:

1. Procesamiento de los webhooks:

- `getOrder`: Recupera una orden asociada a un token.
- `countAuthorizationByOrder`: Valida si una orden necesita verificación de reutilización (opcional).
- `onInfoEvent`: Maneja eventos informativos del webhook.
- `onPreAuthorizeEvent`: Maneja eventos de pre-autorización.

2. Procesamiento de las autorizaciones:

- `pendingAuthorizeOrders`: Obtiene las órdenes pendientes de autorización.
- `onSuccess`: Maneja eventos de autorización exitosa.
- `onError`: Maneja eventos de autorización fallida.

**Ejemplo de implementación: Gestión de autorización**

```typescript
import { Order, WebhookPreAuthorization, RedPayAuthorizationManager, AuthorizeOrder } from "redpay-sdk-nodejs";

export class RedPayManagemer extends RedPayAuthorizationManager {

    async getOrder(token_uuid: string): Promise<Order> {
        // <Su lógica para obtener la orden>
        return new Order({
            token_uuid: token_uuid,
            user_id: userCollector.user_id,
            reusability: 1, // Cantidad de veces que la orden puede recibir autorizaciones.
            revoked_at: null, // Indica si la orden fue revocada con la fecha de revocación.
        });
    }

    async onPreAuthorizeEvent(webhook: WebhookPreAuthorization, order: Order): Promise<void> {
        console.log("Pre-autorización procesada");
        // <Su lógica para manejar la pre-autorización>
    }

    async onInfoEvent(webhook: WebhookPreAuthorization): Promise<void> {
        console.log("Evento informativo recibido");
        // <Su lógica para manejar el evento informativo>
    }

    async countAuthorizationByOrder(token_uuid: Order): number { // Opcional
        // <Su lógica para obtener las autorizaciones realizadas de una orden>
        return <su número de autorizaciones realizadas>;
    }

    async pendingAuthorizeOrders(): Promise<AuthorizeOrder[]> {
        // <Su lógica para obtener las órdenes pendientes>

        // Cada autorización debe tener un objecto `AuthorizeOrder` con los siguientes campos:
        // - token_uuid: string
        // - authorization_uuid: string
        // - user_id: string
        // - is_confirmed: false

        // Debe retornar un array de `AuthorizeOrder` con las órdenes pendientes de autorización.
        return [];
    }

     async onSuccess(authorizeOrder: AuthorizeOrder, status_code: string): Promise<void> {
        console.log("Orden autorizada exitosamente");
        // <Su lógica para manejar la autorización exitosa,
        // actualizar el estado de la orden `is_confirmed: true`
        // y `status_code: status_code` (00-000)
     }

    async onError(authorizeOrder: AuthorizeOrder, status_code: string): Promise<void> {
        console.log("Error al autorizar la orden");
        // <Su lógica para manejar la autorización fallida,
        // actualizar el estado de la orden `is_confirmed: true`
        // y `status_code: status_code` (código distinto de 00-000)
    }
}
```

# Enrolador pagador (Billetera Digital)

## Configuración inicial

a configuración inicial de la librería es global y debe realizarse una única vez. Define los certificados, secretos y parámetros del entorno (producción o integración) necesarios para operar como pagador (billetera digital).

**Ejemplo de implementación: Configuración inicial**

```typescript
import {
  RedPayConfigProvider,
  RedPayEnvironment,
  Certificate,
  Secrets,
  Accounts,
  Account,
  Bank,
  AccountAuthorization,
} from "redpay-sdk-nodejs";

// Certificados mTLS
const certificates = new Certificate({
  key_path: "private.key",
  cert_path: "certificate.crt",
});

const secrets = new Secrets({
  integrity: "90d966f496e3a3831ee62e55d4656471c5f6508b",
  authorize: "4B3C60D59fA9EE7D3dC837Ff18e3d4b7fCcED2fe674",
});

const accounts = new Accounts({
  // Cuenta de autorización
  authorize: new Account({
    id: "demo_ep",
    number: 22222222,
    bank: Bank.BANCO_BICE,
    type: AccountAuthorization.CORRIENTE,
  }),
});

RedPayConfigProvider.getInstance().setConfig({
  type: Enroller.PAYER,
  certificates,
  environment: RedPayEnvironment.Integration,
  secrets,
  accounts,
});
```

## RedPayService (Enrolador Pagador)

Este servicio ofrece las siguientes funcionalidades para las integraciones de tipo **Enrolador Pagador**:

### Métodos generales:

- `createUser`: Crear un usuario pagador.
- `updateUser`: Actualizar información de un usuario pagador.
- `verifyUser`: Verificar la información de un usuario pagador.

### Métodos específicos:

- `validateToken`: Obtener detalles de un token.
- `authorizeToken`: Autorizar una transacción.
- `validateAuthorization`: Validar autorización de una trasacción.

### Ejemplo de implementación

**Ejemplo de implementación: Generación de usuario (pagador)**

```typescript
import {
  RedPayService,
  UserPayerRequest,
  UserAccount,
  Bank,
  AccountUser,
  Geo,
} from "redpay-sdk-nodejs";

const userAccount = new UserAccount({
  id: "demo_ep",
  number: 22222222,
  bank: Bank.BANCO_BICE,
  tax_id: "76222222-1",
  type: AccountUser.CUENTA_CORRIENTE,
});

const geo = new Geo({
  lat: 1.1234,
  lng: 1.1234,
}); // Opcional

const userPayerRequest = new UserPayerRequest({
  email: "example@example.com",
  name: "Pagador de prueba",
  account: userAccount,
  tax_id: "18185630-0",
  geo: geo,
  user_id: "demo_ep", // Identificador único del usuario
});

const service = new RedPayService();

try {
  const userCreated = await service.createUser(userPayerRequest);
} catch (e) {
  console.log("Error al crear el usuario", e);
}
```

### Validación de token

El método `validateToken` permite obtener detalles de un token. Se utiliza para verificar la información de un token antes de realizar una operación de autorización.

**Ejemplo de implementación: Validación de token**

```typescript
import {
  RedPayService,
  ValidateTokenRequest,
  UserType,
} from "redpay-sdk-nodejs";

const validateTokenRequest = new ValidateTokenRequest({
  user_id: userPayer.user_id,
  token_uuid: "token_uuid",
  user_type: UserType.PAYER,
});

const service = new RedPayService();

try {
  const tokenValidated = await service.validateToken(validateTokenRequest);
} catch (e) {
  console.log("Error al validar el token", e);
}
```

### Autorización de transacciones

El método `authorizeToken` permite autorizar una transacción utilizando un token previamente validado.

**Ejemplo de implementación: Autorización de transacciones**

```typescript
import { RedPayService, AuthorizeRequest } from "redpay-sdk-nodejs";

const authorizeRequest = new AuthorizeRequest({
  user_id: userPayer.user_id,
  token_uuid: "token_uuid",
  amount: 1000, // Monto a autorizar (se obtiene desde la validación del token)
  token_type: TokenType.T0, // Tipo de token a autorizar (se obtiene desde la validación del token)
  validation_uuid: "validation_uuid", // Identificador de la validación del token (operation_uuid)
});

const service = new RedPayService();

try {
  const authorizationCreated = await service.authorizeToken(authorizeRequest);
} catch (e) {
  console.log("Error al autorizar la transacción", e);
}
```

### Validación de autorización (opcional)

El método `validateAuthorization` permite validar el estado final de una autorización de transacción. Este método es opcional y se puede utilizar cuando se recibe una autorización fallida (por ejemplo, cuando tienes como respuesta un `TIMEOUT` en la autorización).

Para utilizar este método, debe definir uno o ambos de los siguientes campos: `authorization_uuid` o `validation_uuid`.

**Ejemplo de implementación: Validación de autorización**

```typescript
import {
  RedPayService,
  ValidateAuthorizationPayerRequest,
  UserType,
} from "redpay-sdk-nodejs";

const validateAuthorizationRequest = new ValidateAuthorizationPayerRequest({
  user_id: userPayer.user_id,
  authorization_uuid: "authorization_uuid",
  validation_uuid: "validation_uuid",
  user_type: UserType.PAYER,
});

const service = new RedPayService();

try {
  const authorizationValidated = await service.validateAuthorization(
    validateAuthorizationRequest
  );
} catch (e) {
  console.log("Error al validar la autorización", e);
}
```

# Enrolador dual (Recaudador y Pagador)

El **Enrolador Dual** combina las funcionalidades del Enrolador Recaudador y el Enrolador Pagador, permitiendo gestionar tanto la recolección como el pago de fondos en una misma integración.

## Requisitos para implementar un Enrolador Dual

Un Enrolador Dual debe implementar las capacidades de ambos roles:

1. **Funcionalidades de enrolador recaudador:**

- Gestión de usuarios recolectores, incluyendo creación, actualización y verificación.
- Generación, validación (opcional) y revocación de tokens asociados a la recolección de fondos
- Manejo de devoluciones mediante el método `generateChargeback` (opcional).

2. **Funcionalidades de enrolador pagador:**

- Gestión de usuarios pagadores, incluyendo creación, actualización y verificación.
- Validación y autorización de tokens para el pago de transacciones
- Manejo de devoluciones

# Control de integridad

Además de las funcionalidades de los servicios de RedPay, la librería proporciona un servicio para la generación y validación de firmas en los objetos de las transacciones.

## IntegrityService

El `IntegrityService` incluye los siguientes métodos principales:

### Métodos disponibles:

1. `generateSignature(input: object, secret: string): string`: Genera una firma digital única para un objeto utilizando HMAC SHA256.

**Ejemplo**

```typescript
import { RedPayIntegrity } from "redpay-sdk-nodejs";

const data = { amount: 1000, currency: "CLP" };
const secret = "clave_secreta";
const signature = RedPayIntegrity.generateSignature(data, secret);
```

2. `validateSignature(input: object, secret: string): boolean`: Valida si la firma de un objeto coincide con los datos proporcionados.

**Ejemplo**

```typescript
const isValid = RedPayIntegrity.validateSignature(signedObject, secret);
console.log(isValid); // true o false
```

3. `validateSignatureOrFail(input: object, secret: string): void`: Valida si la firma de un objeto coincide con los datos proporcionados. En caso de que la firma no sea válida, lanza una excepción.

**Ejemplo**

```typescript
RedPayIntegrity.validateSignatureOrFail(signedObject, secret);
```

4. `getSignedObject(input: object, secret: string): object`: Retorna el objeto original acompañado de una firma generada automáticamente.

**Ejemplo**

```typescript
const signedObject = RedPayIntegrity.getSignedObject(data, secret);
console.log(signedObject);
```

# Colaboración
¡Gracias por tu interés en contribuir al desarrollo de RedPay SDK NodeJS! Valoramos enormemente todas las aportaciones constructivas que puedan ayudarnos a mejorar esta herramienta. Hay muchas formas en las que puedes colaborar, como:

- **Reportar errores**: 
Si encuentras un problema o algo no funciona como esperabas, no dudes en reportarlo.
- **Aportar código**: 
Ya sea para corregir errores, implementar nuevas funcionalidades o mejorar las existentes.
- **Mejorar la documentación**: 
Correcciones, aclaraciones o nuevas secciones siempre son bienvenidas.
- **Crear pruebas adicionales**: Ayúdanos a mejorar la cobertura y confiabilidad de nuestras pruebas.
- **Revisar y triage**: Analiza solicitudes de cambios y problemas abiertos para priorizar su atención.

## Reporte de problemas de seguridad
Si descubres una vulnerabilidad de seguridad en RedPay SDK NodeJS, por favor comunícate con `soporteqri@junngla.com` para conocer los pasos a seguir y cómo informarnos de manera responsable.


# Documentación

Visita nuestra documentación oficial: https://developers.redpay.cl/site/documentation/context

# API

Visita nuestra API oficial: https://developers.redpay.cl/site/reference-api/redpay/api-qri-v2
