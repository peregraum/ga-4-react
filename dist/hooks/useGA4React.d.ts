import { GA4Config, GA4ManagerOptionsInterface, GA4ReactResolveInterface } from '../models/gtagModels';
export declare const useGA4React: (gaCode?: string | undefined, gaConfig?: object | GA4Config | undefined, gaAdditionalCode?: string[] | undefined, gaTimeout?: number | undefined, options?: GA4ManagerOptionsInterface | undefined) => GA4ReactResolveInterface | void;
