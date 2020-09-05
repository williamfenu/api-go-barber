import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUserRepository,
            fakeCacheProvider,
        );
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

    it('Should not call the user repository if the providers are in cache', async () => {
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

        await fakeCacheProvider.save(
            `providers-list:${provider2.id}`,
            provider1,
        );

        const recover = jest.spyOn(fakeCacheProvider, 'recover');
        const findAllProviders = jest.spyOn(
            fakeUserRepository,
            'findAllProviders',
        );

        await listProviders.execute({
            userId: provider2.id,
        });
        expect(recover).toBeCalledTimes(1);
        expect(findAllProviders).toBeCalledTimes(0);
    });
});
