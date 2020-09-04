import ITemplateMailProvider from '../models/IMailTemplateProvider';

export default class FakeTemplateMailProvider implements ITemplateMailProvider {
    public async parse(): Promise<string> {
        return 'Mail content';
    }
}
