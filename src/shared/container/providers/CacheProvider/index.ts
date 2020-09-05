import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';
import RadisCacheProvider from './implementations/RadisCacheProvider';

const providers = {
    redis: container.resolve(RadisCacheProvider),
};

container.registerInstance<ICacheProvider>('CacheProvider', providers.redis);
