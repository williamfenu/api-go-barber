import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.user;
        const { providerId, date } = request.body;

        const createAppointment = container.resolve(CreateAppointmentService);
        const appointment = await createAppointment.execute({
            providerId,
            userId: id,
            date,
        });
        return response.json(appointment);
    }
}
