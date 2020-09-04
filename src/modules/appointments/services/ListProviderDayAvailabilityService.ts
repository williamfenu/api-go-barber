import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    availability: boolean;
}>;

@injectable()
export default class ListDayAvailabilityService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
    }

    public async execute({
        providerId,
        month,
        year,
        day,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findAllInDayFromProvider(
            {
                providerId,
                month,
                year,
                day,
            },
        );

        const startHour = 8;
        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + startHour,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hourBooked = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);
            return {
                hour,
                availability: !hourBooked && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}
