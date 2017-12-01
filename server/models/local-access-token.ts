import * as jwt from 'jsonwebtoken';

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

    public verify(): boolean {
        try {
            jwt.verify(this.token, process.env.JWT_SECRET as string);
        } catch (e) {
            return false;
        }

        return true;
    }
}