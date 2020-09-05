import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it('Should be able to list the provider appointments in Day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 7, 4, 12, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 7, 4, 14, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 7, 4, 10).getTime(),
        );

        const availability = await listProviderAppointments.execute({
            providerId: 'provider',
            month: 8,
            year: 2020,
            day: 4,
        });

        expect(availability).toEqual([appointment1, appointment2]);
    });

    it('Should not call the appointment repository if the provider appointments are in cache', async () => {
        const appointment = await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 6, 3, 14, 0, 0),
        });
        await fakeCacheProvider.save('provider-appointments:2020-6-3', [
            appointment,
        ]);

        const recover = jest.spyOn(fakeCacheProvider, 'recover');
        const findAllInDayFromProvider = jest.spyOn(
            fakeAppointmentsRepository,
            'findAllInDayFromProvider',
        );

        await listProviderAppointments.execute({
            providerId: appointment.providerId,
            day: appointment.date.getDate(),
            month: appointment.date.getMonth(),
            year: appointment.date.getFullYear(),
        });

        expect(recover).toBeCalledTimes(1);
        expect(findAllInDayFromProvider).toBeCalledTimes(0);
    });
});
