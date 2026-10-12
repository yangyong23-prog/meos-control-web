<template>
    <div :class="['count-container', 'bg-c1']">
        <div v-for="(item, index) in arr" :key="index + 'd'" class="count-box" :class="!item.dataValue ? '' : 'count-box-active'">
            <div class="count-top">
                <m-popover v-if="item.dataValue && item.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
                    <template #content>
                        <p style="font-size: 14px">{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') }}</p>
                        <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                    </template>
                    <div class="cp">
                        <span class="top-num" style="font-family: 'Persagy2.0'" @click="itemInfo(item)">{{ getValueStr(item)?.dataValue || '--' }}</span>
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
import { jumpToAnalysis } from '@/utils/envUtils';
import { getValueStr as _getValueStr } from '@/utils/viewUtils';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from 'lodash';
import { selectModuleInfoInjectKey } from '@/views/machine-room-safety/constant/injectKey';
import { IOT_RUNNING } from '@/utils/globalVariables';

const { getIotData } = DockSingleton.getInstance();

const commonDrawerRoot = inject(commonDrawerRootContextKey);
import dayjs from 'dayjs';
const props = defineProps({
    currentStatisticArr: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const getValueStr = infoItem => {
    const infoInDock = commonDrawerRoot?.props?.isSubscriptOnDemand && getIotData ? getIotData(props.selectObj?.id, infoItem.infoCode) : null;
    console.log(infoInDock, infoItem, 'infoInDock');
    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;

    return refInfo;
};
const arr = ref([]);

const selectModuleInfo = inject(selectModuleInfoInjectKey) || inject('selectModuleInfo');

watch(
    () => props.currentStatisticArr,
    () => {
        arr.value = [];
        props.currentStatisticArr?.relInfoCodeConfigs?.map(item => {
            arr.value.push(item);
        });
    },
    { immediate: true }
);
const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: selectModuleInfo.value.id
    };
    jumpToAnalysis(jumpParams);
};
</script>

<style lang="less" scoped>
// @media screen and (min-width: 1600px) {
//     .count-box {
//         // width: 130px;
//     }
// }
// @media screen and (max-width: 1600px) {
//     .count-box {
//         width: 104px;
//     }
// }
.count-container {
    border-radius: 4px;
    padding: 8px 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    // justify-content: space-between;
    // display: grid;
    // gap: 4px auto;
    // grid-template-columns: repeat(2, auto);
    .count-box {
        padding: 8px;

        .count-top {
            height: 19px;
            margin-bottom: 4px;
            color: var(--gray-900, #1b2129);
            font-family: Persagy2.0;
            font-size: 16px;
            font-weight: 700;
            // text-align: center;
            .top-unit {
                color: var(--gray-600, #626c78);

                font-size: 12px;
                font-weight: var(--platform-font-weight);
            }
        }
        .count-bottom {
            // text-align: center;
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            cursor: default;
            // /* 设置宽度和高度 */
            // max-width: 84px;
        }
        &:hover {
            // cursor: pointer;
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
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
