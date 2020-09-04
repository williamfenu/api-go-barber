import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUserService = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );

        authenticateUserService = new AuthenticateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456789',
        });

        const authenticatedUser = await authenticateUserService.execute({
            email: 'doe@example.com.br',
            password: '123456789',
        });

        expect(authenticatedUser).toHaveProperty('token');
        expect(authenticatedUser.user).toEqual(user);
    });

    it('should fail on authenticate without user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'unexistentUser@example.com',
                password: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should fail if the user password does not match', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456789',
        });

        await expect(
            authenticateUserService.execute({
                email: 'doe@example.com.br',
                password: '222222',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
