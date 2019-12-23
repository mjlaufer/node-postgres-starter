import { Request, Response, NextFunction } from 'express';
import { HttpError, HttpErrorMessages } from '../../errors';
import schemaMap from '../../schemas';

export default async function schemaValidator(req: Request, res: Response, next: NextFunction) {
    if (schemaMap.hasOwnProperty(req.path)) {
        const schema = schemaMap[req.path];

        try {
            await schema.validateAsync(req.body);
        } catch (err) {
            next(new HttpError(HttpErrorMessages.BAD_REQUEST, 400));
        }
    }

    next();
}
