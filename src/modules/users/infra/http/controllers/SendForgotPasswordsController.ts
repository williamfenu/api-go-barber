import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ForgotPasswordService from '@modules/users/services/SendForgotPasswordEmailService';

export default class SendForgotPasswordController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;
        const forgotPasswordService = container.resolve(ForgotPasswordService);

        await forgotPasswordService.execute({ email });
        return response.status(204).send();
    }
}
