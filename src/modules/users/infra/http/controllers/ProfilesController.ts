import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfilesController {
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const profileService = container.resolve(ShowProfileService);

        const user = await profileService.execute({ userId: id });
        return response.json({ user: classToClass(user) });
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { userId, name, email, oldPassword, password } = request.body;
        const profileService = container.resolve(UpdateProfileService);

        const updatedUser = await profileService.execute({
            userId,
            name,
            email,
            oldPassword,
            password,
        });
        return response.json({ user: classToClass(updatedUser) });
    }
}
