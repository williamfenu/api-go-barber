import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
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
});
