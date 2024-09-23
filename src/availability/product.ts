import {UUID} from 'node:crypto';
import {BusinessRuleException} from '../../lib/base-errors.js';
import {Money} from '../../lib/money.js';

export class Product {
    constructor(
        public id: UUID,
        public name: string,
        public description: string,
        private price: Money = new Money(0, 'PLN'),
        private stock: number = 0,
        private version = 1,
        private isDeleted: boolean = false,
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date(),
        private deletedAt: Date | null = null
    ) {}

    getActualVersion(): number {
        return this.version;
    }

    getActualPrice(): Money {
        return this.price;
    }

    getActualQuantity(): number {
        return this.stock;
    }

    sell(quantity: number): void {
        SellProductPolitic.isSatisfiedBy(this, quantity);
        this.stock -= quantity;
    }

    restock(quantity: number): void {
        IncreaseStockProductPolitic.isSatisfiedBy(this, quantity);
        this.stock += quantity;
    }

    delete(): void {
        if (this.isDeleted) {
            throw new BusinessRuleException(`This product is already deleted, was deleted at ${this.deletedAt}`);
        }
        this.isDeleted = true;
        this.deletedAt = new Date();
    }

    restore(): void {
        if (!this.isDeleted) {
            throw new BusinessRuleException(`This product is not deleted`);
        }
        this.isDeleted = false;
        // we want to know if something was deleted previously for reports, etc. so it's off
        // this.deletedAt = null;
    }

    incrementVersion(): void {
        this.version += 1;
    }
}

class TryingToRestockWithWrongQuantity extends BusinessRuleException {
    constructor(private quantity: number) {
        super(`Quantity cannot be less than 1, and you are trying to increase stock with ${quantity}`);
    }
}

class IncreaseStockProductPolitic {
    static isSatisfiedBy(product: Product, quantity: number): boolean {
        if (quantity < 1) {
            throw new TryingToRestockWithWrongQuantity(quantity);
        }
        return true;
    }
}


class NotEnoughProductsAvailable extends BusinessRuleException {
    constructor(private product: Product, private quantity: number) {
        super(`Not enough products, found only ${product.getActualQuantity()}, and ordered ${quantity}`);
    }
}

class OrderedWrongQuantity extends BusinessRuleException {
    constructor(private quantity: number) {
        super(`Quantity cannot be less than 1, and you ordered ${quantity}`);
    }
}

class SellProductPolitic {
    static isSatisfiedBy(product: Product, quantity: number): boolean {
        if (quantity < 1) {
            throw new OrderedWrongQuantity(quantity);
        }

        if (quantity > product.getActualQuantity()) {
            throw new NotEnoughProductsAvailable(product, quantity);
        }
        return true;
    }
}
