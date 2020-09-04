import IParseMailProvider from '@shared/container/providers/TemplateMailProvider/dtos/IParseMailProvider';

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailProvider;
}
