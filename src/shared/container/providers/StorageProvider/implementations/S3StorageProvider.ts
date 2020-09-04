import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3();
    }

    public async saveFile(filename: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpDirectory, filename);

        const file = await fs.promises.readFile(originalPath);
        const contentType = mime.getType(originalPath);

        if (!contentType) {
            throw new Error('file not found');
        }

        await this.client
            .putObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: filename,
                ACL: 'public-read',
                Body: file,
                ContentType: contentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: uploadConfig.config.aws.bucket,
                Key: filename,
            })
            .promise();
    }
}
