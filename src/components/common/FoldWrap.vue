<template>
    <slot></slot>
    <div
        v-if="showBtn"
        class="fold-option-wrap"
        :class="['fold-option-wrap-sticky', type === 'aside' ? 'fold-option-wrap-sticky-bg' : '', type === 'dashboard' && open ? 'fold-option-wrap-sticky-bg-dashboard' : '']"
        :style="{ width: btnEnableNum === 5 ? 'calc(100% - 16px)' : '100%' }"
    >
        <!-- width不一致主要解决在右侧和详情弹出底部线条不一致的问题 -->
        <div
            class="option-btn-wrap"
            :class="[type === 'dashboard' ? 'option-btn-wrap-dashboard' : '']"
            :style="{ marginTop: props.btnDistanceY + 'px', marginBottom: props.btnDistanceBottomY + 'px' }"
        >
            <div class="line"></div>
            <div class="btn-wrap" @click="changeOpen" @mouseenter="mouseenter" @mouseleave="mouseleave">
                <span class="title">{{ open ? foldText : expandText }}</span>
                <IconMeriComponentChevronDown :color="color" class="arrow" :class="{ rotate: open }" size="14"></IconMeriComponentChevronDown>
            </div>
            <div class="line"></div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
const emits = defineEmits(['update:modelValue', 'toggle']);
const props = defineProps({
    // 异常事件列表 用于动态计算高度
    data: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Array,
        default: () => []
    },
    //展开收起按钮距离内容区域的边距
    btnDistanceY: {
        type: String,
        default: '0'
    },
    btnDistanceBottomY: {
        type: String,
        default: '0'
    },
    // 启用展开收起规则数量
    btnEnableNum: {
        type: Number,
        default: 3
    },
    filterIds: {
        type: Array,
        default: () => []
    },
    // 收起文案
    foldText: {
        type: String,
        default: i18n.global.t('meos_control_web.collapse')
    },
    // 展开文案
    expandText: {
        type: String,
        default: i18n.global.t('meos_control_web.expand_more')
    },
    // 类型  aside  dashboard
    type: {
        type: String,
        default: 'aside'
    }
});
//是否展示展开收起按钮
const showBtn = ref(false);
//是否展开
const open = ref(false);
//按钮颜色
const color = ref('#246fe5');
if (props?.type === 'dashboard') {
    color.value = '#626C78';
}
const renderList = computed(() => {
    if (!props.data?.length) {
        return [];
    }
    if (!props.filterIds?.length) {
        return props.data;
    }
    return props.data.filter(abnormal => {
        const { instances = [] } = abnormal;
        return instances.some(ins => props.filterIds.includes(ins.instanceId));
    });
});
// 按钮切换
const changeOpen = () => {
    open.value = !open.value;
    if (open.value) {
        emits('update:modelValue', renderList?.value);
    } else {
        emits('update:modelValue', renderList?.value.slice(0, btnEnableNum.value));
    }
    emits('toggle', open.value);
};
const btnEnableNum = computed(() => {
    return props.btnEnableNum;
});
const mouseenter = () => {
    if (props?.type === 'dashboard') {
        color.value = '#626C78';
    } else {
        color.value = 'rgb(39, 72, 203)';
    }
};
const mouseleave = () => {
    if (props?.type === 'dashboard') {
        color.value = '#626C78';
    } else {
        color.value = '#246fe5';
    }
};
const updateState = (list, btnNum, open) => {
    if (!list || !Array.isArray(list)) {
        showBtn.value = false;
        emits('update:modelValue', []);
        return;
    }

    if (list.length > btnNum) {
        showBtn.value = true;
        emits('update:modelValue', open ? list : list.slice(0, btnNum));
    } else {
        showBtn.value = false;
        emits('update:modelValue', list);
    }
};
watch(
    [() => renderList?.value, () => btnEnableNum?.value],
    ([newRenderList, newBtnEnableNum]) => {
        if (newRenderList && newBtnEnableNum !== undefined) {
            updateState(newRenderList, newBtnEnableNum, open.value);
        }
    },
    { immediate: true }
);
onMounted(() => {
    open.value = false;
});
</script>
<style lang="less" scoped>
.fold-option-wrap {
    height: 100%;
    .option-btn-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .line {
            height: 1px;
            flex: 1;
            background: #e1e5eb;
        }
        .btn-wrap {
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            .title {
                color: @blue-500;
                font-size: 14px;
                padding: 3px 4px;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
            &:hover {
                .title {
                    color: rgb(39, 72, 203);
                }
            }
            .arrow {
                transition: transform 0.3s linear;
                margin-right: 4px;
            }
            .rotate {
                transform: rotate(180deg);
                transition: transform 0.3s linear;
            }
        }
    }
    .option-btn-wrap-dashboard {
        color: var(--gray-600, #626c78);
        .btn-wrap {
            margin: 0 6px;
            padding: 2px 8px;
            border-radius: 4px;

            .title {
                color: #626c78;
            }
            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                .title {
                    color: #626c78;
                }
            }
        }
    }
}
.fold-option-wrap-sticky {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    z-index: 1;
}
.fold-option-wrap-sticky-bg {
    background-color: white;
}
.fold-option-wrap-sticky-bg-dashboard {
    background-color: #e6f5fe;
}
</style>
