export type Device = {
    'user'?: string;
    'deviceName': string;
    'deviceType': 'desktop' | 'mobile' | 'tablet' | 'unknown';
    'os'?: 'ios' | 'macos' | 'linux' | 'windows' | 'android' | 'other';
    'browser'?: 'firefox' | 'chrome' | 'safari' | 'other' | 'opera' | 'edge' | 'internetExplorer';
    'pixelHeight'?: number;
    'pixelWidth'?: number;
    'language'?: string;
    'deviceInfos'?: {};
    '_id': string;
};
export declare function getDeviceInfos(): Device;
