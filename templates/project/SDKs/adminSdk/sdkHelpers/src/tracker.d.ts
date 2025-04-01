import { StandardEvent } from '../../shared/constants';
type Event = {
    type: string;
    project: string;
    session: any;
    ts: number;
    data: ObjectGeneric;
    error: string;
    device?: string;
};
type InitTrackerConfig = {
    projectName: string;
    getDeviceId(): string | Promise<string>;
};
/** Initialize tracker with passing mandatory configs, this should be called AFTER BACKEND INIT */
export declare const initTrackerData: (config: InitTrackerConfig) => void;
/** Send events, for navigation, please use 'navigate' event with providing a screen so that all further events will be recorded on that screen */
export declare function trackerEvent(evtName: 'error', payload: Record<string, any> & {
    errMsg: string;
    errorId: string;
}): any;
export declare function trackerEvent(evtName: 'navigate', payload: Record<string, any> & {
    screen: string;
}): any;
export declare function trackerEvent(evtName: 'sessionStart', payload: Record<string, any> & {
    utmCampaignId: string;
    timeZone: number;
    screen: string;
}): any;
export declare function trackerEvent(evtName: 'componentVisible' | 'componentHidden', payload: Record<string, any> & {
    componentId: string;
}): any;
export declare function trackerEvent(evtName: StandardEvent, payload?: Record<string, any>): any;
export declare function sendDataToServer(): Promise<void>;
export declare const getActualScreen: () => string;
export declare const getEventCache: () => Event[];
export { };
