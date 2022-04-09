import { Request, Response, NextFunction } from 'express';
import { MiddlewareFunc } from '@types';

export default function asyncWrapper(asyncFn: MiddlewareFunc): MiddlewareFunc {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await asyncFn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
