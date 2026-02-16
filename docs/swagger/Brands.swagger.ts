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
 *         description: List of all brands
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "Apple"
 *                 slug: "apple"
 *               - id: 2
 *                 name: "Samsung"
 *                 slug: "samsung"
 */

///////////////////////////////////////////////////////////////
// GET BRAND BY ID
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/brands/get-by-id/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Brand found
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "Apple"
 *               slug: "apple"
 *       404:
 *         description: Brand not found
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Samsung"
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               name: "Samsung"
 *               slug: "samsung"
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
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               name:
 *                 type: string
 *                 example: "Xiaomi Updated"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               name: "Xiaomi Updated"
 *               slug: "xiaomi-updated"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Brand not found
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
 *         example: 5
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Brand deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Requires ADMIN role)
 *       404:
 *         description: Brand not found
 */
