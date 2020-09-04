import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let listProviderDayAvailability: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProvidersDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('Should be able to list the provider day availability', async () => {
        await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 7, 4, 12, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'user',
            date: new Date(2020, 7, 4, 14, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 7, 4, 10).getTime(),
        );

        const availability = await listProviderDayAvailability.execute({
            providerId: 'provider',
            month: 8,
            year: 2020,
            day: 4,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, availability: false },
                { hour: 9, availability: false },
                { hour: 10, availability: false },
                { hour: 11, availability: true },
                { hour: 12, availability: false },
                { hour: 13, availability: true },
                { hour: 14, availability: false },
            ]),
        );
    });
});
