export enum HttpErrorMessages {
    BAD_REQUEST = 'Bad Request',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    NOT_FOUND = 'Not Found',
    UNAUTHORIZED = 'Unauthorized',
}

export class HttpError extends Error {
    constructor(message: string = HttpErrorMessages.INTERNAL_SERVER_ERROR, public status = 500) {
        super(message);
        this.name = 'HttpError';
    }
}

export class ValidationError extends HttpError {
    constructor(message = 'Validation Error', public status = 400) {
        super(message, status);
        this.name = 'ValidationError';
    }
}
