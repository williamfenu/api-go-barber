import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
    private files: string[] = [];

    public async saveFile(filename: string): Promise<string> {
        this.files.push(filename);
        return filename;
    }

    public async deleteFile(filename: string): Promise<void> {
        const index = this.files.findIndex(file => file === filename);

        this.files.splice(index, 1);
    }
}
