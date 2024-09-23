import 'dotenv/config';
import {InMemoryProductRepository, MongoProductRepository} from './product.repository.js';
import {InMemoryOrderRepository, MongoOrderRepository} from './order.repository.js';

export function createDatabase() {
    // For localdev | unit tests
    if (process.env.STAGE === 'TESTS') {
        return {
            product: new InMemoryProductRepository(),
            order: new InMemoryOrderRepository()
        };
    }

    return {
        product: new MongoProductRepository(),
        order: new MongoOrderRepository()
    };
}
