interface IMailDriveOptions {
    driver: 'ethereal' | 'ses';
    default: {
        name: string;
        email: string;
    };
}

const mail = {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    default: {
        name: 'Equipe GoBarber',
        email: 'admin@williamferreira.dev.br',
    },
} as IMailDriveOptions;

export default mail;
