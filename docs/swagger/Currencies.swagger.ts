/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: Currency management endpoints
 */

///////////////////////////////////////////////////////////////
// GET ALL CURRENCIES
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/currencies/get-all:
 *   get:
 *     summary: Get all currencies (public)
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: Currencies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 */

///////////////////////////////////////////////////////////////
// GET CURRENCY BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/currencies/get-by-id/{id}:
 *   get:
 *     summary: Get currency by ID (public)
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Currency retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Currency not found"
 */

///////////////////////////////////////////////////////////////
// CREATE CURRENCY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/currencies/create:
 *   post:
 *     summary: Create a new currency (ADMIN only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, symbol]
 *             properties:
 *               code:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 example: "EUR"
 *               symbol:
 *                 type: string
 *                 minLength: 1
 *                 example: "€"
 *     responses:
 *       201:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Currency already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// UPDATE CURRENCY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/currencies/update:
 *   put:
 *     summary: Update a currency (ADMIN only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, code, symbol]
 *             properties:
 *               id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               code:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *                 example: "GBP"
 *               symbol:
 *                 type: string
 *                 minLength: 1
 *                 example: "£"
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Currency code already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Currency not found
 */

///////////////////////////////////////////////////////////////
// DELETE CURRENCY (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/currencies/delete/{id}:
 *   delete:
 *     summary: Delete a currency (ADMIN only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 2
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Currency deleted successfully"
 *       404:
 *         description: Currency not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMA
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       required: [id, code, symbol]
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         symbol:
 *           type: string
 */
