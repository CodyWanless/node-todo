import { IAccessToken } from "../interfaces/access-token";
import { GoogleAccessToken } from "./google-access-token";
import { LocalAccessToken } from "./local-access-token";
import { raw } from "body-parser";

export default (rawToken: any): IAccessToken => {
    if (!rawToken) {
        throw new Error('rawToken cannot be null');
    }

    switch (rawToken.strategy) {
        case 'google':
            return new GoogleAccessToken(rawToken.token);
        case 'local':
            return new LocalAccessToken(rawToken.access, rawToken.token)
        default:
            throw new Error('Strategy not supported');
    }
};