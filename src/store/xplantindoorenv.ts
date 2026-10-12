// @ts-ignore
import i18n from '@/localization';
import { defineStore } from 'pinia';

const xplantindoorenvStore = defineStore('xplantindoorenv', {
    state() {
        return {
            infoCode: 'tdb', // 当前选中的为温度/二氧化碳
            floorId: '', // 当前选中的楼层ID
            floorName: '', // 当前选中的楼层Name
            leftInfoList: [
                // 左侧tab列表
                {
                    id: 'tdb',
                    name: i18n.global.t('meos_control_web.temperature'),
                    icon: 'temperature',
                    unit: '℃'
                },
                {
                    id: 'cO2',
                    name: 'CO₂',
                    icon: 'CO₂',
                    unit: 'ppm'
                }
            ],
            isShowHistoryPlay: false, // 是否显示历史回放
            historyDate: '', // 历史回放日期YYYY.MM.DD
            isScrollSpaceAbnormal: false, // 异常空间运行列表是否滚动：用于判断历史播放暂停
            realHistoryDataFor3D: [], // 历史回放 - 3D - 实时
            dispatchHistoryDataFor3D: [], // 历史回放 - 3D - 调度
            buildingData: [],
            buildingFloorData: [],
            viewType: '3D', // 视图类型：3D/list(3D/列表)
            delSpaceData: false // 关闭空间详情
        };
    },
    getters: {
        leftInfoItem: state => () => {
            return state.leftInfoList.find(item => item.id === state.infoCode);
        }
    },
    actions: {
        // 更改空间详情
        uptadaDelSpaceData(val: boolean) {
            this.delSpaceData = val;
        },
        // 更新当前选中的为温度/二氧化碳
        updateInfoCode(val: any) {
            this.infoCode = val;
        },
        // 更新历史回放显示状态
        updateHistoryPlay(val: any) {
            this.isShowHistoryPlay = val;
        },
        // 更新历史回放日期
        updateHistoryDate(val: any) {
            this.historyDate = val;
        },
        // 更新楼层id
        updateFloorId(val: any) {
            this.floorId = val;
        },
        updateFloorName(val: any) {
            this.floorName = val;
        },
        setBuildingData(val: any) {
            this.buildingData = val;
        },
        setBuildingFloorData(val: any) {
            this.buildingFloorData = val;
        },
        updateIsScrollSpaceAbnormal(val: any) {
            this.isScrollSpaceAbnormal = val;
        },
        updateRealHistoryDataFor3D(val: any) {
            this.realHistoryDataFor3D = val;
        },
        updateDispatchHistoryDataFor3D(val: any) {
            this.dispatchHistoryDataFor3D = val;
        },
        updateViewType(val: any) {
            this.viewType = val;
        }
    }
});

export default xplantindoorenvStore;
