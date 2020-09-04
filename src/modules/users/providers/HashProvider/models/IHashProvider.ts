export default interface IHashProvider {
    generateHash(word: string): Promise<string>;
    compareHash(word: string, hashedWord: string): Promise<boolean>;
}
