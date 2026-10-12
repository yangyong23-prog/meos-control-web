import { defineStore } from 'pinia';
interface ListMeta {
    // 是否打开展开收起按钮
    toggleCoBtnOpen: boolean;
    toggleLoopBtnOpen: boolean;
    // 列表类型:回路 loop 控制模块 control
    type?: 'loop' | 'control' | '';
    // 回路筛选框信息
    hlInfo: {
        // 服务空间
        // space?: string[];
        // 所选空间 枚举值: PROJECT; BUILDING; FLOOR; SPACE;  string 为空时查询所有
        instanceType: string;
        // 实例类型
        instanceId: string;
        // 在线状态
        onlineStatus?: 'ALL' | 'ONLINE' | 'OFFLINE' | '';
        // 手自动状态
        handAutomatism?: 'ALL' | 'AUTO' | 'MANUAL' | '';
        // 功能类型
        funcType?: string;
        // 灯具类型
        lampType?: string;
        // 当前运行需求
        operationalRequirement?: 'ALL' | 'OPEN' | 'CLOSE' | '';
        // 运行偏差
        operatingDeviation?: 'MORE_OPEN' | 'LESS_OPEN' | 'NO_DEVIATION' | ''[];
        // 控🍚不一致 0正常 1报警
        controlIsInconsistent?: 'ALL' | '0' | '1' | '';
        // 异常事件
        anomalousEvent?: 'ALL' | 'NORMAL' | 'ABNORMAL' | '';
    };
    // 控制模块列表信息
    coInfo: {
        // 所选空间 枚举值: PROJECT; BUILDING; FLOOR; SPACE;  string 为空时查询所有
        instanceType: string;
        // 实例类型
        instanceId: string;
        // 在线状态
        onlineStatus: 'ALL' | 'ONLINE' | 'OFFLINE' | '';
        // 故障状态
        faultConditions: 'ALL' | 'NORMAL' | 'ABNORMAL' | '';
    };
    buildingData: any;
}
interface State extends ListMeta {
    // 是否展示回路列表或者模块列表
    listVisible: boolean;
}
export const loopControlList = defineStore('loopControlList', {
    state: (): State => {
        return {
            toggleCoBtnOpen: false,
            toggleLoopBtnOpen: false,
            listVisible: false,
            type: '',
            buildingData: null,
            hlInfo: {
                // 服务空间
                instanceType: '',
                instanceId: '',
                // 在线状态
                onlineStatus: '',
                // 手自动状态
                handAutomatism: '',
                // 功能类型
                funcType: '',
                // 灯具类型
                lampType: '',
                // 当前运行需求
                operationalRequirement: '',
                // 运行状态
                runStatus: '',
                // 运行偏差
                operatingDeviation: [],
                // 控🍚不一致
                controlIsInconsistent: '',
                // 异常事件
                anomalousEvent: '',
                //区分照明
                type: ''
            },
            coInfo: {
                instanceType: '',
                instanceId: '',
                onlineStatus: '',
                faultConditions: ''
            }
        };
    },
    actions: {
        setBuildingData(v: any) {
            this.buildingData = v;
        },
        setCoToggleBtn(toggleBtnStatus: boolean | undefined) {
            if (toggleBtnStatus) {
                this.toggleCoBtnOpen = true;
            } else {
                this.toggleCoBtnOpen = false;
            }
        },
        setType(v: any) {
            this.type = v;
        },
        setLoopToggleBtn(toggleBtnStatus: boolean | undefined) {
            if (toggleBtnStatus) {
                this.toggleLoopBtnOpen = true;
            } else {
                this.toggleLoopBtnOpen = false;
            }
        },
        setVisible(value: boolean) {
            this.listVisible = value;
        },
        setList(meta: ListMeta, clearOldData = true) {
            console.log('meta: ', meta);
            if (meta) {
                const { type, hlInfo, coInfo } = meta;
                type && (this.type = type);
                if (hlInfo) {
                    this.hlInfo = clearOldData ? hlInfo : { ...this.hlInfo, ...hlInfo };
                    try {
                        if (this.hlInfo.instanceId) {
                            this.coInfo.instanceId = this.hlInfo.instanceId;
                        }
                        if (this.hlInfo.instanceType) {
                            this.coInfo.instanceType = this.hlInfo.instanceType;
                        }
                    } finally {
                        clearOldData && this.setLoopToggleBtn(true);
                    }
                }
                if (coInfo) {
                    this.coInfo = clearOldData ? coInfo : { ...this.coInfo, ...coInfo };
                    try {
                        if (this.coInfo.instanceId) {
                            this.hlInfo.instanceId = this.coInfo.instanceId;
                        }
                        if (this.coInfo.instanceType) {
                            this.hlInfo.instanceType = this.coInfo.instanceType;
                        }
                    } finally {
                        clearOldData && this.setCoToggleBtn(true);
                    }
                }
            }
        }
    }
});
