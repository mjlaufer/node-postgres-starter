import * as userService from '@features/user/user-service';
import * as generate from '@test/utils/generate';
import * as userController from './user-controller';

describe('userController', () => {
    const mockUser = generate.user();

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('fetchUsers', async () => {
        const fetchUsers = jest.spyOn(userService, 'fetchUsers').mockResolvedValue([mockUser]);
        const req = generate.req();
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await userController.fetchUsers(req, res, next);

        expect(fetchUsers).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 10, order: 'DESC' }),
        );
        expect(fetchUsers).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ users: [mockUser] });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('fetchUser', async () => {
        const fetchUser = jest.spyOn(userService, 'fetchUser').mockResolvedValue(mockUser);
        const req = generate.req({ params: { id: mockUser.id } });
        const res = generate.res();
        const next = generate.next();

        await userController.fetchUser(req, res, next);
        expect.assertions(4);

        expect(fetchUser).toHaveBeenCalledWith(mockUser.id);
        expect(fetchUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUser);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('createUser', async () => {
        const createUser = jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);
        const data = {
            email: generate.email(),
            username: generate.username(),
        };
        const req = generate.req({ body: data });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await userController.createUser(req, res, next);

        expect(createUser).toHaveBeenCalledWith(data);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUser);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('updateUser', async () => {
        const userUpdateData = {
            username: generate.username(),
        };
        const updateUser = jest
            .spyOn(userService, 'updateUser')
            .mockResolvedValue({ ...mockUser, ...userUpdateData });
        const req = generate.req({
            user: mockUser,
            params: { id: mockUser.id },
            body: userUpdateData,
        });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(4);
        await userController.updateUser(req, res, next);

        expect(updateUser).toHaveBeenCalledWith({
            requestor: mockUser,
            data: {
                id: mockUser.id,
                ...userUpdateData,
            },
        });
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ ...mockUser, ...userUpdateData });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('deleteUser', async () => {
        const deleteUser = jest.spyOn(userService, 'deleteUser').mockResolvedValue();
        const req = generate.req({ user: mockUser, params: { id: mockUser.id } });
        const res = generate.res();
        const next = generate.next();

        expect.assertions(3);
        await userController.deleteUser(req, res, next);

        expect(deleteUser).toHaveBeenCalledWith({
            requestor: mockUser,
            data: {
                id: mockUser.id,
            },
        });
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledTimes(1);
    });
});
