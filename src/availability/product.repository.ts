import {Product} from './product.js';

export interface ProductRepository {
    /** @throws ConcurrencyException if exists and version is lower otherwise will increment version */
    save(product: Product): Promise<void>;
    del(productId: string): Promise<boolean>; // think about isDeleted flag and switching it off and on, so we can...
    restore(productId: string): Promise<boolean>;

    // projections
    /** @throws NotFoundException when not found Product */
    getById(productId: string): Promise<Product>;
    retrieveAll(): Promise<Product[]>;
}
