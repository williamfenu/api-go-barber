import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
    public async generateHash(word: string): Promise<string> {
        return word;
    }

    public async compareHash(
        word: string,
        hashedWord: string,
    ): Promise<boolean> {
        return word === hashedWord;
    }
}
