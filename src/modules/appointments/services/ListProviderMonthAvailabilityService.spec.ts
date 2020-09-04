import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProvidersMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('Should be able to list the provider month availability', async () => {
        const startHour = 8;

        for (let index = 0; startHour + index <= 18; index++) {
            await fakeAppointmentsRepository.create({
                providerId: 'provider',
                userId: 'userId',
                date: new Date(2020, 6, 3, startHour + index, 0, 0),
            });
        }

        await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'userId',
            date: new Date(2020, 6, 4, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            providerId: 'provider',
            userId: 'userId',
            date: new Date(2020, 7, 4, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            providerId: 'provider',
            month: 7,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 3, availability: false },
                { day: 4, availability: true },
            ]),
        );
    });
});
