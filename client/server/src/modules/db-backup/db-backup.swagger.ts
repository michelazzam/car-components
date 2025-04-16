/**
 * @swagger
 * tags:
 *   name: DB Backup
 *   description: DB Backup management
 */

/**
 * @swagger
 * /api/v1/db-backup/path:
 *   get:
 *     summary: Get path (super Ams Admin only)
 *     tags: [DB Backup]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
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
 * /api/v1/db-backup/path:
 *   put:
 *     summary: Update path (super Ams Admin only)
 *     tags: [DB Backup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *             required:
 *               - path
 *     responses:
 *       200:
 *         description: path updated successfully
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
 * /api/v1/db-backup/backup:
 *   post:
 *     summary: Trigger a DB backup (admin)
 *     tags: [DB Backup]
 *     responses:
 *       200:
 *         description: DB backed up successfully
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
