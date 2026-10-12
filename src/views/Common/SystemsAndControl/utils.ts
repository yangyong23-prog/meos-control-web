import { extendInfoCodeValueConfig } from '@/apis/ACAC';
import FormItemRadio from '@/components/ObjectInfoComponents/ControlForm/FormItemRadio.vue';
import FormSelect from '@/components/ObjectInfoComponents/ControlForm/FormSelect.vue';
import { INFO } from '@/components/ObjectInfoComponents/ControlForm/config';
import i18n from '@/localization';
import { COOLING_CODE, HEATING_CODE, INFO_CODE, IS_AUTO, IS_MANUAL, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import type { Ref } from 'vue';

export const isLock = (data: { dataValue: string }) => {
    return data.dataValue === '0';
};

interface SystemParamsSpecialInfoCodeFormOptions {
    value: {
        dataValue?: Record<string, any>;
        infoCode: string | number;
        infoCodeName?: string;
    };
    list: Ref<any[]>;
    relateFormList: Ref<any[]>;
    specialInfoCodeKey?: Record<string, string>;
    dataSource?: Array<{ code: string | number; name: string }>;
}

export const buildSystemParamsSpecialInfoCodeForm = ({ value, list, relateFormList, specialInfoCodeKey, dataSource }: SystemParamsSpecialInfoCodeFormOptions) => {
    const key = specialInfoCodeKey?.[String(value.infoCode)] || '';
    const controlData = {
        name: '',
        required: true,
        componentAttrs: {},
        defaultValue: value.dataValue?.[key] ?? '',
        component: FormSelect,
        dataSource: dataSource ?? [
            { code: COOLING_CODE, name: i18n.global.t('meos_control_web.cooling') },
            { code: HEATING_CODE, name: i18n.global.t('meos_control_web.heating') }
        ],
        infoCode: value.infoCode
    };
    const manualFormList = [controlData];
    const autoFormList = [
        INFO(i18n.global.t('meos_control_web.switch_auto_mode_device_auto'), '', {
            componentAttrs: {
                style: 'border-radius: 4px;padding: 4px;background-color: var(--gray-100);color: var(--gray-50);'
            }
        })
    ];

    relateFormList.value = value.dataValue?.manualAutoSet === 1 ? autoFormList : manualFormList;
    // 添加手自动项
    list.value.unshift({
        name: value.infoCodeName || value.infoCode,
        required: true,
        defaultValue: value.dataValue?.manualAutoSet + '',
        componentAttrs: {
            onChange: (val: string) => {
                if (val === IS_AUTO) {
                    relateFormList.value = autoFormList;
                } else {
                    relateFormList.value = manualFormList;
                }
            }
        },
        infoCode: INFO_CODE.manualAutoSet.infoCode,
        dataSource: [
            { code: IS_MANUAL, name: i18n.global.t('meos_control_web.manual1') },
            { code: IS_AUTO, name: i18n.global.t('meos_control_web.auto') }
        ],
        component: FormItemRadio
    });
};

interface SubmitSystemParamsSpecialInfoCodeOptions {
    data: Record<string | number, any>;
    currentData: {
        infoCode: string | number;
        infoCodeType?: unknown;
    };
    systemId: string;
    systemClassCode: string;
    specialInfoCodeKey?: Record<string, string>;
    getCustomInfo: (systemId: string, infoCodeType: unknown, infoCode: string | number) => { dataValue?: Record<string, any> } | undefined;
    onSuccess?: () => void;
    onFinally: () => void;
}

export const submitSystemParamsSpecialInfoCode = ({
    data,
    currentData,
    systemId,
    systemClassCode,
    specialInfoCodeKey,
    getCustomInfo,
    onSuccess,
    onFinally
}: SubmitSystemParamsSpecialInfoCodeOptions) => {
    const key = specialInfoCodeKey?.[String(currentData.infoCode)] || '';
    if (!key) {
        return;
    }

    const obj = getCustomInfo(systemId, currentData.infoCodeType, currentData.infoCode);
    const dataValue = obj?.dataValue?.[key] || '';
    // 统一特殊信息点扩展配置的提交参数，避免各系统页面重复拼装。
    const params = {
        classCode: systemClassCode,
        systemId,
        infoCode: currentData.infoCode,
        infoValue: data[currentData.infoCode],
        beforeValue: dataValue,
        content: '',
        extendSetting: {
            manualAutoSet: data.manualAutoSet,
            [key]: data[currentData.infoCode]
        }
    };

    extendInfoCodeValueConfig(params)
        .then((res: { code: string }) => {
            if (res.code === SUCCESSCODE) {
                useSuccessMessage();
                onSuccess?.();
            }
        })
        .finally(() => {
            onFinally();
        });
};
