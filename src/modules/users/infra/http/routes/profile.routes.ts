import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureUserAuthentication from '@modules/users/infra/http/middleware/ensureUserAuthentication';
import ProfilesController from '../controllers/ProfilesController';

const userRoutes = Router();

userRoutes.use(ensureUserAuthentication);

const profilesController = new ProfilesController();

userRoutes.get('/', profilesController.show);
userRoutes.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            name: Joi.string().required(),
            password: Joi.string().allow('').optional(),
            oldPassword: Joi.string().allow('').optional(),
            confirmationPassword: Joi.string().valid(Joi.ref('password')),
        },
    }),
    profilesController.update,
);

export default userRoutes;
