import express from 'express';
const router = express.Router();
import { v4 } from 'uuid';
import calculatePoints from './helpers/calculatePoints.js';
import { body, param, validationResult } from 'express-validator';


// In-memory storage for receipts
const receipts = {};

// Validation middleware for /receipts/process endpoint
const validateReceipt = [
    body('retailer').isString().matches(/^[\w\s\-]+$/),
    body('purchaseDate').isString().isISO8601(),
    body('purchaseTime').isString().matches(/^\d{2}:\d{2}$/),
    body('items').isArray({ min: 1 }),
    body('total').isString().matches(/^\d+\.\d{2}$/),
];

// Process Receipts Endpoint
router.post('/process', validateReceipt, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const receipt = req.body;
    const id = v4();
    const points = calculatePoints(receipt);

    // Store receipt data in memory
    receipts[id] = { receipt, points };

    res.status(200).json({ id });
});

// Validation middleware for /receipts/{id}/points endpoint
const validateIdParam = [
    param('id').isString().matches(/^\S+$/),
];

// Get Points Endpoint
router.get('/:id/points', validateIdParam, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const receiptData = receipts[id];

    if (!receiptData) {
        return res.status(404).json({ error: 'Receipt not found' });
    }

    const { points } = receiptData;
    res.status(200).json({ points });
});

export default router;
