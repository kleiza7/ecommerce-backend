/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search and suggestion endpoints
 */

///////////////////////////////////////////////////////////////
// GLOBAL SEARCH (BRANDS + CATEGORIES + PRODUCT SUGGESTIONS)
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
 *         schema:
 *           type: string
 *         example: "iph"
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               brands:
 *                 - id: 1
 *                   name: "Apple"
 *                   slug: "apple"
 *               categories:
 *                 - id: 4
 *                   name: "Smartphones"
 *                   slug: "smartphones"
 *               suggestions:
 *                 - "iPhone 15"
 *                 - "iPhone 16 Pro"
 *                 - "iPhone 16"
 *       400:
 *         description: Search query is required
 */
