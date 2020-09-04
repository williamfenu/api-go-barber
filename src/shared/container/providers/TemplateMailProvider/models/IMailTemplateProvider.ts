import IParseMailProvider from '../dtos/IParseMailProvider';

export default interface IMailProvider {
    parse(data: IParseMailProvider): Promise<string>;
}
