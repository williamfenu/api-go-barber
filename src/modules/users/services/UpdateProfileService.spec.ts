import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the user profile', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            userId: newUser.id,
            name: newUser.name,
            email: 'owen@example.com',
            oldPassword: newUser.password,
            password: '123123',
        });

        expect(updatedUser.name).toBe(newUser.name);
        expect(updatedUser.email).toBe('owen@example.com');
    });

    it('should not be able to update inexistent user', async () => {
        await expect(
            updateProfile.execute({
                userId: 'inexistent-id',
                name: 'inexistent-user',
                email: 'owen@example.com',
                oldPassword: 'inexistent-password',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update email that already is in use', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        const anotherUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'jack@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: newUser.id,
                name: newUser.name,
                email: anotherUser.email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update user when the old password was not informed', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update user when the old password was wrong', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        await expect(
            updateProfile.execute({
                userId: newUser.id,
                name: newUser.name,
                email: newUser.email,
                oldPassword: 'wrong-old-password',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update user when the new password was not informed', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        const user = await updateProfile.execute({
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email,
            oldPassword: newUser.password,
        });

        expect(user.password).toBe(newUser.password);
    });
});
