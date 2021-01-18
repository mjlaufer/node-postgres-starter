import got from 'got';
import { get } from 'lodash';

export const request = got.extend({
    hooks: {
        beforeError: [
            (error) => {
                const { response } = error;
                if (response && response.body) {
                    error.message = `(${response.statusCode}) ${get(
                        response.body,
                        'message',
                        'Something went wrong.',
                    )}`;
                }
                return error;
            },
        ],
    },
    responseType: 'json',
    retry: 0,
});
