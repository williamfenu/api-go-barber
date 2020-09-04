import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import ITemplateEmailProvider from '@shared/container/providers/TemplateMailProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    private templateProvider: ITemplateEmailProvider;

    constructor(
        @inject('MailTemplateProvider')
        templateProvider: ITemplateEmailProvider,
    ) {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
            this.client = transporter;
            this.templateProvider = templateProvider;
        });
    }

    public async sendMail({
        from,
        to,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name ?? 'Equipe GoBaber',
                address: from?.email ?? 'equipe@gobarber.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.templateProvider.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
