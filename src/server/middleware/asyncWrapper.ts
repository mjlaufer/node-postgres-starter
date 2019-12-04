import { Request, Response, NextFunction } from 'express';

export default function asyncWrapper(
    asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await asyncFn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
