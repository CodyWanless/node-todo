import { IAccessToken } from "../interfaces/access-token";

export class GoogleAccessToken implements IAccessToken {
    public readonly access: string;
    public readonly token: string;
    public readonly strategy: string;

    constructor(token: string) {
        this.token = token;
        this.access = 'auth';
        this.strategy = 'google';
    }

    public verify(): boolean {
        return this.token.length > 0;
    }
}