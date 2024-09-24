import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import {createDatabase} from './infra/database.js';
import {listenToCqrsMessages} from './infra/event-bus.js';
import {catchErrorsMiddleware} from './middleware/catchErrors.js';
import {getProducts, createProduct, sellProduct, increaseStock} from './availability/index.js';
import {createOrder} from './orders/index.js';

// DB initialization
const database = createDatabase();

// CQRS initialization with an appropriate deps, based on .env var (STAGE = 'DEFAULT' | 'TESTS')
listenToCqrsMessages(
    database.product,
    database.order
);

// HTTP Server initialization (we omit Router for the sake of simplicity, we've got only few endpoints here ;)
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).json({'Health': true});
});

app.post('/order', createOrder);

app.get('/products', getProducts);
app.post('/products', createProduct);
app.post('/products/:id/sell', sellProduct);
app.post('/products/:id/restock', increaseStock);

app.use(catchErrorsMiddleware());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
