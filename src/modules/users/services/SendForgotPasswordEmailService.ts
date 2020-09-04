import { inject, injectable } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
    private userRepository: IUserRepository;

    private mailProvider: IMailProvider;

    private userTokensRepository: IUserTokensRepository;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,

        @inject('MailProvider')
        mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository,
    ) {
        this.userRepository = userRepository;
        this.mailProvider = mailProvider;
        this.userTokensRepository = userTokensRepository;
    }

    public async execute(data: IRequest): Promise<void> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError('User not exist');
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        const forgotEmailTemplate = path.resolve(
            __dirname,
            '..',
            'templates',
            'forgot-password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotEmailTemplate,
                variables: {
                    nome: user.name,
                    email: user.email,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                },
            },
        });
    }
}
