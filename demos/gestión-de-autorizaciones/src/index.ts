import express, { Request, Response } from "express";
import { RedPayConfigProvider } from "redpay-sdk-nodejs";
import { RedPayAuthorizationManager } from "./redpay-authorize-manager";
import { config } from "./config";
import { Demo } from "./demo";

const app = express();
const PORT = 3000;

// Configuración de middleware
app.use(express.json());

// Configuración inicial de RedPay
RedPayConfigProvider.getInstance().setConfig(config);

// Instancia de redPayAuthorizationManager
const redPayAuthorizationManager = new RedPayAuthorizationManager();

/**
 * Ruta para iniciar una única orden de pago.
 *
 * @route POST /single-order
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
app.post(
  "/single-order",
  async (req: Request, res: Response): Promise<void> => {
    const demo = new Demo();

    try {
      const { collector, payer } = await demo.getUsers();
      const order = await demo.generateOrder(collector.user_id);
      await demo.processPayOrder(order.token.uuid, payer.user_id);

      res.status(200).json({ message: "Orden de pago generada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al generar la orden de pago" });
    }
  }
);

/**
 * Ruta para iniciar múltiples órdenes de pago.
 *
 * @route POST /multiple-orders
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
app.post(
  "/multiple-orders",
  async (req: Request, res: Response): Promise<void> => {
    const demo = new Demo();

    try {
      const { collector, payer } = await demo.getUsers();

      // Generar múltiples órdenes
      const orders = await Promise.all(
        Array.from({ length: 5 }, async () =>
          demo.generateOrder(collector.user_id)
        )
      );

      // Procesar órdenes
      await Promise.all(
        orders.map((order) =>
          demo.processPayOrder(order.token.uuid, payer.user_id)
        )
      );

      res
        .status(200)
        .json({ message: "Órdenes de pago generadas correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al generar las órdenes de pago" });
    }
  }
);

/**
 * Ruta para recibir y procesar el webhook.
 *
 * @route POST /webhook
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
app.post("/webhook/pre-authorize", async (req: Request, res: Response): Promise<void> => {

  try {
    /**
     * 1. Procesar el webhook recibido.
     * La función `processWebhookPreAuthorize` se encarga de procesar el webhook y ejecutar un evento según el tipo de webhook recibido.
     * `onPreAuthorizeEvent` se ejecuta cuando se recibe un webhook de pre-autorización con las validaciones ya realizadas.
     * `onInfoEvent` se ejecuta cuando se recibe un webhook informativo.
     */
    await redPayAuthorizationManager.processWebhookPreAuthorize(req.body);

    /**
     * 2. Inicia el proceso para obtener las órdenes de pago pendientes de autorización.
     * La función `pendingAuthorizeOrders` se encarga de obtener las órdenes de pago pendientes de autorización.
     * Si existen órdenes pendientes, se ejecuta el proceso de autorización.
     * Se detiene el proceso de autorización cuando no existen órdenes pendientes.
     * La función `onSuccess` se ejecuta cuando una orden de pago es autorizada correctamente.
     * La función `onError` se ejecuta cuando una orden de pago no es autorizada.
     */
    redPayAuthorizationManager.start();

    res.status(200).json({ message: "Webhook procesado correctamente" });
  } catch (error) {
    redPayAuthorizationManager.stop();
    res.status(500).json({ message: "Error al procesar el webhook" });
  }
});

/**
 * Inicia el servidor y escucha en el puerto especificado.
 */
app.listen(PORT, () => {
  // console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
