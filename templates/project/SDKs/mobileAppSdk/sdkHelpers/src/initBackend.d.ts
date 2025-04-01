import { SdkInitOptions } from '../../backend-sdk-helpers';
export type InitBackendConfig<AppConfig> = {
    projectName: string;
    onLogout?(): void | Promise<void>;
    getDeviceId(): string | Promise<string>;
    onBackendInitialized?(): any | Promise<string>;
    refreshTokenExpirationMinutes?: number;
    refreshTokenErrorMessage?: string;
    wrongTokenErrorMessage?: string;
} & SdkInitOptions<AppConfig>;
export declare function initBackend<AppConfig>(config: InitBackendConfig<AppConfig>): void;
export declare function isBackendInitialized(): boolean;
export declare function getBackendConfig(): InitBackendConfig<any>;
