import { camelCase, mapKeys, snakeCase } from 'lodash';

export function camelCaseKeys(o: object): object {
    return mapKeys(o, (_, key) => camelCase(key));
}

export function snakeCaseKeys(o: object): object {
    return mapKeys(o, (_, key) => snakeCase(key));
}
