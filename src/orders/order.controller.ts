import {NextFunction, Request, Response} from 'express';
import {CommandBus} from '../infra/event-bus.js';
import {CreateOrderCommand} from './commands/index.js';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { customerId, products } = req.body;
        await CommandBus.publish(new CreateOrderCommand({customerId, products}));
        res.status(201).json({message: 'Order created'});
    } catch (err: any) {
        next(err);
    }
};
