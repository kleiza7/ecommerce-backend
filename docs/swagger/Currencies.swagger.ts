/**
 * @swagger
 * tags:
 *   name: Currencies
 *   description: Currency management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: "TRY"
 *         symbol:
 *           type: string
 *           example: "₺"
 *
 *     CreateCurrencyInput:
 *       type: object
 *       required: [code, symbol]
 *       properties:
 *         code:
 *           type: string
 *           example: "USD"
 *         symbol:
 *           type: string
 *           example: "$"
 *
 *     UpdateCurrencyInput:
 *       type: object
 *       required: [id, code, symbol]
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         code:
 *           type: string
 *           example: "EUR"
 *         symbol:
 *           type: string
 *           example: "€"
 */

/**
 * @swagger
 * /api/currencies/get-all:
 *   get:
 *     summary: Get all currencies (public)
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: List of all currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 */

/**
 * @swagger
 * /api/currencies/get-by-id/{id}:
 *   get:
 *     summary: Get a currency by ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Currency found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 */

/**
 * @swagger
 * /api/currencies/create:
 *   post:
 *     summary: Create a new currency (SELLER only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCurrencyInput'
 *     responses:
 *       201:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Validation error or duplicate currency
 */

/**
 * @swagger
 * /api/currencies/update:
 *   put:
 *     summary: Update a currency (SELLER only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCurrencyInput'
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 */

/**
 * @swagger
 * /api/currencies/delete/{id}:
 *   delete:
 *     summary: Delete a currency (SELLER only)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *       404:
 *         description: Currency not found
 */
