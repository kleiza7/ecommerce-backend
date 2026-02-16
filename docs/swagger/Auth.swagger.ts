/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

///////////////////////////////////////////////////////////////
// GET ALL SELLERS
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/get-all-sellers:
 *   get:
 *     summary: Get all sellers (public)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sellers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required: [id, name]
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   name:
 *                     type: string
 *                     example: "Sapphire Store"
 *             example:
 *               - id: 3
 *                 name: "Sapphire Store"
 *               - id: 7
 *                 name: "Oceanic Shop"
 */

///////////////////////////////////////////////////////////////
// REGISTER USER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered successfully"
 *             example:
 *               message: "Registered successfully"
 *       400:
 *         description: Validation failed or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *             example:
 *               error: "Email already exists"
 */

///////////////////////////////////////////////////////////////
// REGISTER SELLER
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/register-seller:
 *   post:
 *     summary: Register a new seller
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sapphire Store"
 *               email:
 *                 type: string
 *                 example: "seller@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registered successfully"
 *             example:
 *               message: "Registered successfully"
 *       400:
 *         description: Validation failed or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *             example:
 *               error: "Email already exists"
 */

///////////////////////////////////////////////////////////////
// LOGIN
///////////////////////////////////////////////////////////////
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [accessToken, user]
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   required: [id, name, email, role]
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       enum: [USER, SELLER, ADMIN]
 *                       example: "USER"
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: 1
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 role: "USER"
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [error]
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 *             example:
 *               error: "Invalid credentials"
 */
