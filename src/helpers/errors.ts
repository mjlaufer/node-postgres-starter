export enum HttpErrorMessages {
    BAD_REQUEST = 'Bad Request',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    NOT_FOUND = 'Not Found',
}

export class HttpError extends Error {
    constructor(
        message: string = HttpErrorMessages.INTERNAL_SERVER_ERROR,
        public status: number = 500,
    ) {
        super(message);
        this.name = 'HttpError';
    }
}
