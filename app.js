import express from 'express';
import { json } from 'body-parser';
import receiptsRouter from './routes/receiptsRouter';

const app = express();
app.use(json());

app.use('/receipts', receiptsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
