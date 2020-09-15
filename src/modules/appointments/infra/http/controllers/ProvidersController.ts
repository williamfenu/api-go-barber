import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProfilesController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.user;
        const providersService = container.resolve(ListProvidersService);

        const providers = await providersService.execute({ userId: id });
        return response.json(classToClass(providers));
    }
}
