/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /api/v1/invoices:
 *   get:
 *     summary: Get all orders
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering orders by table
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *         description: Number of invoices to return per page
 *       - in: query
 *         name: nextCursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: paginationType
 *         schema:
 *           type: string
 *           enum: [paged, cursor]
 *         description: Type of pagination to use
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filter invoices by customer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering invoices
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering invoices
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *         description: Page index for paged pagination
 *       - in: query
 *         name: isPaid
 *         schema:
 *           type: boolean
 *           enum: [true, false]
 *         description: Filter invoices by isPaid
 *       - in: query
 *         name: vehicleId
 *         schema:
 *           type: string
 *         description: Filter invoices by vehicleId
 *     responses:
 *       200:
 *         description: invoices retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invoices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       invoiceNumber:
 *                         type: number
 *                       driverName:
 *                         type: string
 *                       generalNote:
 *                         type: number
 *                       customerNote:
 *                         type: number
 *                       discount:
 *                         type: object
 *                         properties:
 *                           amount:
 *                             type: number
 *                           type:
 *                             type: string
 *                       isPaid:
 *                         type: boolean
 *                       customer:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicleNb:
 *                             type: string
 *                           model:
 *                             type: string
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 price:
 *                                   type: number
 *                             quantity:
 *                               type: number
 *                       totalPriceUsd:
 *                         type: number
 *                       amountPaidUsd:
 *                         type: number
 *                       amountPaidLbp:
 *                         type: number
 *                       taxesLbp:
 *                         type: number
 *                       finalPriceUsd:
 *                         type: number
 *                       remainingAmountUsd:
 *                         type: number
 *                       totalPaidUsd:
 *                         type: number
 *                       usdRate:
 *                         type: number
 *                       createdBy:
 *                         type: object
 *                         properties:
 *                           fullName:
 *                             type: string
 *                           username:
 *                             type: string
 *                       services:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             quantity:
 *                               type: number
 *                             price:
 *                               type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pageSize:
 *                   type: number
 *                 totalCount:
 *                   type: number
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                 pageIndex:
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
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/v1/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverName:
 *                 type: string
 *               discount:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *               amountPaidUsd:
 *                 type: number
 *               amountPaidLbp:
 *                 type: number
 *               customerId:
 *                 type: string
 *               isPaid:
 *                 type: boolean
 *               vehicleId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               generalNote:
 *                 type: string
 *               customerNote:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /api/v1/invoices/{invoiceId}:
 *   put:
 *     summary: Edit an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverName:
 *                 type: string
 *               discount:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *               amountPaidUsd:
 *                 type: number
 *               amountPaidLbp:
 *                 type: number
 *               customerId:
 *                 type: string
 *               isPaid:
 *                 type: boolean
 *               vehicleId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               generalNote:
 *                 type: string
 *               customerNote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 * /api/v1/invoices/{invoiceId}:
 *   delete:
 *     summary: Delete an invoices
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
