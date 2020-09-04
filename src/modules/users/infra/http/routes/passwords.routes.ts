import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SendForgotPasswordController from '../controllers/SendForgotPasswordsController';
import ResetPasswordsController from '../controllers/ResetPasswordsController';

const routes = Router();

const sendForgotPasswordController = new SendForgotPasswordController();
const resetPasswordsController = new ResetPasswordsController();

routes.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    sendForgotPasswordController.create,
);
routes.post(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            password: Joi.string().required(),
            token: Joi.string().uuid().required(),
            confirmationPassword: Joi.string()
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    resetPasswordsController.create,
);

export default routes;
