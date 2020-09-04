import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface Irequest {
    userId: string;
}

@injectable()
export default class ListProvidersService {
    private userRepository: IUserRepository;

    constructor(
        @inject('UsersRepository')
        userRepository: IUserRepository,
    ) {
        this.userRepository = userRepository;
    }

    public async execute({ userId }: Irequest): Promise<User[]> {
        const providers = await this.userRepository.findAllProviders({
            exceptUserId: userId,
        });

        return providers;
    }
}
