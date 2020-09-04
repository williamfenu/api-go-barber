import AppError from '@shared/errors/AppError';

import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserToken';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassowordService: ResetPasswordService;

describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassowordService = new ResetPasswordService(
            fakeUserRepository,
            fakeUserTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        await resetPassowordService.execute({
            password: '123123',
            token,
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with an invalid userToken', async () => {
        await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            resetPassowordService.execute({
                password: '123123',
                token: 'inexistent-user-token',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with an invalid user', async () => {
        const userToken = await fakeUserTokenRepository.generate(
            'inexistent-user',
        );

        await expect(
            resetPassowordService.execute({
                password: 'inexistent-user',
                token: userToken.token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change the password with an expired token', async () => {
        const user = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const userToken = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassowordService.execute({
                password: '123123',
                token: userToken.token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
