import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
    public async saveFile(filename: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpDirectory, filename),
            path.resolve(uploadConfig.uploadDirectory, filename),
        );

        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadDirectory, filename);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}
