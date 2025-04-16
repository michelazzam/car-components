/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports management
 */

/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Get Reports by year for chart
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         description: Start date
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         description: End date
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       date:
 *                         type: string
 *                       totalIncome:
 *                         type: number
 *                       totalExpenses:
 *                         type: number
 *                 totalIncomeUsd:
 *                   type: number
 *                 totalExpensesUsd:
 *                   type: number
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/reports/all:
 *   get:
 *     summary: Get Reports
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         description: Start date
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         description: End date
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageIndex
 *         description: Page index
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       date:
 *                         type: string
 *                       totalIncome:
 *                         type: number
 *                       totalExpenses:
 *                         type: number
 *                 pageIndex:
 *                   type: number
 *                 pageSize:
 *                   type: number
 *                 totalCount:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
