/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

///////////////////////////////////////////////////////////////
// CREATE ORDER (FROM CART)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order from user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 15
 *               userId: 4
 *               status: "PENDING"
 *               totalPrice: 2499
 *               createdAt: "2026-01-10T12:30:00.000Z"
 *               items:
 *                 - productId: 3
 *                   productName: "MacBook Pro 14"
 *                   priceSnapshot: 2499
 *                   quantity: 1
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 */

///////////////////////////////////////////////////////////////
// COMPLETE PAYMENT
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/complete-payment/{id}:
 *   post:
 *     summary: Complete payment for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 12
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *       400:
 *         description: Order is not payable
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// CANCEL ORDER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/cancel/{id}:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 18
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Only pending orders can be canceled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// GET USER ORDERS
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/get-orders-list-by-user:
 *   get:
 *     summary: Get all orders of the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User order list
 *         content:
 *           application/json:
 *             example:
 *               - id: 21
 *                 status: "PAID"
 *                 totalPrice: 1299
 *                 createdAt: "2026-01-08T09:45:00.000Z"
 *                 items:
 *                   - productId: 3
 *                     productName: "MacBook Pro 14"
 *                     priceSnapshot: 1299
 *                     quantity: 1
 *               - id: 20
 *                 status: "PENDING"
 *                 totalPrice: 349
 *                 createdAt: "2026-01-07T18:12:00.000Z"
 *                 items:
 *                   - productId: 5
 *                     productName: "Magic Mouse"
 *                     priceSnapshot: 349
 *                     quantity: 1
 *       401:
 *         description: Unauthorized
 */

///////////////////////////////////////////////////////////////
// GET ORDER BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/get-by-id/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 21
 *     responses:
 *       200:
 *         description: Order detail
 *         content:
 *           application/json:
 *             example:
 *               id: 21
 *               status: "PAID"
 *               totalPrice: 1299
 *               createdAt: "2026-01-08T09:45:00.000Z"
 *               items:
 *                 - productId: 3
 *                   productName: "MacBook Pro 14"
 *                   priceSnapshot: 1299
 *                   quantity: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
