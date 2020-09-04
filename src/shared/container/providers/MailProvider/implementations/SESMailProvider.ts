import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import mail from '@config/mail';
import ITemplateEmailProvider from '@shared/container/providers/TemplateMailProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;

    private templateProvider: ITemplateEmailProvider;

    constructor(
        @inject('MailTemplateProvider')
        templateProvider: ITemplateEmailProvider,
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
            }),
        });
        this.templateProvider = templateProvider;
    }

    public async sendMail({
        from,
        to,
        subject,
        templateData,
    }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name ?? mail.default.name,
                address: from?.email ?? mail.default.email,
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
