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
 *         description: List of all currencies
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 code: "USD"
 *                 symbol: "$"
 *               - id: 2
 *                 code: "EUR"
 *                 symbol: "€"
 */

///////////////////////////////////////////////////////////////
// GET CURRENCY BY ID
///////////////////////////////////////////////////////////////
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Currency found
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               code: "USD"
 *               symbol: "$"
 *       404:
 *         description: Currency not found
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
 *             required:
 *               - code
 *               - symbol
 *             properties:
 *               code:
 *                 type: string
 *                 example: "USD"
 *               symbol:
 *                 type: string
 *                 example: "$"
 *     responses:
 *       201:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               code: "GBP"
 *               symbol: "£"
 *       400:
 *         description: Validation error or currency already exists
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
 *             required:
 *               - id
 *               - code
 *               - symbol
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               code:
 *                 type: string
 *                 example: "GBP"
 *               symbol:
 *                 type: string
 *                 example: "£"
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               code: "GBP"
 *               symbol: "£"
 *       400:
 *         description: Validation error or currency code already exists
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
 *         example: 3
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Currency deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Currency not found
 */
