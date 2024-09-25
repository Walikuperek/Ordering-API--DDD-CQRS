import {NextFunction, Request, Response} from 'express';
import {Money} from '../../lib/money.js';
import {CommandBus, QueryBus} from '../infra/event-bus.js';
import {CreateProductCommand, IncreaseStockCommand, SellProductCommand} from './commands/index.js';
import {GetProductsQuery} from './queries/index.js';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, description, price, stock } = req.body;
        price = new Money(price.amount, price.currency);
        CommandBus.publish(new CreateProductCommand({name, description, price, stock}));
        res.status(201).json({message: 'Product created'});
    } catch (err: any) {
        next(err);
    }
};

export const sellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        CommandBus.publish(new SellProductCommand({productId, quantity}));
        res.status(204).json({message: 'Product sold'});
    } catch (err: any) {
        next(err);
    }
};

export const increaseStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        CommandBus.publish(new IncreaseStockCommand({productId, quantity}));
        res.status(204).json({message: 'Product stock increased'});
    } catch (err: any) {
        next(err);
    }
};

// Projections
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = new GetProductsQuery()
        const products = await QueryBus.execute(query);
        res.status(200).json(products);
    } catch (err: any) {
        next(err);
    }
};
