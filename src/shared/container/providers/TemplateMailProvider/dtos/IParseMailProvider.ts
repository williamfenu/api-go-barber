interface variablesMailProvider {
    [key: string]: string;
}

export default interface IParseMailProvider {
    file: string;
    variables: variablesMailProvider;
}
