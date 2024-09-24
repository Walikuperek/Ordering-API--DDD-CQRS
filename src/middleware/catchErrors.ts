import {NextFunction, Request, Response} from 'express';
import {
    BusinessRuleException,
    ConcurrencyException,
    NotFoundException,
    ValidationException
} from '../../lib/base-errors.js';

export function catchErrorsMiddleware() {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {

        // simply copy logger module impl from https://github.com/Walikuperek/bports
        // it's not published to NPM yet, so... just copy-paste it!
        // console.error(err); // console.log is SYNC(blocks - can be huge problem, remember) change to `logger.error(err)` from https://github.com/Walikuperek/bports!

        if (err instanceof ValidationException) {
            return res.status(422).json({message: 422 + ' ' + err.message});
        }

        if (err instanceof BusinessRuleException) {
            return res.status(400).json({message: 400 + ' ' + err.message});
        }

        if (err instanceof NotFoundException) {
            return res.status(404).json({message: 404 + ' ' + err.message});
        }

        if (err instanceof ConcurrencyException) {
            return res.status(409).json({message: 409 + ' ' + err.message});
        }

        if (err instanceof Error) {
            return res.status(500).json({message: 'Unexpected error occurred', details: 500 + ' ' + err.message});
        }

        res.status(500).json({message: 500 + ' ' + 'Unexpected error occurred'});
    };
}
