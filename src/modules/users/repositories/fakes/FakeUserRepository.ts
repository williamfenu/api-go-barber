import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dto/ICreateUserDTO';
import IFoundAllProvidersDTO from '../../dto/IFoundAllProvidersDTO';

export default class UserRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();
        Object.assign(user, { id: uuid(), name, email, password });

        this.users.push(user);

        return user;
    }

    public async findAllProviders({
        exceptUserId,
    }: IFoundAllProvidersDTO): Promise<User[]> {
        if (exceptUserId) {
            return this.users.filter(user => user.id !== exceptUserId);
        }
        return this.users;
    }

    public async save(user: User): Promise<User> {
        const userIndex = this.users.findIndex(
            savedUser => savedUser.id === user.id,
        );

        this.users[userIndex] = user;

        return user;
    }
}
