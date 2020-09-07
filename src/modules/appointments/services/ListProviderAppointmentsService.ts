import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
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

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository')
        appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        cacheProvider: ICacheProvider,
    ) {
        this.appointmentRepository = appointmentsRepository;
        this.cacheProvider = cacheProvider;
    }

    public async execute({
        year,
        day,
        month,
        providerId,
    }: IRequest): Promise<Appointment[]> {
        const appointmentCacheKey = `provider-appointments:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(
            appointmentCacheKey,
        );

        if (!appointments) {
            appointments = await this.appointmentRepository.findAllInDayFromProvider(
                {
                    year,
                    day,
                    month,
                    providerId,
                },
            );
            this.cacheProvider.save(
                appointmentCacheKey,
                classToClass(appointments),
            );
        }

        return appointments;
    }
}
