<template>
    <div v-if="listHasDisabilityAlarm.length" class="disability-alarm-reset">
        <!-- 头部 -->
        <div class="header-section">
            <div class="blue-label-title">
                <i class="blue-bar"></i>
                <span class="title-text">{{ data.groupName }}</span>
            </div>
            <SetButton type="link" size="small" @click="handleReset()">
                {{ i18n.global.t('meos_control_web.reset_batch') }}
            </SetButton>
        </div>

        <!-- 列表部分 -->
        <div class="content-body">
            <div v-for="group in listHasDisabilityAlarm" :key="group.id" class="alarm-group">
                <div class="group-header">
                    <div class="blue-label-title sub-title">
                        <span class="title-text">{{ group.name }}</span>
                    </div>
                </div>
                <div class="group-list">
                    <div v-for="item in group.list" :key="item.infoCode + item.dataValue + item.id" class="alarm-item">
                        <div class="item-info">
                            <p v-ellipsis class="sub-text m-ellipsis">{{ item.localName }}</p>
                            <p v-ellipsis class="main-text m-ellipsis">{{ item.infoCodeName }} :&nbsp;{{ (getValueStr(getIotData(item.id, item.infoCode) as any) as any).text }}</p>
                        </div>
                        <SetButton type="link" size="small" class="group-list-btn" @click="handleReset(item)">
                            {{ i18n.global.t('meos_control_web.restoration') }}
                        </SetButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import i18n from '@/localization';
