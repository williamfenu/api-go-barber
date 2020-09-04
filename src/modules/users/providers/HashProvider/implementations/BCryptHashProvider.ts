import { hash, compare } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
    public async generateHash(word: string): Promise<string> {
        const hashedWord = await hash(word, 8);

        return hashedWord;
    }

    public async compareHash(
        word: string,
        hashedWord: string,
    ): Promise<boolean> {
        const isValid = await compare(word, hashedWord);

        return isValid;
    }
}
