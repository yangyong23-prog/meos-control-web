<template>
    <div class="fc image-container">
        <div
            v-for="(io, iv) in list"
            :key="iv"
            :class="[id === selectModuleInfoId && moreItemType === 'moreList' ? 'icon-active' : '', 'icon-box', 'fcc', 'ml4', moreItemType === 'moreList' ? '.bg-w1' : '.bg-w']"
            @click.stop="type === 'detail' ? equipmentBtn1(io, io.id) : equipmentBtn(io, io.id)"
        >
            <m-tips :content="io.localName ?? '--'" theme="darkTransparent">
                <div style="position: relative" :class="['icon-border', 'fcc']">
                    <Svgicon v-if="io.id === selectModuleInfoId && type !== 'detail'" name="Air-blower-active" />
                    <Svgicon v-else :name="getRunStatusVal(io.id) === '1' ? 'Air-blower' : getRunStatusVal(io.id) === '0' ? 'Air-blower-Off' : 'Air-blower-noData'" />
                    <AnomalousRedDot :type="type === 'detail' ? getAbnormalWeight(io.id) : getAbnormalWeight(io.id)" />
                </div>
            </m-tips>
        </div>
    </div>
    <div :class="[id === selectModuleInfoId && moreItemType === 'moreList' ? 'active-gradation' : '', 'gradation', type === 'detail' ? 'detail-hover' : '']"></div>
</template>
<script setup>
import Svgicon from '@/components/common/SvgIcon.vue';
import AnomalousRedDot from './AnomalousRedDot.vue';
import { showModuleInfoInjectKey, selectModuleInfoInjectKey } from '../constant/injectKey';
const getRunStatusVal = inject('getRunStatusVal'); //1:开启，0:关闭
const getAbnormalWeight = inject('getAbnormalWeight'); //
const equipStatus = inject('equipStatus');
const equipmentBtn = inject('equipmentBtn');
const showModuleInfo = inject(showModuleInfoInjectKey);
const selectModuleInfo = inject(selectModuleInfoInjectKey);
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    id: {
        type: String,
        default: null
    },
    selectModuleInfoId: {
        type: String,
        default: ''
    },
    moreItemType: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }
});
//卡片上设备的状态
const equipStatus1 = id => {
    if (getAbnormalWeight(id)?.length >= 3) {
        return '3'; //多状态
    } else if (getAbnormalWeight(id)?.includes(1)) {
        return '1'; //异常
    } else if (getAbnormalWeight(id)?.includes(2)) {
        return '2'; //控反不一致
    } else if (getAbnormalWeight(id)?.includes(3)) {
        return '4'; //离线
    } else {
        return null;
    }
};
const equipmentBtn1 = (item, id) => {
    showModuleInfo.value = true;
    selectModuleInfo.value = item;
    selectModuleInfo.value.objType = 'equipment';
};
</script>
<style lang="less" scoped>
.image-container {
    // overflow-y: hidden;
    position: relative;
    height: 25px;
    // width: 100%;
    flex: 1;
    .icon-box {
        border-radius: 50%;
        width: 25px;
        height: 25px;
        flex-shrink: 0;
        .icon-border {
            width: 20px;
            height: 20px;
            // object-fit: cover;
        }
    }
    .bg-w {
        background: white;
    }
    .bg-w1 {
        background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0.24) 100%);
    }
}
.image-container .icon-box:not(:first-child) {
    margin-left: -10px;
    z-index: 2;
}
.gradation {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 37px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.98) 67.37%);
    z-index: 3;
}
.active-gradation {
    background: linear-gradient(90deg, rgba(71, 134, 233, 0) 0%, rgba(71, 134, 233, 0.98) 67.37%) !important;
}
.icon-active {
    background: #4786e9 !important;
}

.icon-red-dot {
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    position: absolute;
    right: 2px;
    top: -1px;
    z-index: 5;
    background-color: #f55047;
}
:deep(.Air-blower):hover {
    .svgPath {
        fill: #72e1de !important;
        stroke: #00a2a7 !important;
    }
}
:deep(.Air-blower-Off):hover {
    .svgPath {
        fill: #c4c9cf !important;
        stroke: #626c78 !important;
    }
}
:deep(.Air-blower-noData):hover {
    .svgPath {
        fill: #cbd0d9 !important;
        stroke: #d9dce0 !important;
    }
    .svgPath1 {
        fill: #abb3bc !important;
    }
    .svgPath2 {
        fill: #abb3bc !important;
        stroke: #dadee3 !important;
    }
}
</style>