import SetButton from '@/components/common/SetButton.vue';
import { MMessageBox } from 'meri-plus';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { EQUIP_CRITICAL_LEVEL, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import { tagObjList } from '@/apis/ACAH';
import { InfoCodeConfig, InfoCodeGroupConfig } from '@/types/InfoCodeConfig';
import { isArray } from 'lodash';
import { BaseObject } from '@/types/common';
import { getValueStr } from '@/utils/viewUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { INFO_CODE_CONFIG_EVENT } from '@/utils/SSEEventTypes';
import { handleRwdObjectDetail } from './utils';
const { getIotData, setIotData } = DockSingleton.getInstance();
interface List extends BaseObject {
    list: InfoCodeConfig[];
    order?: number;
}
const props = defineProps<{
    data: InfoCodeGroupConfig;
    systemData: { classCode: string; localName: string; systemId: string };
    sse?: any;
}>();
const isDisabilityAlarmValues = ['2', '3'];
const { resetMultiObjectDatasFn } = useGeneralControl();
const list = ref<List[]>([]);
const localNameCollator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' });
const sortByOrderAndName = (values: List[]) => {
    return [...values].sort((a, b) => {
        const orderDiff = Number(a.order ?? 0) - Number(b.order ?? 0);
        if (orderDiff !== 0) {
            return orderDiff;
        }
        return localNameCollator.compare((a.name ?? '').toString(), (b.name ?? '').toString());
    });
};
const listHasDisabilityAlarm = computed(() => {
    const arr: List[] = [];
    list.value?.forEach(item => {
        const filteredList = item.list.filter(info => {
            const data = getIotData(info.id, info.infoCode);
            return isDisabilityAlarmValues.includes(data.dataValue);
        });
        if (filteredList.length) {
            arr.push({ ...item, list: filteredList });
        }
    });
    return arr;
});
const handleReset = (item?: InfoCodeConfig) => {
    const arr: { objectId: string; infoCode: string; val: number }[] = [];
    if (item) {
        arr.push({ objectId: item?.id, infoCode: item?.infoCode, val: 0 });
    } else {
        listHasDisabilityAlarm.value.forEach(group => {
            group.list.forEach((info: { id: any; infoCode: any }) => {
                arr.push({ objectId: info.id, infoCode: info.infoCode, val: 0 });
            });
        });
    }
    MMessageBox({
        title: !item ? i18n.global.t('meos_control_web.confirm_reset_all') : i18n.global.t('meos_control_web.confirm_reset'),
        hasLoading: true,
        message: !item ? i18n.global.t('meos_control_web.confirm_reset_tip_all') : i18n.global.t('meos_control_web.confirm_reset_tip'),
        beforeClose: async (action: string, instance: string, done: () => void) => {
            if (action === 'confirm') {
                try {
                    const res: any = await resetMultiObjectDatasFn(arr);
                    if (res.code === SUCCESSCODE) {
                        useSuccessMessage(i18n.global.t('meos_control_web.reset_success'));
                    }
                    done();
                } catch (error) {
                    done();
                }
            } else {
                done();
            }
        }
    });
};
const init = async () => {
    const classCodeMap: Record<string, List> = {};
    props.data?.relInfoCodeConfigs?.forEach(item => {
        if (isArray(item.dataValue)) {
            item.dataValue.forEach(eq => {
                if (!classCodeMap[eq.classCode]) {
                    // 默认order设置为一个较大值，确保没有标签的设备排在后面；如果设备的classCode与系统的classCode相同，则优先级最高，排在最前面
                    classCodeMap[eq.classCode] = { id: eq.classCode, name: item.infoCodeName, order: 999999999, list: [] };
                    if (props.systemData.classCode === eq.classCode) {
                        classCodeMap[eq.classCode].name = props.systemData.localName;
                        classCodeMap[eq.classCode].order = 0;
                    }
                }
                eq.relInfoCodeGroupConfigs?.forEach(groupConfig => {
                    groupConfig.relInfoCodeConfigs?.forEach(infoCode => {
                        classCodeMap[eq.classCode].list.push({ ...infoCode, id: eq.id, localName: eq.localName });
                    });
                });
            });
        }
    });
    const keys = Object.keys(classCodeMap);
    try {
        const res = await tagObjList({
            classCodes: keys,
            tagNames: [
                //标签分类名称
                EQUIP_CRITICAL_LEVEL
            ],
            objTypes: [OBJ_TYPE.EQUIPMENT, OBJ_TYPE.EQUIPGROUP]
        });
        res.data?.forEach((element: any) => {
            if (classCodeMap[element.classCode]) {
                classCodeMap[element.classCode].order = element.tagValue * 1;
            }
        });
        const values = Object.values(classCodeMap);
        // 先按照order排序，order相同的按照中文名称自然排序
        list.value = sortByOrderAndName(values);
    } catch (error) {
        const values = Object.values(classCodeMap);
        list.value = sortByOrderAndName(values);
    }
    list.value.forEach(item => {
        item.list = [...item.list].sort((a, b) => localNameCollator.compare((a.localName ?? '').toString(), (b.localName ?? '').toString()));
    });
};
onMounted(() => {
    init();
    props.sse?.addEventListener(INFO_CODE_CONFIG_EVENT, handleRwdObjectDetail);
});
onUnmounted(() => {
    props.sse?.removeEventListener(INFO_CODE_CONFIG_EVENT, handleRwdObjectDetail);
});
</script>

<style scoped lang="less">
.disability-alarm-reset {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: 100%;
    color: #1a2028;

    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .blue-label-title {
        display: flex;
        align-items: center;
        gap: 9px;

        .blue-bar {
            width: 3px;
            height: 14px;
            background-color: var(--blue-500, #246fe5);
            border-radius: 1px;
        }

        .title-text {
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            color: #2e3742;
        }

        &.sub-title {
            padding-left: 12px;
        }
    }

    .content-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
    }

    .alarm-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .group-header {
            display: flex;
            align-items: center;
        }
    }

    .group-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        :deep(.group-list-btn) {
            max-width: 50px;
        }
    }

    .alarm-item {
        background-color: var(--gray-50, #f7f9fa);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        width: 100%;
        &:hover {
            background-color: var(--gray-100, #f2f4f6);
        }

        .item-info {
            flex: 1;
            max-width: calc(100% - 62px);
            display: flex;
            flex-direction: column;
            gap: 4px;
            line-height: 22px;
            font-size: 14px;

            .sub-text {
                color: #636d79;
                margin: 0;
            }

            .main-text {
                color: #1a2028;
                margin: 0;
            }
        }
    }
}
</style>
