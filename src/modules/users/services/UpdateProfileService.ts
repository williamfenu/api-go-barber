import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface Irequest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
export default class UpdateProfileService {
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

    public async execute({
        userId,
        name,
        email,
        oldPassword,
        password,
    }: Irequest): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError('User does not exist!');
        }

        const foundUserByEmail = await this.userRepository.findByEmail(email);

        if (foundUserByEmail && foundUserByEmail.id !== userId) {
            throw new AppError('Email has already been used!');
        }

        if (password && !oldPassword) {
            throw new AppError('You need to inform the old password', 401);
        }

        if (password && oldPassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError('The old password informed was wrong', 401);
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        user.name = name;
        user.email = email;

        const updatedUser = await this.userRepository.save(user);

        return updatedUser;
    }
}
