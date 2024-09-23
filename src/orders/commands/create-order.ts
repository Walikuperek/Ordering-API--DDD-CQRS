import {Command} from '../../../lib/cqrs.js';
import {Product, ProductRepository} from '../../availability/index.js';
import {OrderRepository} from '../order.repository.js';
import {Order} from '../order.js';

export interface CreateOrderPayload {
    customerId: string;
    products: Product[];
}

export class CreateOrderCommand implements Command<CreateOrderPayload> {
    public type = 'CreateOrderCommand';
    constructor(public payload: CreateOrderPayload, public createdAt = new Date()) {}
}

export class CreateOrderHandler {
    constructor(private productRepository: ProductRepository, private orderRepository: OrderRepository) {}

    async execute(command: CreateOrderCommand): Promise<void> {
        const { customerId, products } = command.payload;
        await this.orderRepository.save(Order.fromProducts(customerId, products));
        // maybe we should consider transaction?? who knows... yes, we should; but for sake of simplicity...
        await products.forEach(product => product.sell(product.getActualQuantity()));
    }
}
