import { compile } from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailProvider from '../dtos/IParseMailProvider';

export default class HandleBarsProvider implements IMailTemplateProvider {
    public async parse({
        file,
        variables,
    }: IParseMailProvider): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const parsedTemplate = compile(templateFileContent);

        return parsedTemplate(variables);
    }
}
