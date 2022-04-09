import pgPromise, { IInitOptions, IDatabase } from 'pg-promise';
import UserRepository from '../features/user/UserRepository';
import PostRepository from '../features/post/PostRepository';

interface Extensions {
    users: UserRepository;
    posts: PostRepository;
}

export type ExtendedProtocol = IDatabase<Extensions> & Extensions;

const initOptions: IInitOptions<Extensions> = {
    extend(protocolObj: ExtendedProtocol) {
        protocolObj.users = new UserRepository(protocolObj);
        protocolObj.posts = new PostRepository(protocolObj);
    },
    receive(data) {
        camelCaseColumns(data);
    },
};

const pgp = pgPromise(initOptions);

function camelCaseColumns(data: { [key: string]: string }[]): void {
    const tmp = data[0];
    for (const prop in tmp) {
        const camel = pgp.utils.camelize(prop);
        if (!(camel in tmp)) {
            for (const d of data) {
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}

export default pgp;
