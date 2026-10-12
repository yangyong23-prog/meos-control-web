// 根据传入的数据动态返回对应的控制组件
export const CONTROL_CONFIG_FUN = data => {
    if (data.infoCode?.includes('Switch') || data.infoCode === 'airConditionDemand' || data.infoCode === 'enableCtrl') {
        return { type: 'SwitchControl', component: '' }; // 返回开关控制组件
    }
    if (data.unitsNumberSetValue) {
        return { type: 'CoolerControl', component: '' }; // 返回冷却器控制组件
    }
    return { type: 'InputControl', component: '' }; // 默认返回输入控制组件
};
