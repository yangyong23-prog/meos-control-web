<template>
    <div class="scroll-container">
        <!-- 固定高度容器，仅显示3条内容 -->
        <div class="visible-area overflow-hidden" :style="{ height: containerHeight }">
            <!-- 使用TransitionGroup实现动画效果 -->
            <TransitionGroup name="slide" tag="div" class="list-wrapper" :style="{ transform: `translateY(-${scrollOffset}px)` }">
                <div v-for="(item, index) in displayedItems" :key="item.id" class="list-item" :style="{ height: itemHeight }" :data-index="index">
                    {{ item.content }}
                </div>
            </TransitionGroup>
        </div>

        <!-- 控制按钮 -->
        <!-- <div class="controls mt-4">
      <button @click="addItem" class="add-btn bg-blue-500 text-white px-4 py-2 rounded">
        {{ i18n.global.t('meos_control_web.add_new_item') }}
      </button>
      <button @click="clearItems" class="clear-btn bg-gray-500 text-white px-4 py-2 rounded ml-2">
        {{ i18n.global.t('meos_control_web.empty_all') }}
      </button>
    </div> -->
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref, computed, watch, nextTick } from 'vue';

// 组件属性
const props = defineProps({
    // 每条项目的高度
    itemHeight: {
        type: String,
        default: '30px'
    },
    // 初始项目列表
    initialItems: {
        type: Array,
        default: () => []
    }
});

// 状态管理
const items = ref([...props.initialItems]);
const scrollOffset = ref(0);
const isScrolling = ref(false);
const itemHeightNum = ref(parseFloat(props.itemHeight));

// 初始化项目
if (props.initialItems.length > 0) {
    items.value = props.initialItems.map((item, index) => ({
        id: index,
        content: item
    }));
}

// 计算属性
const displayedItems = computed(() => {
    // 始终显示所有项目，但通过容器高度限制可视范围
    return items.value;
});

const containerHeight = computed(() => {
    // 容器高度 = 3条项目高度
    return `calc(3 * ${props.itemHeight})`;
});

const shouldScroll = computed(() => {
    // 当项目数超过3时需要滚动
    return items.value.length > 3;
});

// 监听项目数量变化，实现滚动效果
watch(
    () => items.value.length,
    (newLength, oldLength) => {
        // 只有当新增项目且数量超过3时才触发滚动
        if (newLength > oldLength && newLength > 3) {
            triggerScroll();
        }
    }
);

watch(
    () => props.initialItems,
    newVal => {
        if (newVal && newVal.length) {
            items.value = newVal.map((item, index) => ({
                id: index,
                content: item
            }));
        } else {
            clearItems();
        }
    },
    {
        deep: true
    }
);

// 方法
const addItem = () => {
    // 添加新项
    const newId = items.value.length > 0 ? Math.max(...items.value.map(item => item.id)) + 1 : 1;

    items.value.push({
        id: newId,
        content: `${i18n.global.t('meos_control_web.new_project')} ${newId}`
    });
};

const clearItems = () => {
    items.value = [];
    scrollOffset.value = 0;
};

const triggerScroll = async () => {
    if (isScrolling.value) return;

    isScrolling.value = true;

    // 计算新的滚动偏移量（每次滚动一个项目高度）
    const newOffset = scrollOffset.value + itemHeightNum.value;

    // 应用滚动效果
    await nextTick();
    scrollOffset.value = newOffset;

    // 滚动完成后重置状态
    setTimeout(() => {
        isScrolling.value = false;
    }, 500); // 与CSS过渡时间一致
};

// 监听项目高度变化
watch(
    () => props.itemHeight,
    newHeight => {
        itemHeightNum.value = parseFloat(newHeight);
    }
);
</script>

<style scoped>
.scroll-container {
    margin: 15px 0;
}
.overflow-hidden {
    overflow: hidden;
}
.visible-area {
    position: relative;
    /* border: 1px solid #e0e0e0; */
    /* border-radius: 6px; */

    /* background-color: #3b82f6; */
    margin: 15px 0;
    text-align: center;
}

.list-wrapper {
    transition: transform 0.5s ease-out;
}

.list-item {
    display: flex;
    align-items: center;
    padding: 0 16px;
    /* border-bottom: 1px solid #f0f0f0; */
    background-color: white;
    box-sizing: border-box;
}

.list-item:last-child {
    border-bottom: none;
}

/* 入场动画 */
.slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
    height: 0;
    padding: 0 16px;
}

.slide-enter-active {
    transition: opacity 0.5s ease-out, transform 0.5s ease-out, height 0.5s ease-out, padding 0.5s ease-out;
}

.slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

/* 退场动画（当需要移除项目时） */
.slide-leave-from {
    opacity: 1;
    height: var(--item-height);
    padding: 0 16px;
    color: red;
}

.slide-leave-active {
    transition: opacity 0.5s ease-in, transform 0.5s ease-in, height 0.5s ease-in, padding 0.5s ease-in;
    position: absolute;
    width: 100%;
}

.slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    height: 0;
    padding: 0 16px;
}

/* 按钮样式 */
.add-btn,
.clear-btn {
    cursor: pointer;
    transition: background-color 0.2s;
}

.add-btn:hover {
    background-color: #3b82f6;
}

.clear-btn:hover {
    background-color: #6b7280;
}
</style>
