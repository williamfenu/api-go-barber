import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    providerId: string;
    userId: string;
    date: Date;
}

@injectable()
export default class CreateRepositoryService {
    private appointmentRepository: IAppointmentsRepository;

    private notificationRepository: INotificationsRepository;

    constructor(
        @inject('AppointmentsRepository')
        appointmentRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        notificationRepository: INotificationsRepository,
    ) {
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    public async execute({
        providerId,
        userId,
        date,
    }: Request): Promise<Appointment> {
        if (providerId === userId) {
            throw new AppError(
                'A provider cannot book an appointment with yourself',
            );
        }

        const formatedDate = startOfHour(date);

        if (isBefore(formatedDate, Date.now())) {
            throw new AppError('You cannot book an appointment in a past date');
        }

        if (getHours(formatedDate) < 8 || getHours(formatedDate) > 17) {
            throw new AppError(
                'You cannot book an appointment before 8am or after 17pm',
            );
        }

        const findAppointInSameHour = await this.appointmentRepository.findByDate(
            formatedDate,
        );

        if (findAppointInSameHour) {
            throw new AppError('The appointment has already booked');
        }

        const appointment = await this.appointmentRepository.create({
            providerId,
            userId,
            date: formatedDate,
        });

        const parsedDate = format(formatedDate, "dd/MM/yyyy 'ás' HH:mm'h'");

        this.notificationRepository.create({
            recipientId: providerId,
            content: `Um novo agendamento foi marcado para ${parsedDate}`,
        });
        return appointment;
    }
}
