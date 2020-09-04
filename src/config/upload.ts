import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');
const uploadDirectory = path.resolve(tmpDirectory, 'uploads');

interface IUploadConfig {
    driver: 'disk' | 's3';
    tmpDirectory: string;
    uploadDirectory: string;
    multer: {
        storage: StorageEngine;
    };
    config: {
        disk: any;
        aws: {
            bucket: string;
        };
    };
}

export default {
    driver: process.env.STORAGE_DRIVER || 's3',

    tmpDirectory,

    uploadDirectory,

    multer: {
        storage: multer.diskStorage({
            destination: tmpDirectory,
            filename(request, file, callback) {
                const hashedName = crypto.randomBytes(10).toString('hex');
                const fileName = `${hashedName}-${file.originalname}`;

                return callback(null, fileName);
            },
        }),
    },

    config: {
        disk: {},
        aws: {
            bucket: process.env.AWS_BUCKET,
        },
    },
} as IUploadConfig;
