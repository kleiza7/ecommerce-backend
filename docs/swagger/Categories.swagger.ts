/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: "Laptops"
 *         slug:
 *           type: string
 *           example: "laptops"
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         description:
 *           type: string
 *           nullable: true
 *           example: "All modern laptop models"
 *         displayOrder:
 *           type: integer
 *           example: 1
 *
 *     CreateCategoryInput:
 *       type: object
 *       required: [name, displayOrder]
 *       properties:
 *         name:
 *           type: string
 *           example: "Smartphones"
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Mobile phones and accessories"
 *         displayOrder:
 *           type: integer
 *           example: 2
 *
 *     UpdateCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Updated Category"
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Updated description"
 *         displayOrder:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/categories/get-all:
 *   get:
 *     summary: Get all categories (public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/get-by-id/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/categories/get-children/{id}:
 *   get:
 *     summary: Get children of a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Parent category ID
 *     responses:
 *       200:
 *         description: Child categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category (SELLER only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid parent ID or validation error
 */

/**
 * @swagger
 * /api/categories/update/{id}:
 *   put:
 *     summary: Update an existing category (SELLER only)
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Parent category invalid or cannot set itself as parent
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/categories/delete/{id}:
 *   delete:
 *     summary: Delete a category (SELLER only)
 *     tags: [Categories]
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
 *         description: Category deleted successfully
 *       400:
 *         description: Category has children and cannot be deleted
 *       404:
 *         description: Category not found
 */
