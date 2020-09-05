import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureUserAuthentication from '@modules/users/infra/http/middleware/ensureUserAuthentication';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentRoutes = Router();

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentRoutes.use(ensureUserAuthentication);

appointmentRoutes.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            providerId: Joi.string().uuid().required(),
            date: Joi.date(),
        },
    }),
    appointmentsController.create,
);
appointmentRoutes.get('/me', providerAppointmentsController.index);

export default appointmentRoutes;
