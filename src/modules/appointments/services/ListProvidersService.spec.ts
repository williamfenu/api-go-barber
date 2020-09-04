import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';

import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();

        listProviders = new ListProvidersService(fakeUserRepository);
    });

    it('Should be able to list all providers except the logged one', async () => {
        const provider1 = await fakeUserRepository.create({
            name: 'John Doe',
            email: 'doe@example.com.br',
            password: '123456',
        });

        const provider2 = await fakeUserRepository.create({
            name: 'Dexter',
            email: 'dexter@example.com.br',
            password: '123456',
        });

        const loggedUser = await fakeUserRepository.create({
            name: 'Jack Sparrow',
            email: 'sparrow@example.com.br',
            password: '123456',
        });

        const providers = await listProviders.execute({
            userId: loggedUser.id,
        });

        expect(providers).toEqual([provider1, provider2]);
    });
});
