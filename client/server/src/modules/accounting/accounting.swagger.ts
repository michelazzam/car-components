/**
 * @swagger
 * tags:
 *   name: Accounting
 *   description: Accounting management
 */

/**
 * @swagger
 * /api/v1/accounting/usdRate:
 *   get:
 *     summary: Get USD Rate
 *     tags: [Accounting]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usdDate:
 *                   type: number
 *                   description: The USD rate value
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/accounting/usdRate:
 *   put:
 *     summary: Update USD Rate (admin only)
 *     tags: [Accounting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usdRate:
 *                 type: number
 *                 description: The new USD rate
 *             required:
 *               - usdRate
 *     responses:
 *       200:
 *         description: USD Rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
