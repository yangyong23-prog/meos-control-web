// @ts-ignore
import i18n from '@/localization';
/*
 * @Author: wuyangyang
 * @Date: 2024-01-17 16:11:42
 * @LastEditors: wuyangyang
 * @LastEditTime: 2024-01-25 10:23:50
 * @Description:
 */
export interface ListItem {
    value: string;
    id: string;
    openValue?: string;
    closeValue?: string;
}
export interface Params {
    coolingSeasonDateRangeList: ListItem[]; // 供冷季
    heatingSeasonDateRangeList: ListItem[]; // 采暖季
    shopCelebrationDateRangeList: ListItem[]; // 店庆日
    weeks: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'[]; // 工作日
}
