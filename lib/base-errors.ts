// Consider relocation inside a `git submodule` or `npm package` like https://github.com/Walikuperek/bports do!

/*
                 /|  /|
                J(|----.
               /   ))))))
              J    '`'`' \
              F     (.) (.)--._
             /                 `.
            J                   |
            F       ._         .'
           J          `-.____.'
           F           \
          J             \.
          |   .  `.      \\
 ,,,      |    `.  `.     L`
\VVV'     |      `.  `    |`
 \W|      J        ```    |
  `.    .' \              F
    `--'    )    ___..-   ( .-
           /   .'     `. //' /
           `.  \        `<_.'
             `._|               Base Errors
*/

export class ValidationException extends Error {
    constructor(msg: string) {
        super(`ValidationException: ${msg}`);
    }
}

export class BusinessRuleException extends Error {
    constructor(msg: string) {
        super(`BusinessRuleException: ${msg}`);
    }
}

export class ConcurrencyException extends Error {
    constructor(msg: string) {
        super(`ConcurrencyException: ${msg}`);
    }
}

export class NotFoundException extends Error {
    constructor(msg: string) {
        super(`NotFoundException: ${msg}`);
    }
}
