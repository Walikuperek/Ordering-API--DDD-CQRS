import {OrderRepository} from '../orders/index.js';
import {Order} from '../orders/order.js';
import {ConcurrencyException} from '../../lib/base-errors.js';

export class MongoOrderRepository implements OrderRepository {
    async save(order: Order) {}
}

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Map<string, Order> = new Map();

    async save(order: Order): Promise<void> {
        const existing = this.orders.get(order.id);
        if (existing && existing.getActualVersion() > order.getActualVersion()) {
            throw new ConcurrencyException(`Trying to override order with version ${order.getActualVersion()} which is lower than already existing one ${existing.getActualVersion()}`);
        }
        if (existing) existing.incrementVersion();
        this.orders.set(order.id, order);
    }
}
