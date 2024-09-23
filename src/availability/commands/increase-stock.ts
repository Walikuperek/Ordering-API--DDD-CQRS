import {Command} from '../../../lib/cqrs.js';
import {ProductRepository} from '../product.repository.js';

export interface IncreaseStockPayload {
    productId: string;
    quantity: number;
}

export class IncreaseStockCommand implements Command<IncreaseStockPayload> {
    type = 'IncreaseStockCommand';
    constructor(public payload: IncreaseStockPayload, public createdAt = new Date()) {}
}

export class IncreaseStockHandler {
    constructor(private productRepository: ProductRepository) {}

    async execute(command: IncreaseStockCommand): Promise<void> {
        const { productId, quantity } = command.payload;
        const product = await this.productRepository.getById(productId);
        product.restock(quantity);
        await this.productRepository.save(product);
    }
}
