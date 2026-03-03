/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search and product suggestion endpoint
 */

///////////////////////////////////////////////////////////////
// SEARCH
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search brands, categories and product name suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Search keyword (minimum 1 character)
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "iph"
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Search query is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

///////////////////////////////////////////////////////////////
// COMPONENT SCHEMAS
///////////////////////////////////////////////////////////////

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     SearchResponse:
 *       type: object
 *       required: [brands, categories, suggestions]
 *       properties:
 *         brands:
 *           type: array
 *           description: Matching brands
 *           items:
 *             $ref: '#/components/schemas/SearchBrand'
 *         categories:
 *           type: array
 *           description: Matching categories
 *           items:
 *             $ref: '#/components/schemas/SearchCategory'
 *         suggestions:
 *           type: array
 *           description: Product name suggestions (max 7 unique results)
 *           items:
 *             type: string
 *           example:
 *             - "iPhone 15"
 *             - "iPhone 16"
 *             - "iPhone 16 Pro"
 *
 *     SearchBrand:
 *       type: object
 *       required: [id, name, slug]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Apple"
 *         slug:
 *           type: string
 *           example: "apple"
 *
 *     SearchCategory:
 *       type: object
 *       required: [id, name, slug]
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         name:
 *           type: string
 *           example: "Smartphones"
 *         slug:
 *           type: string
 *           example: "smartphones"
 *
 *     ErrorResponse:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: "Search query is required"
 */
