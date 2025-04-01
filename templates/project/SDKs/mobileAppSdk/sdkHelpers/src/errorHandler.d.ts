import { Device } from './device.web';
export declare function initErrorHandler<ErrorConfig>(config: HandleErrorBaseConfig<ErrorConfig>): void;
export type HandleErrorBaseConfig<ErrorConfig = {}> = {
    getUserId?(): MaybePromise<string>;
    getDeviceInfos?(): Device;
    getActualScreen?(): string;
    onError?(errorDescriptionObject: ErrorDescriptionObject & ErrorConfig): MaybePromise<any>;
    genericErrorMessage: string;
};
type ErrorDescriptionObject<ErrorConfig = any> = {
    msg: string;
    errorId: string;
    error: any;
} & HandleErrorConfig<ErrorConfig>;
export type HandleErrorConfig<ErrorConfig = any> = {
    /** Message that may be displayed to user if any */
    msgToDisplayToUser?: string;
    /** Which actions are proposed to user, those actions shall
     * be implemented for each project in the onError() callback
     * when initiating error handler */
    userActionChoice?: 'contactSupport';
    /** This will enable reporting the error directly to the tech team trough teams channel */
    isUnexpectedError?: boolean;
    /** Is the error supposed to logout the user ? */
    logoutUser?: boolean;
    /** Any contextual infos that you can provide should be there */
    extraInfos?: Record<string, any>;
    /** Placeholder */
    displayMessageToUser?: any;
} & ErrorConfig;
/** Use this function to inject the right custom type to the third param of handleError() */
export declare function getHandleErrorTyped<ErrorConfig>(): (error: any, msg: string, config: HandleErrorConfig<ErrorConfig>) => void;
/** This function will:
 * * Take the most out of the error
 * * put isHandled prop to true it has not been done (see backend.svc errors)
 * * handle proper logging
 * * sendErrorToBackend if it's an unexpected one
 * * logout the user if configured
 */
export declare function handleError(error: any, msg: string, config: HandleErrorConfig): Promise<void>;
export {};
