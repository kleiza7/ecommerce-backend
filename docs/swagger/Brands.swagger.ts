/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management endpoints
 */

///////////////////////////////////////////////////////////////
// GET ALL BRANDS
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/get-all:
 *   get:
 *     summary: Get all brands (public)
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brands retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, name, slug]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Apple"
 *                   slug:
 *                     type: string
 *                     example: "apple"
 */

///////////////////////////////////////////////////////////////
// GET BRAND BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/get-by-id/{id}:
 *   get:
 *     summary: Get brand by ID (public)
 *     tags: [Brands]
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
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, slug]
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Apple"
 *                 slug:
 *                   type: string
 *                   example: "apple"
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brand not found"
 */

///////////////////////////////////////////////////////////////
// CREATE BRAND (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/create:
 *   post:
 *     summary: Create a new brand (ADMIN only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: "Samsung"
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, slug]
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "Samsung"
 *                 slug:
 *                   type: string
 *                   example: "samsung"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brand name is required"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// UPDATE BRAND (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/update:
 *   put:
 *     summary: Update a brand (ADMIN only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, name]
 *             properties:
 *               id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 example: "Xiaomi Updated"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, slug]
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "Xiaomi Updated"
 *                 slug:
 *                   type: string
 *                   example: "xiaomi-updated"
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brand not found"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */

///////////////////////////////////////////////////////////////
// DELETE BRAND (ADMIN ONLY)
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/delete/{id}:
 *   delete:
 *     summary: Delete a brand (ADMIN only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 5
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Brand deleted successfully"
 *             example:
 *               message: "Brand deleted successfully"
 *       404:
 *         description: Brand not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brand not found"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 */
