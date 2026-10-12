<template>
    <div class="header-wrap-box" :style="{ height: `${open ? rowNum * 44 : 44}px` }">
        <div ref="headerRef" class="loop-header-list-wrap">
            <div class="placeholder"></div>
            <slot></slot>
            <div class="right">
                <div v-show="toggleVisible" class="btn-wrap" @click="changeOpen">
                    <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                    <IconMeriComponentChevronDown color="#1B2129" class="arrow" :class="{ rotate: open }"></IconMeriComponentChevronDown>
                </div>
                <m-button type="link" size="medium" @click="queryChange('query')">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                <m-button type="link" size="medium" @click="queryChange('reset')">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
const props = defineProps({
    btnOpen: {
        type: Boolean,
        default: true
    },
    selectList: {
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['tableHeight', 'openChange', 'queryChange', 'truncatePositionChanged']);
const headerRef = ref(null);
const rowNum = ref(1);
const showFoldBtn = ref(true);
// 下拉框列表
const currentSelectList = ref([]);

// eslint-disable-next-line vue/no-setup-props-destructure
const open = ref(props.btnOpen);
// 是否展示展开收起按钮
const toggleVisible = ref(true);
// 筛选框截断位置
const truncatePosition = ref(0);
const queryChange = type => {
    emit('queryChange', type);
};
const setFoldBtnStatus = () => {
    nextTick(() => {
        try {
            const headerHeight = headerRef.value?.offsetHeight;
            const headerWidth = headerRef.value?.offsetWidth;
            const widthList = currentSelectList.value.map(res => res.width);
            const btnWidth = 150; // 展开收起按钮宽度
            const spaceWidth = 12 * widthList.length; // 间距宽度
            const totalWidth =
                widthList.reduce((prev, cur) => {
                    return prev + cur;
                }, 0) +
                btnWidth +
                spaceWidth;
            if (headerWidth > totalWidth) {
                toggleVisible.value = false;
            } else {
                toggleVisible.value = true;
            }
            let sum = 0;
            if (!toggleVisible.value) {
                truncatePosition.value = widthList.length;
                return;
            }
            for (let i = 0; i < widthList.length; i++) {
                sum += widthList[i] + 12;
                if (sum > headerWidth) {
                    truncatePosition.value = i - 1;
                    const total = sum - widthList[i - 1] - 12 + (btnWidth + 64 + 4);
                    if (total > headerWidth) {
                        truncatePosition.value = i - 1;
                    } else {
                        truncatePosition.value = i;
                    }
                    break;
                } else {
                    truncatePosition.value = i;
                }
            }
            if (headerHeight) {
                showFoldBtn.value = headerHeight > 35 ? true : false;
                rowNum.value = Math.ceil(headerHeight / 44);
                emit('tableHeight');
            } else {
                showFoldBtn.value = true;
            }
        } catch (err) {
            console.log('计算错误');
        }
    });
};
watch(
    () => props.btnOpen,
    v => {
        open.value = v;
    }
);
watch(
    () => props.selectList,
    v => {
        currentSelectList.value = [{ width: 282 }].concat(v);
    },
    {
        immediate: true
    }
);
watch(
    () => truncatePosition?.value,
    v => {
        emit('truncatePositionChanged', v);
    },
    {
        deep: true
    }
);
const changeOpen = () => {
    open.value = !open.value;
    emit('openChange', open.value);
    setFoldBtnStatus();
};

onMounted(() => setFoldBtnStatus());

window.addEventListener('resize', () => setFoldBtnStatus());
</script>
<style lang="less" scoped>
.header-wrap-box {
    overflow: hidden;
    transition: height 0.25s linear;
}
.loop-header-list-wrap {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    overflow: hidden;
    min-width: 250px;
    gap: 12px;
    .placeholder,
    .input-wrap {
        width: 282px;
        height: 32px;
    }

    .right {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 150px;
        .btn-wrap {
            display: flex;
            cursor: pointer;
            width: 62px;
            height: 32px;
            justify-content: center;
            align-items: center;
            .title {
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                color: #1b2129;
                user-select: none;
            }
            .icon {
                width: 18px;
                height: 18px;
            }
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .arrow {
        transition: transform 0.3s linear;
    }
    .rotate {
        transform: rotate(180deg);
        transition: transform 0.3s linear;
    }
}
</style>
