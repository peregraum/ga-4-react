import React from 'react';
import { GA4Config, GA4ManagerOptionsInterface } from '../models/gtagModels';
export interface IGA4R {
    code: string;
    timeout?: number;
    config?: GA4Config;
    additionalCode?: Array<string>;
    children?: any;
    options?: GA4ManagerOptionsInterface;
}
export declare const GA4R: React.FC<IGA4R>;
export default GA4R;
