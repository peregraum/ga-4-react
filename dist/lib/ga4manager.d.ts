import { GA4Config, GA4ManagerOptionsInterface, GA4ReactInterface, GA4ReactResolveInterface, gtagAction, gtagCategory, gtagFunction, gtagLabel } from '../models/gtagModels';
export declare const GA4ReactGlobalIndex = "__ga4React__";
declare global {
    interface Window {
        gtag: gtagFunction | Function;
        __ga4React__: GA4ReactResolveInterface;
    }
}
/**
 * @desc class required to manage google analitycs 4
 * @class GA4React
 *  */
export declare class GA4React implements GA4ReactInterface {
    private gaCode;
    private gaConfig?;
    private additionalGaCode?;
    private timeout?;
    private options?;
    private scriptSyncId;
    private scriptAsyncId;
    private nonceAsync;
    private nonceSync;
    constructor(gaCode: string, gaConfig?: GA4Config | undefined, additionalGaCode?: string[] | undefined, timeout?: number | undefined, options?: GA4ManagerOptionsInterface | undefined);
    /**
     * @desc output on resolve initialization
     */
    private outputOnResolve;
    /**
     * @desc Return main function for send ga4 events, pageview etc
     * @returns {Promise<GA4ReactResolveInterface>}
     */
    initialize(): Promise<GA4ReactResolveInterface>;
    /**
     * @desc send pageview event to gtag
     * @param path
     */
    pageview(path: string | Location, location?: string | Location, title?: string): any;
    /**
     * @desc set event and send to gtag
     * @param action
     * @param label
     * @param category
     * @param nonInteraction
     */
    event(action: gtagAction, label: gtagLabel, category: gtagCategory, nonInteraction?: boolean): any;
    /**
     * @desc direct access to gtag
     * @param args
     */
    gtag(...args: any): any;
    /**
     * @desc ga is initialized?
     */
    static isInitialized(): boolean;
    /**
     * @desc get ga4react from global
     */
    static getGA4React(): GA4ReactResolveInterface | void;
}
export default GA4React;
