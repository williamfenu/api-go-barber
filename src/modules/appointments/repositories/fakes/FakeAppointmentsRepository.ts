import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dto/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dto/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dto/IFindAllInDayFromProviderDTO';

export default class AppointmentRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const appointmentIndex = this.appointments.find(
            appointment =>
                isEqual(date, appointment.date) &&
                appointment.providerId === providerId,
        );

        return appointmentIndex;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            const appointmentDate = appointment.date;
            return (
                appointment.providerId === providerId &&
                getMonth(appointmentDate) + 1 === month &&
                getYear(appointmentDate) === year
            );
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        month,
        year,
        day,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            const appointmentDate = appointment.date;
            return (
                appointment.providerId === providerId &&
                getDate(appointmentDate) === day &&
                getMonth(appointmentDate) + 1 === month &&
                getYear(appointmentDate) === year
            );
        });

        return appointments;
    }

    public async create({
        providerId,
        userId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();
        Object.assign(appointment, { id: uuid(), date, providerId, userId });

        this.appointments.push(appointment);

        return appointment;
    }
}
