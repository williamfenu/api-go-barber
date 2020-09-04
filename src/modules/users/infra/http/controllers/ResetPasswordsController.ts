import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordsService {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { password, token } = request.body;
        const resetPasswordsService = container.resolve(ResetPasswordService);

        await resetPasswordsService.execute({ password, token });
        return response.status(204).send();
    }
}
