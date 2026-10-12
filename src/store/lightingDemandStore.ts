import { uniqueId } from 'lodash';
import { defineStore } from 'pinia';

const lightingDemandStore = defineStore('lightingDemand', {
    state() {
        return {
            loading: false,
            id: '123123',
            weekday: null,
            lightingType: null,
            calendarTag: null,
            instanceItem: {
                id: null,
                instanceType: null
            },
            pageIsEdit: false,
            enableLuxFeedbackAdjust: null
        };
    },
    getters: {
        getId(state) {
            return state.id;
        }
    },
    actions: {
        setId() {
            this.id = uniqueId('component-id-');
        },
        closeLoading(id: string) {
            if (this.id === id) {
                this.loading = false;
            }
        },
        // 日历类型
        // updateWeekday(val:any){
        //   this.weekday=val.id
        // },
        // 照明类型-公共照明、夜景照明
        updateLightingType(val: any) {
            this.lightingType = val.id;
        },
        //
        updateCalendarTag(val: any) {
            this.calendarTag = val.id;
        },
        updateInstanceItem(val: any) {
            this.instanceItem = val;
        },
        // 照明类型-公共照明、夜景照明
        updatePageIsEdit(val: any) {
            this.pageIsEdit = val;
        },
        // 基础配置照明反馈调节
        updateEnableLuxFeedbackAdjust(val: any) {
            this.enableLuxFeedbackAdjust = val;
        }
    }
});

export default lightingDemandStore;
