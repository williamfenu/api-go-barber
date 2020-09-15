import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface Irequest {
    userId: string;
}

@injectable()
export default class ListProvidersService {
    private userRepository: IUserRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,

        @inject('CacheProvider')
        cacheProvider: ICacheProvider,
    ) {
        this.userRepository = userRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute({ userId }: Irequest): Promise<User[]> {
        let providers = await this.cacheProvider.recover<User[]>(
            `providers-list:${userId}`,
        );

        if (!providers) {
            providers = await this.userRepository.findAllProviders({
                exceptUserId: userId,
            });

            this.cacheProvider.save(
                `providers-list:${userId}`,
                classToClass(providers),
            );
        }

        return providers;
    }
}
