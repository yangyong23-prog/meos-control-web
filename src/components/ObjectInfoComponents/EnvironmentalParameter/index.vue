<template>
    <div :class="['count-container', 'bg-c1']">
        <div v-for="(item, index) in arr" :key="index + 'd'" class="count-box" :class="!item.dataValue ? '' : 'count-box-active'">
            <div class="count-top">
                <m-popover v-if="item.dataValue && item.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
                    <template #content>
                        <p style="font-size: 14px">{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') }}</p>
                        <p style="color: #c4c9cf; font-size: 12px">({{ i18n.global.t('meos_control_web.click_jump_data_analysis') }})</p>
                    </template>
                    <div class="cp">
                        <span class="top-num" style="font-family: 'Persagy2.0'" @click="itemInfo(item)">{{ getValue(item) }}</span>
                        <span class="top-unit">{{ item.unit }}</span>
                    </div>
                </m-popover>
                <span v-else class="top-num">--</span>
            </div>
            <div v-ellipsis class="count-bottom m-ellipsis">{{ item.infoCodeName }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { jumpToAnalysis } from '@/utils/envUtils';
import { getValueStr } from '@/utils/viewUtils';
import DockSingleton from '@/hooks/responsiveDock';
import dayjs from 'dayjs';
import { IOT_RUNNING } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    runParameter: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const arr = ref([]);

const getValue = infoItem => {
    const infoInDock = getIotData(props.selectObj?.id, infoItem.infoCode);
    return getValueStr(infoInDock).text;
};
watch(
    () => props.runParameter,
    () => {
        arr.value = [];
        props.runParameter?.relInfoCodeConfigs?.map(item => {
            arr.value.push(item);
        });
    },
    { immediate: true }
);
const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.selectObj?.id
    };
    jumpToAnalysis(jumpParams);
};
</script>

<style lang="less" scoped>
.count-container {
    border-radius: 4px;
    padding: 8px 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    .count-box {
        padding: 8px;
        .count-top {
            height: 19px;
            margin-bottom: 4px;
            color: var(--gray-900, #1b2129);
            font-family: Persagy2.0;
            font-size: 16px;
            font-weight: 700;
            .top-unit {
                color: var(--gray-600, #626c78);

                font-size: 12px;
                font-weight: var(--platform-font-weight);
            }
        }
        .count-bottom {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            cursor: default;
        }
        &:hover {
            border-radius: 4px;
            background: var(--alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .count-box-active {
        &:hover .top-num {
            color: #246fe5;
        }
        &:hover .top-unit {
            color: #246fe5;
        }
    }
}
.bg-c {
    background: #f5fcff;
    margin-right: 10px;
}
.bg-c1 {
    background: #f7f9fa;
}
</style>
