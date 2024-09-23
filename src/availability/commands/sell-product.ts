import {NotFoundException} from '../../../lib/base-errors.js';
import {Command} from '../../../lib/cqrs.js';
import {ProductRepository} from '../product.repository.js';

export interface SellProductPayload {
    productId: string;
    quantity: number;
}

export class SellProductCommand implements Command<SellProductPayload> {
    type = 'SellProductCommand';
    constructor(public payload: SellProductPayload, public createdAt = new Date()) {}
}

export class SellProductHandler {
    constructor(private productRepository: ProductRepository) {}

    async execute(command: SellProductCommand): Promise<void> {
        const { productId, quantity } = command.payload;
        const product = await this.productRepository.getById(productId);
        product.sell(quantity);
        await this.productRepository.save(product);
    }
}
