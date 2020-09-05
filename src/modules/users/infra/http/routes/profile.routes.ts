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
            userId: Joi.string().uuid().required(),
            email: Joi.string().email().required(),
            password: Joi.string(),
            oldPassword: Joi.string(),
            confirmationPassword: Joi.string().valid(Joi.ref('password')),
        },
    }),
    profilesController.update,
);

export default userRoutes;
