export declare function logout(): Promise<void>;
export declare function setAccessToken(accessToken?: string): void;
/** This will try to connect without login if refresh token is still valid. If not, this will logout the user */
export declare function ensureAccessToken(): Promise<{
    success: boolean;
}>;
