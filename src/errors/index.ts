export enum HttpErrorMessages {
    BAD_REQUEST = 'Bad Request',
    FORBIDDEN = 'Forbidden',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    NOT_FOUND = 'Not Found',
    UNAUTHORIZED = 'Unauthorized',
}

export abstract class HttpError extends Error {
    abstract status: number;
}

export class BadRequestError extends HttpError {
    status = 400;
    constructor(message: string = HttpErrorMessages.BAD_REQUEST) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends HttpError {
    status = 401;
    constructor(message: string = HttpErrorMessages.UNAUTHORIZED) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends HttpError {
    status = 403;
    constructor(message: string = HttpErrorMessages.FORBIDDEN) {
        super(message);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends HttpError {
    status = 404;
    constructor(message: string = HttpErrorMessages.NOT_FOUND) {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class InternalServerError extends HttpError {
    status = 500;
    constructor(message: string = HttpErrorMessages.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = 'InternalServerError';
    }
}
