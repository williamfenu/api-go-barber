import ICreateUserDTO from '@modules/users/dto/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';
import IFoundAllProvidersDTO from '../dto/IFoundAllProvidersDTO';

export default interface IUsersRepository {
    findAllProviders({ exceptUserId }: IFoundAllProvidersDTO): Promise<User[]>;
    create(user: ICreateUserDTO): Promise<User>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    save(user: User): Promise<User>;
}
