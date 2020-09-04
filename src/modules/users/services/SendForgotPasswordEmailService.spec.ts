import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserToken';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();
        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUserRepository,
            fakeMailProvider,
            fakeUserTokenRepository,
        );
    });

    it('should be able recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
            email: 'johndoe@example.com',
            name: 'John Doe',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toBeCalled();
    });

    it('should not be able recover the password of an inexistent user', async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to generate the user token', async () => {
        const generate = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUserRepository.create({
            email: 'johndoe@example.com',
            name: 'John Doe',
            password: '123456',
        });

        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        });

        expect(generate).toBeCalledWith(user.id);
    });
});
