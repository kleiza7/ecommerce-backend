/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and moderation endpoints
 */

///////////////////////////////////////////////////////////////
// LIST PRODUCTS (APPROVED ONLY)
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/list:
 *   post:
 *     summary: List approved products with pagination, filtering and sorting
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductListRequest'
 *     responses:
 *       200:
 *         description: Product list with pagination and rating statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */

///////////////////////////////////////////////////////////////
// GET PRODUCTS BY SELLER (SELLER ONLY)
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/get-products-by-seller:
 *   get:
 *     summary: Get seller's products (APPROVED + WAITING_FOR_APPROVE + NOT_APPROVED)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductListItem'
 */

///////////////////////////////////////////////////////////////
// GET WAITING APPROVAL PRODUCTS (ADMIN ONLY)
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/get-waiting-approval-products:
 *   get:
 *     summary: Get products waiting for approval (ADMIN only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductListItem'
 */

///////////////////////////////////////////////////////////////
// APPROVE PRODUCT
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/approve/{id}:
 *   put:
 *     summary: Approve a product (ADMIN only)
 *     tags: [Products]
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
 *         description: Product approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

///////////////////////////////////////////////////////////////
// REJECT PRODUCT
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/reject/{id}:
 *   put:
 *     summary: Reject a product (ADMIN only)
 *     tags: [Products]
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
 *         description: Product rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

///////////////////////////////////////////////////////////////
// GET PRODUCT BY ID (PUBLIC)
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/get-by-id/{id}:
 *   get:
 *     summary: Get product detail by ID (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 *       404:
 *         description: Product not found
 */

///////////////////////////////////////////////////////////////
// CREATE PRODUCT
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product (SELLER only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 */

///////////////////////////////////////////////////////////////
// UPDATE PRODUCT
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/update:
 *   put:
 *     summary: Update product (SELLER only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetail'
 */

///////////////////////////////////////////////////////////////
// DELETE PRODUCT
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Soft delete product (SELLER only)
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMAS
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     MessageResponse:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *
 *     ProductListRequest:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         filter:
 *           type: object
 *           properties:
 *             brandIds:
 *               type: array
 *               items: { type: integer }
 *             categoryIds:
 *               type: array
 *               items: { type: integer }
 *             sellerIds:
 *               type: array
 *               items: { type: integer }
 *             query:
 *               type: string
 *         sort:
 *           type: object
 *           properties:
 *             field:
 *               type: string
 *               enum: [id, createdAt, price]
 *               default: id
 *             order:
 *               type: string
 *               enum: [asc, desc]
 *               default: desc
 *
 *     ProductListResponse:
 *       type: object
 *       required: [items, pagination]
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductListItem'
 *         pagination:
 *           type: object
 *           required: [total, page, limit, totalPages]
 *           properties:
 *             total: { type: integer }
 *             page: { type: integer }
 *             limit: { type: integer }
 *             totalPages: { type: integer }
 *
 *     ProductListItem:
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
 *         - avgRating
 *         - reviewCount
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         description: { type: string }
 *         stockCount: { type: integer }
 *         price: { type: number }
 *         status:
 *           type: string
 *           enum: [NOT_APPROVED, WAITING_FOR_APPROVE, APPROVED, DELETED]
 *         avgRating:
 *           type: number
 *           example: 4.3
 *         reviewCount:
 *           type: integer
 *           example: 12
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         currency:
 *           $ref: '#/components/schemas/Currency'
 *         seller:
 *           $ref: '#/components/schemas/SellerBasic'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImageList'
 *
 *     ProductDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductListItem'
 *         - type: object
 *           properties:
 *             seller:
 *               $ref: '#/components/schemas/SellerWithStats'
 *             images:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductImageDetail'
 *
 *     Brand:
 *       type: object
 *       required: [id, name]
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *
 *     Category:
 *       type: object
 *       required: [id, name]
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *
 *     Currency:
 *       type: object
 *       required: [id, code, symbol]
 *       properties:
 *         id: { type: integer }
 *         code: { type: string }
 *         symbol: { type: string }
 *
 *     SellerBasic:
 *       type: object
 *       required: [id, name]
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *
 *     SellerWithStats:
 *       type: object
 *       required: [id, name, totalProductCount, totalReviewCount, avgRating]
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         totalProductCount: { type: integer }
 *         totalReviewCount: { type: integer }
 *         avgRating: { type: number }
 *
 *     ProductImageList:
 *       type: object
 *       required: [id, mediumUrl, isPrimary]
 *       properties:
 *         id: { type: integer }
 *         mediumUrl: { type: string }
 *         isPrimary: { type: boolean }
 *
 *     ProductImageDetail:
 *       type: object
 *       required:
 *         - id
 *         - productId
 *         - originalUrl
 *         - thumbUrl
 *         - mediumUrl
 *         - largeUrl
 *         - isPrimary
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id: { type: integer }
 *         productId: { type: integer }
 *         originalUrl: { type: string }
 *         thumbUrl: { type: string }
 *         mediumUrl: { type: string }
 *         largeUrl: { type: string }
 *         publicId:
 *           type: string
 *           nullable: true
 *         isPrimary: { type: boolean }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductCreateRequest:
 *       type: object
 *       required: [name, description, stockCount, price, brandId, categoryId, currencyId, images]
 *       properties:
 *         name: { type: string }
 *         description: { type: string }
 *         stockCount: { type: integer }
 *         price: { type: number }
 *         brandId: { type: integer }
 *         categoryId: { type: integer }
 *         currencyId: { type: integer }
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *
 *     ProductUpdateRequest:
 *       type: object
 *       required: [id, name, description, stockCount, price, brandId, categoryId, currencyId, deletedImageIds]
 *       properties:
 *         id: { type: integer }
 *         name: { type: string }
 *         description: { type: string }
 *         stockCount: { type: integer }
 *         price: { type: number }
 *         brandId: { type: integer }
 *         categoryId: { type: integer }
 *         currencyId: { type: integer }
 *         deletedImageIds:
 *           type: string
 *         newAddedImages:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 */
