import {ProductRepository} from '../availability/product.repository.js';
import {Product} from '../availability/product.js';
import {ConcurrencyException, NotFoundException} from '../../lib/base-errors.js';

export class MongoProductRepository implements ProductRepository {
    async save(product: Product) {}

    async del(productId: string): Promise<boolean> {
        return true;
    }

    async restore(productId: string): Promise<boolean> {
        return true;
    }

    async getById(productId: string): Promise<Product> {
        throw new NotFoundException(`Cannot found product ${productId}`);
    }

    async retrieveAll(): Promise<Product[]> {
        return [];
    }
}

export class InMemoryProductRepository implements ProductRepository {
    private products: Map<string, Product> = new Map();

    async save(product: Product): Promise<void> {
        const existing = this.products.get(product.id);
        if (existing && existing.getActualVersion() > product.getActualVersion()) {
            throw new ConcurrencyException(`Trying to override product with version ${product.getActualVersion()} which is lower than already existing one ${existing.getActualVersion()}`);
        }
        if (existing) existing.incrementVersion();
        this.products.set(product.id, product);
    }

    async del(productId: string): Promise<boolean> {
        const product = await this.getById(productId);
        product.delete();
        return this.resolve(true);
    }

    async restore(productId: string): Promise<boolean> {
        const product = await this.getById(productId);
        product.restore();
        return this.resolve(true);
    }

    async getById(productId: string): Promise<Product> {
        const product = this.products.get(productId);
        if (!product) {
            throw new NotFoundException(`Cannot found product ${productId}`);
        }
        return this.resolve(product);
    }

    async retrieveAll(): Promise<Product[]> {
        return this.resolve([...this.products.values()]);
    }

    private resolve<T>(val: T): Promise<T> {
        return new Promise(resolve => resolve(val))
    }
}
