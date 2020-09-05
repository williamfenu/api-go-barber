import AppError from '@shared/errors/AppError';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let createAppointment: CreateAppointmentService;
let fakeAppointment: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationRepository: FakeNotificationRepository;
let nowPlusOneDay: Date;

describe('CreateAppointments', () => {
    beforeEach(() => {
        nowPlusOneDay = new Date();
        nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1);
        nowPlusOneDay.setHours(12, 0, 0);

        fakeAppointment = new FakeAppointmentsRepository();
        fakeNotificationRepository = new FakeNotificationRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointment,
            fakeNotificationRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        const newAppointment = await createAppointment.execute({
            date: nowPlusOneDay,
            providerId: 'provider',
            userId: 'user',
        });

        expect(newAppointment).not.toBeNull();
        expect(newAppointment).toHaveProperty('id');
        expect(newAppointment.providerId).toBe('provider');
        expect(newAppointment.userId).toBe('user');
    });

    it('should not book an appointment in the same date time', async () => {
        await createAppointment.execute({
            date: nowPlusOneDay,
            providerId: 'provider',
            userId: 'user',
        });

        await expect(
            createAppointment.execute({
                date: nowPlusOneDay,
                providerId: 'provider',
                userId: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not book an appointment in the past date time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 4, 3, 11, 0, 0).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: new Date(2020, 3, 3, 11, 0, 0),
                providerId: 'provider',
                userId: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not book an appointment as user as well provider', async () => {
        await expect(
            createAppointment.execute({
                date: nowPlusOneDay,
                providerId: 'provider',
                userId: 'provider',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment before 8am and after 5pm', async () => {
        nowPlusOneDay.setHours(7, 0, 0);

        await expect(
            createAppointment.execute({
                date: nowPlusOneDay,
                providerId: 'provider',
                userId: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);

        nowPlusOneDay.setHours(18, 0, 0);

        await expect(
            createAppointment.execute({
                date: nowPlusOneDay,
                providerId: 'provider',
                userId: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
