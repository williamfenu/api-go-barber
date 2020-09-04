import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';

import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUserRepository);
    });

    it('should be able to show the user profile', async () => {
        const newUser = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        const foundUser = await showProfile.execute({ userId: newUser.id });

        expect(foundUser.name).toBe(newUser.name);
    });

    it('should not be able to show inexistent user profile', async () => {
        await expect(
            showProfile.execute({ userId: 'inexistent user' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
