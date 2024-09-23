import {Order} from './order.js';

export interface OrderRepository {
    save(order: Order): Promise<void>;
}
