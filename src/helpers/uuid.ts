import uuid from 'uuid/v4';

export function generateId(): string {
    return uuid();
}
