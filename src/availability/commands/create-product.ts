import {randomUUID} from 'node:crypto';
import {Command} from '../../../lib/cqrs.js';
import {Money} from '../../../lib/money.js';
import {Product} from '../product.js';
import {ProductRepository} from '../product.repository.js';

export interface CreateProductPayload {
    name: string;
    description: string;
    price: Money; // money cannot be negative, Money class will throw
    stock: number;
}

export class CreateProductCommand implements Command<CreateProductPayload> {
    public type = 'CreateProductCommand';
    constructor(public payload: CreateProductPayload, public createdAt = new Date()) {}
}

export class CreateProductHandler {
    constructor(private productRepository: ProductRepository) {}

    async execute(command: CreateProductCommand): Promise<void> {
        const { name, description, price, stock } = command.payload;

        await this.productRepository.save(new Product(
            randomUUID(),
            name,
            description,
            price,
            stock
        ));
    }
}
