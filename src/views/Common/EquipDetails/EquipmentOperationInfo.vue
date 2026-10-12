<template>
    <div>
        <div v-if="list.relInfoCodeConfigs?.length" class="row-box">
            <div v-for="items in list.relInfoCodeConfigs" :key="items.name" :class="[items.linkCodes ? 'pd8 wd' : '', 'run-condition-list']">
                <div
                    :class="[items.infoCodeType == IOT_RUNNING && items.dataValue && !isInfoCodeHideLink(items?.infoCode) ? 'active' : '', 'run-condition-list-value']"
                    @mousemove="(e:any) => openTimeFun(e, items)"
                    @mouseleave="closeTimeFun"
                    @click="goInfo(items)"
                >
                    {{ getValueStr(items).text }}
                </div>
                <div v-ellipsis class="run-condition-list-name">{{ items.infoCodeName }}</div>
            </div>
        </div>
        <div v-if="list.groupChildren?.length">
            <div v-for="(items, indexs) in list.groupChildren" :key="indexs">
                <div v-if="hasInfoCodes(items?.relInfoCodeConfigs)" class="operation-condition">
                    <div class="title f14 fb7" style="margin-top: 12px">{{ items.groupName }}</div>
                    <div class="row-box">
                        <div v-for="(item, index) in filterInfoCodes(items.relInfoCodeConfigs)" :key="index" :class="[item.linkCodes ? 'pd8 wd' : '', 'run-condition-list']">
                            <div
                                :class="[item.infoCodeType == IOT_RUNNING && item.dataValue ? 'active' : '', 'run-condition-list-value']"
                                @mousemove="(e:any) => openTimeFun(e, item)"
                                @mouseleave="closeTimeFun"
                                @click="goInfo(item)"
                            >
                                {{ getValueStr(item).text }}
                            </div>
                            <div v-ellipsis class="run-condition-list-name">{{ item.infoCodeName }}</div>
                        </div>
                    </div>
                    <div v-for="(io, iv) in items.groupChildren" :key="iv">
                        <div class="diamond-title f14 fb7 mb12">{{ io.groupName }}</div>
                        <div class="row-box">
                            <div v-for="(item, index) in io.relInfoCodeConfigs" :key="index" :class="[item.linkCodes ? 'pd8 wd' : '', 'run-condition-list']">
                                <div
                                    :class="[item.infoCodeType == IOT_RUNNING && item.dataValue ? 'active' : '', 'run-condition-list-value']"
                                    @mousemove="(e:any) => openTimeFun(e, item)"
                                    @mouseleave="closeTimeFun"
                                    @click="goInfo(item)"
                                >
                                    {{ getValueStr(item).text }}
                                </div>
                                <div v-ellipsis class="run-condition-list-name m-ellipsis">{{ item.infoCodeName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <m-popover virtual-triggering :virtual-ref="timePopRef" trigger="manually" theme="darkTransparent" :is-open="showTimePop" :show-arrow="false">
            <template #content>
                <div>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time }}</div>
                <div v-if="infoCodeType == IOT_RUNNING" style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</div>
            </template>
        </m-popover>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { jumpToAnalysis } from '@/utils/envUtils';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { getValueStr as _getValueStr } from '@/utils/viewUtils';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import DockSingleton from '@/hooks/responsiveDock';
import { IOT_RUNNING } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();

// 停车位-车牌号隐藏跳转数据分析入口
const hideInfoCodes = ['carNumber'];

const isInfoCodeHideLink = (infoCode: string) => hideInfoCodes.includes(infoCode);

const commonDrawerRoot = inject(commonDrawerRootContextKey);

const getInfoItem = (infoItem: any) => {
    const infoInDock = commonDrawerRoot?.props?.isSubscriptOnDemand && getIotData ? getIotData(props.selectObj?.id, infoItem.infoCode) : null;

    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;

    return refInfo;
};

const getValueStr = (infoItem: any) => {
    const refInfo = getInfoItem(infoItem);

    return _getValueStr(refInfo);
};

const props = defineProps({
    list: {
        type: Object as any,
        default: () => {}
    },
    selectObj: {
        type: Object as any,
        default: () => {}
    },
    filterCodes: {
        type: Array,
        default: () => []
    }
});

const filterInfoCodes = (relInfoCodeConfigs: any) => {
    if (!relInfoCodeConfigs) return [];
    return (
        relInfoCodeConfigs?.filter((info: any) => {
            return !props.filterCodes?.includes(info?.infoCode);
        }) || []
    );
};

const hasInfoCodes = (relInfoCodeConfigs: any) => {
    if (!relInfoCodeConfigs) return false;
    return relInfoCodeConfigs?.some((info: any) => {
        return !props.filterCodes?.includes(info?.infoCode);
    });
};

const time = ref('');
const timePopRef = ref<HTMLElement | null>(null);
const showTimePop = ref(false);
const infoCodeType: any = ref('');
const openTimeFun = (e: any, objItem: any) => {
    if (isInfoCodeHideLink(objItem?.infoCode)) {
        return;
    }
    infoCodeType.value = objItem.infoCodeType;
    const refInfo = getInfoItem(objItem);
    if (refInfo.dataTime) {
        timePopRef.value = e.target;
        showTimePop.value = true;
        time.value = dayjs(refInfo.dataTime).format('YYYY.MM.DD HH:mm:ss');
    }
};
//运行参数可跳转
const goInfo = (item: any) => {
    if (isInfoCodeHideLink(item?.infoCode)) {
        return;
    }
    console.log(item);
    if (item.infoCodeType === IOT_RUNNING && item.dataValue) {
        const jumpParams = {
            infoCode: item.infoCode,
            id: props.selectObj?.id
        };
        jumpToAnalysis(jumpParams);
    }
};

const closeTimeFun = () => {
    showTimePop.value = false;
    timePopRef.value = null;
    time.value = '';
};
</script>
<style lang="less" scoped>
.row-box {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 12px 16px;
}
.title {
    width: 100%;
    padding: 0px 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
}
.diamond-title {
    width: 100%;
    position: relative;
    padding-left: 25px;
}
.diamond-title::before {
    content: '';
    position: absolute;
    left: 9px;
    top: 34%; /* 将菱形的中点与文本对齐 */
    width: 7px; /* 菱形宽度 */
    height: 7px; /* 菱形高度 */
    background-color: black; /* 菱形颜色 */
    border-right: 1px solid black; /* 右边线 */
    border-bottom: 1px solid black; /* 下边线 */
    border-radius: 1.5px;
    transform: rotate(45deg); /* 旋转菱形 */
}
.run-condition-list {
    padding-left: 12px;
    &-name {
        word-wrap: break-word;
        word-break: normal;
        text-align: left;
        font-size: 14px;
        line-height: 22px;
        color: #626c78;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
    }
    &-value {
        font-size: 14px;
        line-height: 22px;
    }
}
.wd {
    width: 100%;
}
.active {
    color: var(--blue-500);
    cursor: pointer;
}
.active:hover {
    color: var(--blue-700);
}
.pd8 {
    padding-left: 8px;
}
</style>
<style lang="less">
@media screen and (min-width: 1600px) {
    .run-condition-list {
        &-name {
            max-width: 202px;
        }
    }
}
@media screen and (max-width: 1600px) {
    .run-condition-list {
        &-name {
            max-width: 162px;
        }
    }
}
</style>
