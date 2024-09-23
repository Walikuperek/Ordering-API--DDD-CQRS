import {init, onMsg, onQ} from '../../lib/cqrs.js';
import {
    CreateProductCommand,
    CreateProductHandler,
    SellProductCommand,
    SellProductHandler,
    IncreaseStockCommand,
    IncreaseStockHandler,
    GetProductsHandler,
    GetProductsQuery,
    ProductRepository
} from '../availability/index.js';
import {CreateOrderCommand, CreateOrderHandler, OrderRepository} from '../orders/index.js';

type Queries = GetProductsQuery;
type Commands = CreateOrderCommand | CreateProductCommand | IncreaseStockCommand | SellProductCommand;
type DomainEvents = any;

export const {QueryBus, CommandBus, EventBus} = init<
    Queries,
    Commands,
    DomainEvents
>();

export function listenToCqrsMessages(productRepository: ProductRepository, orderRepository: OrderRepository) {
    // -- Registered Commands

    // Availability
    onMsg(CommandBus, 'CreateProductCommand', CreateProductHandler, productRepository);
    onMsg(CommandBus, 'SellProductCommand', SellProductHandler, productRepository);
    onMsg(CommandBus, 'IncreaseStockCommand', IncreaseStockHandler, productRepository);

    // Orders
    onMsg(CommandBus, 'CreateOrderCommand', CreateOrderHandler, productRepository, orderRepository);

    // -- Registered Queries/Projections

    // Availability
    onQ(QueryBus, 'GetProductsQuery', GetProductsHandler, productRepository);
}
