/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: "Apple"
 *         slug:
 *           type: string
 *           example: "apple"
 *
 *     CreateBrandInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: "Samsung"
 *
 *     UpdateBrandInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Xiaomi Updated"
 */

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
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */

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
 *     responses:
 *       200:
 *         description: Brand found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 */

/**
 * @swagger
 * /api/brands/create:
 *   post:
 *     summary: Create a new brand (SELLER only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBrandInput'
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/brands/update/{id}:
 *   put:
 *     summary: Update a brand (SELLER only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBrandInput'
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 */

/**
 * @swagger
 * /api/brands/delete/{id}:
 *   delete:
 *     summary: Delete a brand (SELLER only)
 *     tags: [Brands]
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
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
