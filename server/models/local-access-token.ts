import { IAccessToken } from "../interfaces/access-token";

export class LocalAccessToken implements IAccessToken {
    public readonly access: string;
    public readonly token: string;
    public readonly strategy: string;

    constructor(access: string, token: string) {
        this.token = token;
        this.access = access;
        this.strategy = 'local';
    }
}