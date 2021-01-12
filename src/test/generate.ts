import faker from 'faker';

export function id(): string {
    return faker.random.uuid();
}

export function email(): string {
    return faker.internet.email();
}

export function username(): string {
    return faker.internet.userName();
}

export function password(...args: any) {
    const pwRequirements = '!0Aa';
    // Add pwRequirements to faker passwords to ensure they pass our validation.
    return `${pwRequirements}${faker.internet.password(...args)}`;
}

export function postTitle(): string {
    return faker.lorem.words(getRandomInt(5));
}

export function postBody(): string {
    return faker.lorem.paragraph();
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}
