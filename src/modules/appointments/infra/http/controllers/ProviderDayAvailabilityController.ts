import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { providerId } = request.params;
        const { day, month, year } = request.query;
        const listProviderDayAvailability = container.resolve(
            ListProviderDayAvailabilityService,
        );

        const dayAvailability = await listProviderDayAvailability.execute({
            day: Number(day),
            month: Number(month),
            providerId,
            year: Number(year),
        });

        return response.json(dayAvailability);
    }
}
