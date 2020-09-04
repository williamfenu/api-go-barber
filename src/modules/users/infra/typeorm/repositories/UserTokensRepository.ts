import { Repository, getRepository } from 'typeorm';

import IUserToken from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

export default class UserTokenRepository implements IUserToken {
    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const foundUserToken = await this.ormRepository.findOne({
            where: { token },
        });

        return foundUserToken;
    }

    public async generate(userId: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({ userId });

        const savedUserToken = await this.ormRepository.save(userToken);

        return savedUserToken;
    }
}
