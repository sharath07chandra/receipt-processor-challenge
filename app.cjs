const express = require('express');
const { json } = require('body-parser');
const receiptsRouter = require('./routes/receiptsRouter.cjs');
const { logError, logInfo } = require('./logger/logger.cjs');

const app = express();
app.use(json());

app.use('/receipts', receiptsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}`);
});
