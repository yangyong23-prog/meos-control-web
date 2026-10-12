<template>
    <div style="min-width: 150px">
        <div
            v-if="tipsShow"
            :style="{ left: `${localPosition.left}px`, top: `${localPosition.top}px` }"
            class="group-hover"
            :class="{ isLoading: loading }"
            @mouseenter="mouseenterPopup"
            @mouseleave="mouseleavePopup"
        >
            <m-scrollbar v-loading="loading" max-height="376px" element-loading-lottiename="circle" class="group-hover-content-warp">
                <div v-for="item in equipmentList" :key="item.id" class="equipment-item" :class="{ selable: canHoverGroupSelect }" @click="clickItem(item)">
                    <EquipItem :data="item" />
                </div>
            </m-scrollbar>
            <div class="dow"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import dataDockHandling from '@/hooks/dataDockHandling';
import EquipItem from './EquipItem.vue';
import { HOVER } from '@/utils/globalVariables';
const props = defineProps({
    equips: {
        type: Array,
        default: () => []
    },
    pos: {
        type: Object,
        default: () => ({})
    },
    runningMonitorType: {
        type: String,
        default: 'AIR_CONDITIONING_COLD_SOURCE'
    },
    canHoverGroupSelect: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['clickItem']);
const { loadDynaDataWithIotHandling } = dataDockHandling();

const loading = ref(true);
const tipsShow = ref(false);
// 当前查询数据
let showTipsTimer = null, // 显示提示框定时器
    hideTipsTimer = null, // 隐藏提示框定时器
    isInCard = false; //鼠标在卡片中；解决mouseEnter 先于watch执行
const localPosition = ref({
    left: 0,
    right: 0
});
const fetchAbortController = ref();
const equipmentList = ref([]);
// const showTips = async () => {
//     equipmentList.value = [];
//     clearTimeout(hideTipsTimer);
//     fetchAbortController.value?.abort();
//     fetchAbortController.value = new AbortController();
//     clearTimeout(showTipsTimer);
//     tipsShow.value = false;
//     showTipsTimer = setTimeout(async () => {
//         tipsShow.value = true;
//         loading.value = true;
//         try {
//             const res = await loadDynaDataWithIotHandling(
//                 {
//                     templateType: HOVER,
//                     runningMonitorType: props.runningMonitorType,
//                     objectIds: props.equips.map(item => item.id)
//                 },
//                 listInfoCodeConfigsByObjectIdCommon,
//                 fetchAbortController.value.signal
//             );
//             equipmentList.value = structuredClone(res.data.length ? res.data : props.equips);
//         } finally {
//             loading.value = false;
//         }
//     }, 300);
// };
const getHoverCardData = async () => {
    loading.value = true;
    fetchAbortController.value?.abort();
    fetchAbortController.value = new AbortController();
    try {
        const res = await loadDynaDataWithIotHandling(
            {
                templateType: HOVER,
                runningMonitorType: props.runningMonitorType,
                objectIds: props.equips.map(item => item.id),
                withColumns: ['id', 'localName', 'floorId', 'classCode', 'bimLocation', 'objType']
            },
            listInfoCodeConfigsByObjectIdCommon,
            fetchAbortController.value.signal
        );
        // 构建id映射
        const resIdMap = res.data?.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});
        // 以props.equips为基，如果接口返回了信息点则用接口返回的
        equipmentList.value = structuredClone(props.equips ?? []).map(item => resIdMap[item.id] || item);
    } finally {
        loading.value = false;
    }
};
const showTips = () => {
    equipmentList.value = [];
    clearTimeout(hideTipsTimer);
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    showTipsTimer = setTimeout(() => {
        tipsShow.value = true;
        getHoverCardData();
        clearTimeout(showTipsTimer);
        showTipsTimer = null;
    }, 300);
};

const hideTips = () => {
    if (isInCard) {
        return;
    }
    hideTipsTimer = setTimeout(() => {
        hideTipsNow();
        clearTimeout(hideTipsTimer);
        hideTipsTimer = null;
    }, 200);
};

const hideTipsNow = () => {
    clearTimeout(showTipsTimer);
    tipsShow.value = false;
    isInCard = false;
};

const mouseenterPopup = () => {
    isInCard = true;
    clearTimeout(hideTipsTimer);
    hideTipsTimer = null;
};

const mouseleavePopup = () => {
    isInCard = false;
    hideTips();
};

const clickItem = obj => {
    if (props.canHoverGroupSelect) {
        emits('clickItem', obj);
    }
};
watch(
    () => props.equips,
    () => {
        if (props.equips.length) {
            console.log(1111);
            showTips();
        } else {
            hideTips();
        }
    },
    {
        deep: true
    }
);

watch(
    () => props.pos,
    () => {
        if (props.pos) {
            localPosition.value = { ...props.pos };
        }
    }
);

// defineExpose({
//     hideTipsNow
// });
</script>

<style lang="less" scoped>
:deep(.circular) {
    width: 28px !important;
    height: 28px !important;

    circle {
        stroke: #626c78 !important;
    }
}

:deep(.el-loading-spinner) {
    margin-top: -14px !important;
}

.group-hover {
    position: absolute;
    max-width: 320px;
    min-width: 150px;
    min-height: 40px;
    max-height: 400px;
    padding: 12px 0;
    z-index: 1000 !important;
    transform: translate(-50%, -100%);
    background-color: #fff;
    border: 1px solid #e1e5eb;
    box-shadow: 0px 0.5px 3px 0px #1b212914;
    border-radius: 8px;
    &.isLoading {
        min-width: 150px;
    }
    .dow {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 5px solid #fff;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
        border-bottom: 5px solid transparent;
        margin: auto;
        bottom: -10px;
        left: 50%;
        transform: translate(-50%, 0);
    }
}

.group-hover-content-warp {
    font-size: 14px;
    width: 100%;
    min-height: 32px;
    padding: 0 8px;
    .equipment-item {
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 8px;
        & + .equipment-item {
            padding-top: 8px;
            border-top: 1px solid var(--gray-100);
        }
        &:last-child {
            padding-bottom: 0;
        }
    }
    .selable {
        &:hover {
            cursor: pointer;
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
</style>
