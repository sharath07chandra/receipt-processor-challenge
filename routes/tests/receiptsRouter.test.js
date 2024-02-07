const request = require('supertest');
const express = require('express');
const receiptsRouter = require('../receiptsRouter.cjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use('/receipts', receiptsRouter);

// Variable to store the IDs obtained from the valid receipt response
let receiptIds = [];

describe('POST /receipts/process', () => {
    test('valid request returns 200 and id', async () => {
        const validReceipt = {
            "retailer": "Target",
            "purchaseDate": "2022-01-02",
            "purchaseTime": "13:13",
            "total": "1.25",
            "items": [
                { "shortDescription": "Pepsi - 12-oz", "price": "1.25" }
            ]
        };

        const response = await request(app)
            .post('/receipts/process')
            .send(validReceipt)
            .expect(200);

        // Store the ID obtained from the response
        receiptIds.push(response.body.id);

        expect(response.body).toHaveProperty('id');
    });

    test('another valid request returns 200 and id', async () => {
        const anotherValidReceipt = {
            "retailer": "Walgreens",
            "purchaseDate": "2022-01-02",
            "purchaseTime": "08:13",
            "total": "2.65",
            "items": [
                { "shortDescription": "Pepsi - 12-oz", "price": "1.25" },
                { "shortDescription": "Dasani", "price": "1.40" }
            ]
        };

        const response = await request(app)
            .post('/receipts/process')
            .send(anotherValidReceipt)
            .expect(200);

        receiptIds.push(response.body.id);

        expect(response.body).toHaveProperty('id');
    });

    test('invalid request returns 400 with error message', async () => {
        const invalidReceipt = {};

        const response = await request(app)
            .post('/receipts/process')
            .send(invalidReceipt)
            .expect(400);

        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /receipts/:id/points', () => {
    test('valid ID returns 200 and points', async () => {
        // Check if receiptId is defined (it should be, if the previous test passed)
        expect(receiptIds.length).toBeGreaterThan(0);

        for (const receiptId of receiptIds) {
            const response = await request(app)
                .get(`/receipts/${receiptId}/points`)
                .expect(200);

            expect(response.body).toHaveProperty('points');
        }
    });

    test('invalid ID returns 404 with error message', async () => {
        const invalidId = '123';

        const response = await request(app)
            .get(`/receipts/${invalidId}/points`)
            .expect(404);

        expect(response.body.error).toBe('Receipt not found');
    });
});
