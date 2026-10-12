<template>
    <div>
        <div v-if="list.children?.length">
            <div v-for="(items, indexs) in list.children" :key="indexs">
                <div v-if="items.children || items.infoCodes" class="operation-condition">
                    <div class="groupname-title f14 fb7">{{ items.groupName }}</div>
                    <EquipmentInfoCodeList :info-codes="items.infoCodes || []" @open-time="openTimeFun" @close-time="closeTimeFun" @go-info="goInfo" />
                    <div v-for="(io, iv) in items.children" :key="iv">
                        <div class="diamond-title f14 fb7 mb12">{{ io.groupName }}</div>
                        <EquipmentInfoCodeList :info-codes="io.infoCodes || []" @open-time="openTimeFun" @close-time="closeTimeFun" @go-info="goInfo" />
                    </div>
                </div>
            </div>
        </div>
        <EquipmentInfoCodeList v-else :info-codes="list?.infoCodes || []" :pass-link-codes="false" @open-time="openTimeFun" @close-time="closeTimeFun" @go-info="goInfo" />
        <m-popover virtual-triggering :virtual-ref="timePopRef" trigger="manually" theme="darkTransparent" :is-open="showTimePop" :show-arrow="false">
            <template #content>
                <div>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ time }}</div>
                <div v-if="parameterType == i18n.global.t('meos_control_web.operating_parameters')">{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</div>
            </template>
        </m-popover>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { jumpToAnalysis } from '@/utils/envUtils';
import _ from 'lodash';
import dayjs from 'dayjs';
import EquipmentInfoCodeList from './EquipmentInfoCodeList.vue';

defineProps({
    list: {
        type: Object as any,
        default: () => {}
    }
});
const time = ref('');
const timePopRef = ref<HTMLElement | null>(null);
const showTimePop = ref(false);
const equipmentNode: any = inject('equipmentNode');
const parameterType: any = ref('');

const openTimeFun = (e: any, data: any, item?: any) => {
    parameterType.value = data.parameterType;
    const dataTime = data.dataTime || item?.dataTime;
    if (dataTime) {
        timePopRef.value = e.target;
        showTimePop.value = true;
        time.value = dayjs(dataTime).format('YYYY.MM.DD HH:mm:ss');
    }
};
const hasDataValue = (linkCodes: any[]) => {
    return linkCodes?.some((link: { dataValue: any }) => link.dataValue);
};
//运行参数可跳转
const goInfo = (item: any, linkCodes?: any) => {
    console.log(equipmentNode);
    console.log(item);
    if (item.parameterType === i18n.global.t('meos_control_web.operating_parameters')) {
        if (_.isArray(linkCodes)) {
            const jumpParams = linkCodes.map(child => {
                return {
                    infoCode: child.infoCode,
                    id: equipmentNode.value.id
                };
            });
            hasDataValue(linkCodes) && jumpToAnalysis(jumpParams);
        } else {
            const jumpParams = {
                infoCode: item.infoCode,
                id: equipmentNode.value.id
            };
            item.dataValue && jumpToAnalysis(jumpParams);
        }
    }
};

const closeTimeFun = () => {
    showTimePop.value = false;
    timePopRef.value = null;
    time.value = '';
};
</script>
<style lang="less" scoped>
.groupname-title {
    width: 100%;
    padding: 0px 8px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    margin: 12px 0;
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
</style>
