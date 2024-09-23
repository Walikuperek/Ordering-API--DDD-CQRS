import {Query} from '../../../lib/cqrs.js';
import {Product} from '../product.js';
import {ProductRepository} from '../product.repository.js';

export interface GetProductsPayload {}

export class GetProductsQuery implements Query<GetProductsPayload> {
    type = 'GetProductsQuery';
    constructor(public payload: GetProductsPayload = {}, public createdAt = new Date()) {}
}

export class GetProductsHandler {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(query: GetProductsQuery): Promise<Product[]> {
        return await this.productRepository.retrieveAll();
    }
}
