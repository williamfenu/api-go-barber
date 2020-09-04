import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersRepository: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUsersRepository = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const newUser = await createUsersRepository.execute({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '1234',
        });

        expect(newUser).not.toBeNull();
        expect(newUser).toHaveProperty('name');
    });

    it('should not create a new user if it alread exists', async () => {
        await createUsersRepository.execute({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '1234',
        });

        await expect(
            createUsersRepository.execute({
                name: 'John Doe',
                email: 'doe@example.com.br',
                password: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
