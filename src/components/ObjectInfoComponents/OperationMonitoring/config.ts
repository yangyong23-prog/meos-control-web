import type { Component } from 'vue';
import TemplateTwo from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateTwo.vue';
import TemplateOne from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateOne.vue';
import TemplateThree from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateThree.vue';
import TemplateFour from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateFour.vue';
import RunnigParams from '@/components/ObjectInfoComponents/RunningParams/index.vue';
import RunnigParamsNew from '@/components/ObjectInfoComponents/RunningParams/new/index.vue';
import TemplateFive from '@/components/ObjectInfoComponents/SingleDeviceControl/TemplateFive.vue';
import { GROUP_CODE_KEY_MAP } from '@/utils/globalVariables';

export type TemplateType = 1 | 2 | 3 | 4 | 5;

const TEMPLATE_MAP: Record<TemplateType, Component> = {
    1: TemplateOne,
    2: TemplateTwo,
    3: TemplateThree,
    4: TemplateFour,
    5: TemplateFive
};

export interface OperationMonitoringProps {
    customControlComponent?: (groupCode: string) => Component;
}

export const getComponent = (type: TemplateType): Component => TEMPLATE_MAP[type];

export const getComponentByGroupCode = (groupCode: string, props: OperationMonitoringProps = {}): Component | null => {
    const equipComponent = props.customControlComponent?.(groupCode) ?? TemplateTwo;
    const config: Record<string, Component> = {
        [GROUP_CODE_KEY_MAP.equipParameterSet]: equipComponent,
        [GROUP_CODE_KEY_MAP.controlledParameterSet]: equipComponent,
        [GROUP_CODE_KEY_MAP.controlGroupOfTheSeriesConnectedChiller]: TemplateFive,
        [GROUP_CODE_KEY_MAP.ACAHGinfoofACATAH]: TemplateFive,
        [GROUP_CODE_KEY_MAP.runningParameter]: RunnigParams, // 运行参数
        [GROUP_CODE_KEY_MAP.techniqueParameter]: RunnigParams, // 技术参数
        // eslint-disable-next-line camelcase
        [GROUP_CODE_KEY_MAP.x1stTag3]: RunnigParamsNew, // 运行参数
        // eslint-disable-next-line camelcase
        [GROUP_CODE_KEY_MAP.x1stTag5]: RunnigParamsNew // 技术参数
    };

    const component = config[groupCode];
    if (component) {
        return component;
    }

    console.log('暂无该组件', groupCode);
    return null;
};
