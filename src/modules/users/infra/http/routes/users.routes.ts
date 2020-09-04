import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';

import ensureUserAuthentication from '@shared/infra/http/middleware/ensureUserAuthentication';
import UsersController from '../controllers/UsersController';
import AvatarUserController from '../controllers/AvatarUserController';

const userRoutes = Router();

const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const avatarUserController = new AvatarUserController();

userRoutes.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

userRoutes.patch(
    '/avatar',
    ensureUserAuthentication,
    upload.single('avatar'),
    avatarUserController.update,
);

export default userRoutes;
