// Consider relocation inside a `git submodule` or `npm package` like https://github.com/Walikuperek/bports do!
// Lib dependency, remember!
import {ValidationException} from './base-errors.js';

/*
                            ,-.
       ___,---.__          /'|`\          __,---,___
    ,-'    \`    `-.____,-'  |  `-.____,-'    //    `-.
  ,'        |           ~'\     /`~           |        `.
 /      ___//              `. ,'          ,  , \___      \
|    ,-'   `-.__   _         |        ,    __,-'   `-.    |
|   /          /\_  `   .    |    ,      _/\          \   |
\  |           \ \`-.___ \   |   / ___,-'/ /           |  /
 \  \           | `._   `\\  |  //'   _,' |           /  /
  `-.\         /'  _ `---'' , . ``---' _  `\         /,-'
     ``       /     \    ,='/ \`=.    /     \       ''
             |__   /|\_,--.,-.--,--._/|\   __|
             /  `./  \\`\ |  |  | /,//' \,'  \
MoNeY       /   /     ||--+--|--+-/-|     \   \
           |   |     /'\_\_\ | /_/_/`\     |   |
            \   \__, \_     `~'     _/ .__/   /
             `-._,-'   `-._______,-'   `-._,-'
*/

/** Add more currencies if needed. */
export type Currency =
    | 'PLN'
    | 'EUR';

/**
 * @param {bigint | number} amount amount is in cents/grosze/pennies/etc., cannot be negative, if you need negative values got for Dept class or something.
 * @param {Currency} currency
 *   ```
 *   100,00 pln = 10_000 as an amount, same with dollars, euros, etc.
 *   ```
 * @example
 *  const plnPrice = 100.00
 *  const price100pln = new Money(plnPrice, 'PLN')
 *  const amount = price100pln.value // bigint 10_000
 *  const label = price100pln.toString() // 100.00 PLN
 *  price100pln.equals(new Money(100.00, 'PLN')) // true
 *  const pln200 = price100pln.add(new Money(100.00, 'PLN')) // should be same currency
 */
export class Money {
  private readonly amount: bigint;
  private readonly currency: Currency;

  constructor(amount: bigint | number, currency: Currency) {
    if (amount < 0) {
      throw new ValidationException('Amount cannot be negative');
    }
    if (typeof amount === 'number') {
        amount = BigInt(amount * 100);
    }
    this.amount = amount;
    this.currency = currency;
  }

  get value(): bigint {
      return this.amount;
  }

  toString(): string {
    return `${this.toNumber().toFixed(2)} ${this.currency}`;
  }

  toNumber(): number {
    return Number(this.amount / 100n);
  }

  getCurrency(): Currency {
    return this.currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * BigInt(Math.round(factor * 100)) / 100n, this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount * 100n / BigInt(Math.round(divisor * 100)), this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Currencies must be the same');
    }
  }
}
