import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface Irequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
export default class CreateUserService {
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

    public async execute({ name, email, password }: Irequest): Promise<User> {
        const userFound = await this.userRepository.findByEmail(email);

        if (userFound) {
            throw new AppError('This email has alread used!');
        }

        const hashPassword = await this.hashProvider.generateHash(password);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashPassword,
        });

        return user;
    }
}
