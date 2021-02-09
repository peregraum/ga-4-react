import React from 'react';
import { GA4Config, GA4ManagerOptionsInterface } from '../models/gtagModels';
export interface GA4WithTrackerComponentInterface {
    path: string | Location;
    location?: string | Location;
    title?: string;
    gaCode?: string;
    gaConfig?: GA4Config | object;
    additionalCode?: Array<string>;
    timeout?: number;
    options?: GA4ManagerOptionsInterface;
}
export declare function withTracker(MyComponent: React.FC<any>): React.FC<GA4WithTrackerComponentInterface>;
export default withTracker;
