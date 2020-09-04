import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '../../infra/typeorm/entities/UserToken';

export default class FakeUserToken implements IUserTokensRepository {
    private userTokens: UserToken[] = [];

    public async generate(userId: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            userId,
            createdAt: new Date(),
            updatedAd: new Date(),
        });

        this.userTokens.push(userToken);
        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.userTokens.find(userToken => userToken.token === token);
    }
}
