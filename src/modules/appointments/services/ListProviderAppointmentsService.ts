import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    year: number;
    month: number;
    day: number;
    providerId: string;
}

@injectable()
export default class ListProviderAppointmentsService {
    private appointmentRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentsRepository: IAppointmentsRepository,
    ) {
        this.appointmentRepository = appointmentsRepository;
    }

    public async execute({
        year,
        day,
        month,
        providerId,
    }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentRepository.findAllInDayFromProvider(
            {
                year,
                day,
                month,
                providerId,
            },
        );

        return appointments;
    }
}
