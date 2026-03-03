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
 *               $ref: '#/components/schemas/Order'
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
 *           minimum: 1
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
 *           minimum: 1
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
 *                 $ref: '#/components/schemas/Order'
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
 *           minimum: 1
 *         example: 10
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMAS
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - currencyId
 *         - status
 *         - totalPrice
 *         - items
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         currencyId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, COMPLETED, CANCELED]
 *         totalPrice:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *
 *     OrderItem:
 *       type: object
 *       required:
 *         - id
 *         - orderId
 *         - productId
 *         - currencyId
 *         - productName
 *         - priceSnapshot
 *         - quantity
 *         - createdAt
 *         - product
 *       properties:
 *         id:
 *           type: integer
 *         orderId:
 *           type: integer
 *         productId:
 *           type: integer
 *         currencyId:
 *           type: integer
 *         productName:
 *           type: string
 *         priceSnapshot:
 *           type: number
 *         quantity:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         product:
 *           $ref: '#/components/schemas/OrderProduct'
 *
 *     OrderProduct:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - stockCount
 *         - price
 *         - status
 *         - brand
 *         - category
 *         - currency
 *         - seller
 *         - images
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         stockCount:
 *           type: integer
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *         brand:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         category:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         currency:
 *           type: object
 *           required: [id, code, symbol]
 *           properties:
 *             id:
 *               type: integer
 *             code:
 *               type: string
 *             symbol:
 *               type: string
 *         seller:
 *           type: object
 *           required: [id, name]
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             required: [id, thumbUrl, isPrimary]
 *             properties:
 *               id:
 *                 type: integer
 *               thumbUrl:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 */
