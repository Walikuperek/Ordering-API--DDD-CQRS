# CQRS Inventory System

Take a look at working backend system example to manage inventory in a company.

> *Missing: actual DB connection, DomainEvents impl and joi, that's it :)*

## Business problem:

![problem diagram](./assets/business_problem.png)

## Solution:
- API that handles: `Products`(Creation/Availability of them) and `Orders`
- `CQRS` pattern to distinguish business behaviors and separate writes/reads
- `ExpressJS` API with `Typescript` to ensure proper typing
- `MongoDB` as our database/persistence layer
- Input validation with `joi`
- `Unit` and `Integration` Tests to test our business logic with `Jest`
- `Domain Driven Design` to help with business rules


## Run: 
```bash copy
$ npm i
$ npm run build
$ npm run dev
```

## Author:
2024, Kacper Walczak [website](https://quak.com.pl)
