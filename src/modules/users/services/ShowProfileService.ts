import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface Irequest {
    userId: string;
}

@injectable()
export default class ShowProfileService {
    private userRepository: IUserRepository;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,
    ) {
        this.userRepository = userRepository;
    }

    public async execute({ userId }: Irequest): Promise<User> {
        const foundUser = await this.userRepository.findById(userId);

        if (!foundUser) {
            throw new AppError('User does not exist!');
        }

        return foundUser;
    }
}
