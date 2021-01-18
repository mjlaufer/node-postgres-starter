import * as userService from '@services/user-service';
import * as generate from '@test/utils/generate';
import * as userController from './user-controller';

describe('userController', () => {
    const mockUser = generate.user();

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('fetchUsers', async () => {
        const fetchUsers = jest.spyOn(userService, 'fetchUsers').mockResolvedValue([mockUser]);

        expect.assertions(4);

        const req = generate.req();
        const res = generate.res();
        await userController.fetchUsers(req, res);

        expect(fetchUsers).toHaveBeenCalledWith(
            expect.objectContaining({ limit: 10, order: 'DESC' }),
        );
        expect(fetchUsers).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ users: [mockUser] });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('fetchUser', async () => {
        const fetchUser = jest.spyOn(userService, 'fetchUser').mockResolvedValue(mockUser);

        expect.assertions(4);

        const req = generate.req({ params: { id: mockUser.id } });
        const res = generate.res();
        await userController.fetchUser(req, res);

        expect(fetchUser).toHaveBeenCalledWith(mockUser.id);
        expect(fetchUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUser);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('createUser', async () => {
        const createUser = jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

        expect.assertions(4);

        const data = {
            email: generate.email(),
            username: generate.username(),
        };
        const req = generate.req({ body: data });
        const res = generate.res();
        await userController.createUser(req, res);

        expect(createUser).toHaveBeenCalledWith(data);
        expect(createUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(mockUser);
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('updateUser', async () => {
        const data = {
            username: generate.username(),
        };
        const updateUser = jest
            .spyOn(userService, 'updateUser')
            .mockResolvedValue({ ...mockUser, ...data });

        expect.assertions(4);

        const req = generate.req({ params: { id: mockUser.id }, body: data });
        const res = generate.res();
        await userController.updateUser(req, res);

        expect(updateUser).toHaveBeenCalledWith({
            id: mockUser.id,
            ...data,
        });
        expect(updateUser).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ ...mockUser, ...data });
        expect(res.json).toHaveBeenCalledTimes(1);
    });

    test('deleteUser', async () => {
        const deleteUser = jest.spyOn(userService, 'deleteUser').mockResolvedValue();

        expect.assertions(3);

        const req = generate.req({ params: { id: mockUser.id } });
        const res = generate.res();
        await userController.deleteUser(req, res);

        expect(deleteUser).toHaveBeenCalledWith(mockUser.id);
        expect(deleteUser).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledTimes(1);
    });
});
