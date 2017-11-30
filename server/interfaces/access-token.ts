export interface IAccessToken {
    access: string;
    token: string;
    strategy: string;
    verify(): boolean;
}