<template>
    <div class="fade-transition-container">
        <!-- 过渡动画列表 -->
        <TransitionGroup name="fade" tag="ul" class="item-list">
            <li v-for="(item, index) in items" :key="item.id" class="list-item" @click="removeItem(index)">
                {{ item.content }}
                <button class="delete-btn">×</button>
            </li>
        </TransitionGroup>

        <!-- 控制按钮 -->
        <div class="controls">
            <button class="add-btn" @click="addItem">添加项目</button>
            <button v-if="items.length > 0" class="shuffle-btn" @click="shuffleItems">随机排序</button>
            <button v-if="items.length > 0" class="clear-btn" @click="clearItems">清空列表</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 项目列表
const items = ref([
    { id: 1, content: '初始项目 1' },
    { id: 2, content: '初始项目 2' }
]);

// 生成唯一ID
const generateId = () => {
    return items.value.length > 0 ? Math.max(...items.value.map(item => item.id)) + 1 : 1;
};

// 添加项目
const addItem = () => {
    const newId = generateId();
    items.value.push({
        id: newId,
        content: `新项目 ${newId}`
    });
};

// 移除项目
const removeItem = index => {
    items.value.splice(index, 1);
};

// 清空列表
const clearItems = () => {
    items.value = [];
};

// 随机排序
const shuffleItems = () => {
    // 创建数组副本并打乱顺序
    const shuffled = [...items.value].sort(() => Math.random() - 0.5);
    // 替换原数组，触发TransitionGroup的重排序动画
    items.value = shuffled;
};
</script>

<style scoped>
.item-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.list-item {
    padding: 12px 16px;
    margin-bottom: 8px;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.list-item:hover {
    background-color: #f9fafb;
}

.delete-btn {
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 0;
    opacity: 0.7;
}

.delete-btn:hover {
    opacity: 1;
}

.controls {
    display: flex;
    gap: 10px;
}

.add-btn,
.shuffle-btn,
.clear-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.add-btn {
    background-color: #3b82f6;
    color: white;
}

.add-btn:hover {
    background-color: #2563eb;
}

.shuffle-btn {
    background-color: #f59e0b;
    color: white;
}

.shuffle-btn:hover {
    background-color: #d97706;
}

.clear-btn {
    background-color: #ef4444;
    color: white;
}

.clear-btn:hover {
    background-color: #dc2626;
}

/* 淡入淡出动画 */
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

/* 对于列表重排序的动画 */
.fade-move {
    transition: transform 0.5s ease;
}
</style>
