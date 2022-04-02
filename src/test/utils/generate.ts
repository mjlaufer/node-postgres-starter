import { Request, Response, NextFunction } from 'express';
import faker from '@faker-js/faker';
import { merge } from 'lodash';
import validate from 'validator';
import { Post, User } from '@types';

export function req(overrides: Partial<Request> = {}): Request {
    const req = { query: {}, params: {}, body: {} } as Request;
    return merge(req, overrides);
}

export function res(overrides: Partial<Response> = {}): Response {
    const res = {} as Response;
    res.json = jest.fn(() => res).mockName('json');
    res.status = jest.fn(() => res).mockName('status');
    res.end = jest.fn().mockName('end');
    return merge(res, overrides);
}

export function next(fn?: () => void): NextFunction {
    return jest.fn(fn).mockName('next');
}

export function id(): string {
    return faker.datatype.uuid();
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

export function user(overrides?: Partial<User>): User {
    return {
        id: id(),
        email: validate.normalizeEmail(email()) || email(),
        username: username(),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

export function postTitle(): string {
    return `A${faker.lorem.words(getRandomInt(5))}`; // Use string interpolation to prevent empty title.
}

export function postBody(): string {
    return faker.lorem.paragraph();
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function post(overrides?: Partial<Post>): Post {
    return {
        id: id(),
        title: postTitle(),
        body: postBody(),
        author: {
            id: id(),
            username: username(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}
