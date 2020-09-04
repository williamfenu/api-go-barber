import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandleBarsProvider from './implementations/HandleBarsProvider';

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandleBarsProvider,
);
