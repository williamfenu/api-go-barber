import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { month, providerId, year } = request.body;
        const listProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        const monthAvailability = await listProviderMonthAvailability.execute({
            month,
            providerId,
            year,
        });

        return response.json(monthAvailability);
    }
}
