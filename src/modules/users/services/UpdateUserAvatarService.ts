import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUserRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface Irequest {
    userId: string;
    avatar: string;
}

@injectable()
export default class UpdateUserAvatarService {
    private userRepository: IUserRepository;

    private storageProvider: IStorageProvider;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,

        @inject('StorageProvider')
        storageProvider: IStorageProvider,
    ) {
        this.userRepository = userRepository;
        this.storageProvider = storageProvider;
    }

    public async execute({ userId, avatar }: Irequest): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError('Only users can change the avatar', 401);
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const savedAvatar = await this.storageProvider.saveFile(avatar);
        user.avatar = savedAvatar;
        await this.userRepository.save(user);
        delete user.password;

        return user;
    }
}
