import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureUserAuthentication from '@shared/infra/http/middleware/ensureUserAuthentication';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providersRoutes = Router();

const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRoutes.use(ensureUserAuthentication);

providersRoutes.get('/', providersController.index);
providersRoutes.get(
    ':providerId/dayavailability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required(),
        },
    }),
    providerDayAvailabilityController.index,
);
providersRoutes.get(
    ':providerId/dayavailability/monthavailability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required(),
        },
    }),
    providerMonthAvailabilityController.index,
);

export default providersRoutes;
