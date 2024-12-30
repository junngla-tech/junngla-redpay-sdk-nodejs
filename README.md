# RedPay SDK NodeJS

RedPay SDK NodeJS es una biblioteca diseñada para facilitar la integración con los servicios de RedPay en aplicaciones basadas en Node.js. Proporciona herramientas completas para la gestión de usuarios, generación y validación de tokens, y control de integridad en todas las interacciones con los servicios de RedPay.

# Tabla de Contenidos

1. [Instalación](#instalación)
2. [Configuración inicial](#configuración-inicial)
3. [RedPayClient: Gestión de Peticiones HTTP](#redpayclient-gestión-de-peticiones-http)
4. [Servicios Disponibles](#servicios-disponibles)
    - [RedPayERService (Enrolador Recaudador)](#redpayer-service-enrolador-recaudador)
    - [RedPayEPService (Enrolador Pagador)](#redpayep-service-enrolador-pagador)
5. [Gestión de Tokens](#gestión-de-tokens)
6. [Fillers](#fillers)
7. [Control de integridad](#control-de-integridad)
    - [generateSignature(input: object, secret: string): string](#generatesignatureinput-object-secret-string-string)
    - [validateSignature(input: object, secret: string): boolean](#validatesignatureinput-object-secret-string-boolean)
    - [getSignedObject(input: object, secret: string): object](#getsignedobjectinput-object-secret-string-object)

# Instalación

Para instalar la biblioteca, utiliza npm o yarn:

```bash
npm install redpay-sdk-nodejs
# o
yarn add redpay-sdk-nodejs

```

## Configuración inicial

La configuración inicial de la librería es global y se realiza una única vez. Define los parámetros necesarios como certificados, secretos y el entorno de ejecución (producción o integración).

**Ejemplo:**

```typescript
import { RedPayConfigProvider, RedPayEnvironment } from "redpay-sdk-nodejs";

const config = {
  secrets: {
    integrity:
      "90d966f496e3a3831efb5f3f8a01ba5ad8883479c8e62e55d4656471c5f6508b",
    authorize:
      "EDcbe8f8cA1B7Ac5026d9ebBfBeA34A22CfEd7A9b31D315f0f31d76EFDae5dbF",
  },
  environment: RedPayEnvironment.Integration,
  certificates: {
    certPath: "/path/to/certificate.crt",
    keyPath: "/path/to/private.key",
    verifySSL: true,
  },
};

RedPayConfigProvider.setConfig(config);
```

## RedPayClient: Gestión de Peticiones HTTP

El cliente de RedPay es una clase que permite realizar peticiones HTTP a los servicios de RedPay. 

### Características

- Firma Automática: Las peticiones son firmadas automáticamente con el secreto de integridad.
- Validación de Respuestas: Se verifica la firma en las respuestas para evitar manipulaciones.

## Servicios Disponibles

### RedPayERService (Enrolador Recaudador)

Este servicio está diseñado para las integraciones de tipo **Enrolador Recaudador** y ofrece las siguientes funcionalidades:

#### Métodos generales:

- `createUser`: Crear un usuario recolector.
- `updateUser`: Actualizar información de un usuario recolector.
- `verifyUser`: Verificar la información de un usuario recolector.

#### Métodos específicos:

- `generateToken`: Crear un token para operaciones.
- `validateToken`: Validar los detalles de un token (opcional).
- `revokeToken`: Revocar un token existente.
- `chargeback`: Realizar un contra cargo (devolución).
- `validateAuthorization`: Validar autorización de una trasacción.

**Ejemplo de Implementación:**

```typescript
import {
  RedPayERService,
  UserCollector,
  ScheduleMode,
} from "redpay-sdk-nodejs";


const erService = new RedPayERService();

const collector = {
  account: {
    id: "22222222",
    owner_id: "BANCO_BICE",
    type: "001",
    tax_id: "76222222-1",
  },
  email: "collector@example.com",
  enroller_user_id: "123456789",
  name: "Empresa ABC",
  geo: { lat: "1.234", lng: "1.234" },
  gloss: "Gloss",
  tax_address: "Tax Address",
  settlement: {
    schedule: { mode: ScheduleMode.DAYS_OF_WEEK, value: [1, 2, 3, 4, 5] },
  },
};

const userCreated = await erService.createUser(UserCollector, collector);
```

### RedPayEPService (Enrolador Pagador)

Este servicio está diseñado para las integraciones de tipo **Enrolador Pagador** y ofrece las siguientes funcionalidades:

#### Métodos generales:

- `createUser`: Crear un usuario pagador.
- `updateUser`: Actualizar información de un usuario pagador.
- `verifyUser`: Verificar la información de un usuario pagador.

#### Métodos específicos:

- `validateToken`: Validar los detalles de un token.
- `authorizeToken`: Autorizar una transacción.
- `validateAuthorization`: Validar autorización de una trasacción.

**Ejemplo de Implementación:**

```typescript
import {
  RedPayEPService,
  UserPayer,
  Bank,
  AccountUser,
} from "redpay-sdk-nodejs";

const epService = new RedPayEPService();

const payer = {
  account: {
    id: "33333333",
    owner_id: Bank.BANCO_BICE,
    type: AccountUser.CUENTA_CORRIENTE,
    tax_id: "12345678-9",
  },
  email: "example@domain.com",
  enroller_user_id: "987654321",
  name: "Example Payer",
  geo: { lat: "1.234", lng: "1.234" }, // Opcional
};

const userCreated = await epService.createUser(UserPayer, payer);
```

## Gestión de Tokens

Los tokens son componentes esenciales para las operaciones en RedPay. La librería permite manejar diversos tipos de tokens (T0, T1, T2, T3, T4), cada uno con características específicas.

### Tipos de Tokens

- T0: Token de transacción.
- T1: Token de suscripción.
- T2: Token de cobro de suscripción.
- T3: Token de envío de dinero.
- T4: Token de transacción con un alias.
- T6: Token del portal de recargas.

**Ejemplo de Implementación:**

```typescript
import { RedPayERService, TokenT0, TokenType } from "redpay-sdk-nodejs";

const erService = new RedPayERService();

const tokenPayload = {
  enroller_user_id: "123456789",
  data: {
    amount: 5000,
  },
  detail: "Compra en línea",
  extra_data: '{"OrderID": "12345"}',
  lifetime: 300,
  reusability: 1,
  token_type: TokenType.T0,
};

const tokenCreated = await erService.generateToken(TokenT0, tokenPayload);
```

## Fillers

Los Fillers son objetos utilizados para garantizar la integridad en operaciones críticas dentro de los servicios de RedPay. Están diseñados para incluir información relevante de la cuenta y generar una firma basada en el modo de operación.

#### Modos Disponibles
- FillerMode.Authorize: Usado para autorizaciones `Enrolador Pagador`.
- FillerMode.Chargeback: Usado para devoluciones manuales `Enrolador Recaudador`.
- FillerMode.ChargebackAutomatic: Usado para devoluciones automáticas `Enrolador Recaudador`.


**Ejemplo de Implementación:**

```typescript
import { Filler, FillerAccount, FillerMode, Bank } from "redpay-sdk-nodejs";

const fillerAccount = new FillerAccount("123456789", Bank.BANCO_BICE, "CORRIENTE");
const filler = new Filler("id_filler", fillerAccount, FillerMode.Authorize);

console.log(filler);
/*
Output:
{
  id: "id_filler",
  account: { number: "123456789", sbif_code: "028", type: "CORRIENTE" },
  timestamp: 1672531200000,
  signature: "generated-signature",
}
*/

```

## Control de integridad

Esté set de funciones permiten controlar la integridad de los datos enviados o recibidos en servicios de RedPay.

### generateSignature(input: object, secret: string): string

Permite generar la firma de un objeto.

Parámetros de entrada entrada:

- input: el objeto para el cual desean generar una firma
- secret: el secreto a utilizar para firmar el objeto

Valor de retorno:

- La firma, string de 64 caracteres correspondiente al objeto de entrada

**Ejemplo:**

```typescript
import { generateSignature } from "redpay-sdk-nodejs";

const signature = generateSignature(
  {
    hello: "world",
  },
  "f441bb4d-9cd3-410a-8ede-cefd33cf3fa0"
);

console.log(signature);
// output: ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa
```

### validateSignature(input: object, secret: string): boolean

Permite validar la firma de un objeto.

Parámetros de entrada entrada:

- input: el objeto para el cual desea validar la firma
- secret: el secreto a utilizar para firmar el objeto

Valor de retorno:

- Un booleano correspondiente a la validez del signature

**Ejemplo:**

```typescript
import { validateSignature } from "redpay-sdk-nodejs";

const isSignatureValid = validateSignature(
  {
    hello: "world",
    signature:
      "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa",
  },
  "f441bb4d-9cd3-410a-8ede-cefd33cf3fa0"
);

console.log(isSignatureValid);
// output: true
```

### getSignedObject(input: object, secret: string): object

Permite generar un objeto firmado.

Parámetros de entrada entrada:

- input: el objeto para el cual desea sumarle la firma
- secret: el secreto a utilizar para firmar el objeto

Valor de retorno:

- Un objeto poblado con el campo `signature` el cual contiene la firma correspondiente

**Ejemplo:**

```typescript
import { getSignedObject } from "redpay-sdk-nodejs";

const signedObject = getSignedObject(
  {
    hello: "world",
    signature:
      "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa",
  },
  "f441bb4d-9cd3-410a-8ede-cefd33cf3fa0"
);

console.log(signedObject);
// output: { "hello": "world", "signature": "ba1cf4f1a0d5659a4c7dd8c70f74788a532c644c65eeb3d46d9e56cdb22eaeaa" }
```
