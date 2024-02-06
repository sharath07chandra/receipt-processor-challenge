import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import receiptsRouter from './routes/receiptsRouter.js';

const app = express();
app.use(json());

app.use('/receipts', receiptsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
