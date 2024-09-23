import {randomUUID, UUID} from 'node:crypto';
import {Currency, Money} from '../../lib/money.js';
import {BusinessRuleException} from '../../lib/base-errors.js';
import {Product} from "../availability/index.js";

export class OrderLine {
    constructor(
        public productId: string,
        public productName: string,
        public productPrice: Money,
        public quantity: number
    ) {}
}

export class WrongCurrency extends BusinessRuleException {
    constructor(private line: OrderLine, private order: Order) {
        super(`Cannot add product, wrong currency, order currency ${order.getCurrency()}, and ordered ${line.productPrice.getCurrency()}`);
    }
}

export class AddProductToOrderPolicy {
    static isSatisfiedBy(line: OrderLine, order: Order): boolean {
        const currenciesMatch = order.getCurrency() === line.productPrice.getCurrency();
        if (!currenciesMatch) {
            throw new WrongCurrency(line, order);
        }
        return true;
    }
}

export class Order {
    constructor(
        public id: UUID,
        public customerId: string,
        public products: OrderLine[] = [],
        public status: 'PENDING' | 'OPENED' | 'CLOSED' = 'PENDING',
        public orderedAt: Date = new Date(),
        private currency: Currency = 'PLN',
        private version = 1
    ) {}

    static fromProducts(customerId: string, products: Product[]): Order {
        const orderLines = products.map(p => new OrderLine(p.id, p.name, p.getActualPrice(), p.getActualQuantity()));
        const order = new Order(randomUUID(), customerId);
        orderLines.forEach(line => order.addLine(line));
        order.markAsFinished();
        return order;
    }

    isEmpty(): boolean {
        return !this.products.length;
    }

    getActualVersion(): number {
        return this.version;
    }

    getCurrency(): Currency | null {
        return this.currency;
    }

    addLine(line: OrderLine): void {
        if (this.isEmpty()) {
            this.status = 'OPENED';
            this.currency = line.productPrice.getCurrency();
        }
        AddProductToOrderPolicy.isSatisfiedBy(line, this);
        this.products.push(line);
    }

    markAsFinished(): void {
        if (this.status !== 'OPENED') {
            throw new BusinessRuleException(`Order status should be "OPENED" and is ${this.status}`);
        }
        this.status = 'CLOSED';
    }

    incrementVersion(): void {
        this.version += 1;
    }
}
