import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter, endOfDay } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    availability: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
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
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentRepository.findAllInMonthFromProvider(
            {
                providerId,
                month,
                year,
            },
        );

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const availability = eachDayArray.map(day => {
            const compareDate = endOfDay(new Date(year, month - 1, day));
            const appointmentsInDay = appointments.filter(
                appointment => getDate(appointment.date) === day,
            );
            return {
                day,
                availability:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}
