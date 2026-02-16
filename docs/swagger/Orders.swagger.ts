/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User order management endpoints
 */

///////////////////////////////////////////////////////////////
// CREATE ORDER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order from user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, userId, currencyId, status, totalPrice, items, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 currencyId:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   enum: [PENDING, PAID, COMPLETED, CANCELED]
 *                   example: "PENDING"
 *                 totalPrice:
 *                   type: number
 *                   example: 3998
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-02-17T12:34:56.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-02-17T12:34:56.000Z"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, orderId, productId, currencyId, productName, priceSnapshot, quantity, createdAt, product]
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 21
 *                       orderId:
 *                         type: integer
 *                         example: 10
 *                       productId:
 *                         type: integer
 *                         example: 5
 *                       currencyId:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "iPhone 16"
 *                       priceSnapshot:
 *                         type: number
 *                         example: 1999
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-17T12:34:56.000Z"
 *                       product:
 *                         type: object
 *                         required: [id, name, description, stockCount, price, status, brand, category, currency, seller, images]
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: "iPhone 16"
 *                           description:
 *                             type: string
 *                             example: "Flagship phone"
 *                           stockCount:
 *                             type: integer
 *                             example: 23
 *                           price:
 *                             type: number
 *                             example: 1999
 *                           status:
 *                             type: string
 *                             enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *                             example: "APPROVED"
 *                           brand:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               name:
 *                                 type: string
 *                                 example: "Apple"
 *                           category:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 4
 *                               name:
 *                                 type: string
 *                                 example: "Smartphones"
 *                           currency:
 *                             type: object
 *                             required: [id, code, symbol]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               code:
 *                                 type: string
 *                                 example: "USD"
 *                               symbol:
 *                                 type: string
 *                                 example: "$"
 *                           seller:
 *                             type: object
 *                             required: [id, name]
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 3
 *                               name:
 *                                 type: string
 *                                 example: "Sapphire Store"
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required: [id, thumbUrl, isPrimary]
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 10
 *                                 thumbUrl:
 *                                   type: string
 *                                   example: "http://localhost:5000/uploads/products/thumb/iphone.jpg"
 *                                 isPrimary:
 *                                   type: boolean
 *                                   example: true
 *       400:
 *         description: Cart is empty or mixed currency orders are not allowed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       409:
 *         description: Some products are out of stock. Please update your cart.
 */

///////////////////////////////////////////////////////////////
// COMPLETE PAYMENT
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/complete-payment/{id}:
 *   post:
 *     summary: Complete payment for a pending order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Payment completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment completed successfully"
 *             example:
 *               message: "Payment completed successfully"
 *       400:
 *         description: Order is not payable
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *     summary: Cancel a pending order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order canceled successfully"
 *             example:
 *               message: "Order canceled successfully"
 *       400:
 *         description: Only pending orders can be canceled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// GET ORDERS LIST BY USER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/get-orders-list-by-user:
 *   get:
 *     summary: Get all orders of current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// GET ORDER BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/get-by-id/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
