# CQRS Inventory System

Take a look at working backend system example to manage inventory in a company.

## Business problem:

![problem diagram](./assets/business_problem.png)

### Solution:
- API that handles: `Products`(Creation/Availability of them) and `Orders`
- `Concurrent` writes protection system (look for version field and getCurrentVersion method)
- `CQRS` pattern to distinguish business behaviors and separate writes/reads
- `ExpressJS` API with `Typescript` to ensure proper typing
- `MongoDB`/`InMemory` as our database/persistence layer(*in-memory for testing, Dependency Inversion principle used*)
- ~~`Unit` and `Integration` Tests to test our business logic with `Jest`~~ - not yet
- ~~Input validation with `joi`~~ - not yet
- `Domain Driven Design` to help with business rules

#### Command & Query flows

##### Increase Stock Command flow
```typescript copy
// 1. register command
onMsg(CommandBus, 'SellProductCommand', SellProductHandler, productRepository);

// 2. get request
const increaseStock = async (req: Request, res: Response, next: NextFunction) => {
    // try
    const {quantity} = req.body;
    const {productId} = req.params;
    await CommandBus.publish(new IncreaseStockCommand({productId, quantity}));
    res.status(204).json({message: 'Product stock increased'});
    // catch next(err) -> catched by middleware
}

// 3. with payload 
interface IncreaseStockPayload {
    productId: string;
    quantity: number;
}

// 4. encapsulated as a command
class IncreaseStockCommand implements Command<IncreaseStockPayload> {
    type = 'IncreaseStockCommand';
    constructor(public payload: IncreaseStockPayload, public createdAt = new Date()) {}
}

// 5. that is handled by
class IncreaseStockHandler {
    constructor(private productRepository: ProductRepository) {}

    async execute(command: IncreaseStockCommand): Promise<void> {
        const { productId, quantity } = command.payload;
        const product = await this.productRepository.getById(productId);
        product.restock(quantity);
        await this.productRepository.save(product);
    }
}
```

##### Get all products Query flow

```typescript copy
// 1. register query
onQ(QueryBus, 'GetProductsQuery', GetProductsHandler, productRepository);

// 2. encapsulated as
class GetProductsQuery implements Query<{}> {
    type = 'GetProductsQuery';
    constructor(public payload = {}, public createdAt = new Date()) {}
}
// 3. handled by QueryHandler
// ...
async execute(query: GetProductsQuery): Promise<Product[]> {
    return await this.productRepository.retrieveAll();
}

// GET endpoint
const query = new GetProductsQuery()
const products = await QueryBus.execute(query)
res.status(200).json(products)
```

Call endpoint with simple:
```bash copy
curl http://localhost:3000/products
```

Returns:
```json
[Product,]
```

## Run: 

> Joi and MongoDB is not yet connected. To see how to do it with Docker take a look at [Express and MongoDB at my website](https://quak.com.pl/learn/node/dockerize-express-and-mongo/).
>
> Example with MongoDB and Docker usage:
> ```bash copy
> # build image as express-app
> docker build -t express-app .
>
> # build network for containers
> docker network create express-network
>
> # run MongoDB container in background
> docker run -d --name mongodb --network express-network -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo
>
> # run express-app container
> docker run --env-file .env --network express-network -p 5000:5000 express-app
> ```

Prerequisites:
- Node v20+
- Docker if used with link above

Ensure you have proper `.env` file:
```env copy
# stage can be 'DEFAULT' | 'TESTS'
STAGE=TESTS
PORT=3000
```

Run locally:
```bash copy
# Run with in-memory repo's
$ npm i
$ npm run build
$ npm run dev
```

## Author:
2024, Kacper Walczak [website](https://quak.com.pl)
