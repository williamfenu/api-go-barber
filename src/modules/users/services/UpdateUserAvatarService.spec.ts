import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUserRepository: FakeUserRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeStorageProvider = new FakeStorageProvider();
        fakeUserRepository = new FakeUserRepository();
        updateUserAvatar = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );
    });

    it('it should be able to update the avatar', async () => {
        const createdUser = await fakeUserRepository.create({
            name: 'Jane doe',
            email: 'jane@example.com',
            password: '29398392832',
        });
        const updatedUser = await updateUserAvatar.execute({
            userId: createdUser.id,
            avatar: 'avatar.jpg',
        });

        expect(updatedUser.avatar).toBe('avatar.jpg');
    });

    it('it should not be able to update the avatar without valid user', async () => {
        await expect(
            updateUserAvatar.execute({
                userId: 'non-existing-id',
                avatar: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('It should delete the old avatar before update the new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const createdUser = await fakeUserRepository.create({
            name: 'Jane doe',
            email: 'jane@example.com',
            password: '29398392832',
        });

        await updateUserAvatar.execute({
            userId: createdUser.id,
            avatar: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            userId: createdUser.id,
            avatar: 'avatar2.jpg',
        });

        expect(deleteFile).toBeCalledWith('avatar.jpg');
    });
});
