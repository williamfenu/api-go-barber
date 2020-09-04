import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { day, month, providerId, year } = request.body;
        const listProviderDayAvailability = container.resolve(
            ListProviderDayAvailabilityService,
        );

        const dayAvailability = await listProviderDayAvailability.execute({
            day,
            month,
            providerId,
            year,
        });

        return response.json(dayAvailability);
    }
}
