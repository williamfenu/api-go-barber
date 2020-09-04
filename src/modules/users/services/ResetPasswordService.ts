import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    password: string;
    token: string;
}

@injectable()
export default class ResetPasswordService {
    private userRepository: IUserRepository;

    private userTokensRepository: IUserTokensRepository;

    private hashProvider: IHashProvider;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,

        @inject('UserTokensRepository')
        userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        hashProvider: IHashProvider,
    ) {
        this.userRepository = userRepository;
        this.userTokensRepository = userTokensRepository;
        this.hashProvider = hashProvider;
    }

    public async execute({ password, token }: IRequest): Promise<void> {
        const foundUserToken = await this.userTokensRepository.findByToken(
            token,
        );
        if (!foundUserToken) {
            throw new AppError('User token does not exist');
        }

        if (isAfter(Date.now(), addHours(foundUserToken.createdAt, 2))) {
            throw new AppError('Token expired');
        }

        const user = await this.userRepository.findById(foundUserToken.userId);

        if (!user) {
            throw new AppError('User does not exist');
        }

        user.password = await this.hashProvider.generateHash(password);
        await this.userRepository.save(user);
    }
}
