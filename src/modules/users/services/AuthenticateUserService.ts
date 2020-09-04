import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
export default class AuthenticateUserService {
    private userRepository: IUserRepository;

    private hashProvider: IHashProvider;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,

        @inject('HashProvider')
        hashProvider: IHashProvider,
    ) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    }

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not found!', 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordMatch) {
            throw new AppError('user/password does not match!', 401);
        }

        const token = sign({}, auth.secret, {
            subject: user.id,
            expiresIn: auth.expireIn,
        });

        return { user, token };
    }
}
