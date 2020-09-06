import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { providerId } = request.params;
        const { month, year } = request.query;
        const listProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        const monthAvailability = await listProviderMonthAvailability.execute({
            month: Number(month),
            providerId,
            year: Number(year),
        });

        return response.json(monthAvailability);
    }
}
