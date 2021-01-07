import { Request, Response, NextFunction } from 'express';
import { MiddlewareFunc } from '../types';

export default function asyncWrapper(
    asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await asyncFn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
