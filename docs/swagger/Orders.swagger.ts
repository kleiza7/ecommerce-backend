/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: User order management endpoints
 */

///////////////////////////////////////////////////////////////
// CREATE ORDER (USER ONLY)
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
 *               id: 10
 *               userId: 1
 *               currencyId: 1
 *               status: "PENDING"
 *               totalPrice: 3998
 *               items:
 *                 - id: 21
 *                   orderId: 10
 *                   productId: 5
 *                   productName: "iPhone 16"
 *                   priceSnapshot: 1999
 *                   quantity: 2
 *                   currencyId: 1
 *                   product:
 *                     id: 5
 *                     name: "iPhone 16"
 *                     description: "Flagship phone"
 *                     stockCount: 23
 *                     price: 1999
 *                     status: "APPROVED"
 *                     brand:
 *                       id: 1
 *                       name: "Apple"
 *                     category:
 *                       id: 4
 *                       name: "Smartphones"
 *                     currency:
 *                       id: 1
 *                       code: "USD"
 *                       symbol: "$"
 *                     seller:
 *                       id: 3
 *                       name: "Sapphire Store"
 *                     images:
 *                       - id: 10
 *                         thumbUrl: "http://localhost:5000/uploads/products/thumb/iphone.jpg"
 *                         isPrimary: true
 *       400:
 *         description: Cart is empty or mixed currency not allowed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 *       409:
 *         description: Some products are out of stock
 */

///////////////////////////////////////////////////////////////
// COMPLETE PAYMENT (USER ONLY)
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
 *             example:
 *               message: "Payment completed successfully"
 *       400:
 *         description: Order is not payable
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role or order ownership)
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// CANCEL ORDER (USER ONLY)
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
 *             example:
 *               message: "Order canceled successfully"
 *       400:
 *         description: Only pending orders can be canceled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role or order ownership)
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// GET ORDERS LIST BY USER (USER ONLY)
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
 *         description: Orders list retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 10
 *                 userId: 1
 *                 currencyId: 1
 *                 status: "PAID"
 *                 totalPrice: 3998
 *                 items:
 *                   - id: 21
 *                     orderId: 10
 *                     productId: 5
 *                     productName: "iPhone 16"
 *                     priceSnapshot: 1999
 *                     quantity: 2
 *                     currencyId: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role)
 */

///////////////////////////////////////////////////////////////
// GET ORDER BY ID (USER ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/orders/get-by-id/{id}:
 *   get:
 *     summary: Get a specific order by ID
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
 *         content:
 *           application/json:
 *             example:
 *               id: 10
 *               userId: 1
 *               currencyId: 1
 *               status: "PAID"
 *               totalPrice: 3998
 *               items:
 *                 - id: 21
 *                   orderId: 10
 *                   productId: 5
 *                   productName: "iPhone 16"
 *                   priceSnapshot: 1999
 *                   quantity: 2
 *                   currencyId: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires USER role or order ownership)
 *       404:
 *         description: Order not found
 */
