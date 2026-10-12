import { TabList } from '../../../types/common';
export interface BoxList extends TabList {
    id: string;
    tip: string;
    img: string;
    activeImg: string;
    style?: any;
}
