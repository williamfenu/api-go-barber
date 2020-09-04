import ICreateAppointmentDTO from '../dto/ICreateAppointmentDTO';
import Appointment from '../infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProviderDTO from '../dto/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dto/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProviderDTO,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviderDTO,
    ): Promise<Appointment[]>;
}
