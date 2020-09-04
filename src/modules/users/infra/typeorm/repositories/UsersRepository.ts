import { Repository, getRepository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dto/ICreateUserDTO';
import IFoundAllProvidersDTO from '@modules/users/dto/IFoundAllProvidersDTO';

export default class UserRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const userFound = await this.ormRepository.findOne(id);
        return userFound;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const userFound = await this.ormRepository.findOne({
            where: { email },
        });
        return userFound;
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const userCreated = this.ormRepository.create({
            name,
            email,
            password,
        });

        const user = await this.save(userCreated);

        return user;
    }

    public async findAllProviders({
        exceptUserId,
    }: IFoundAllProvidersDTO): Promise<User[]> {
        if (exceptUserId) {
            return this.ormRepository.find({
                where: { id: Not(exceptUserId) },
            });
        }
        return this.ormRepository.find();
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}
