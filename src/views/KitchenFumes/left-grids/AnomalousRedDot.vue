<template>
    <div>
        <!-- 异常 -->
        <!-- <template v-if="type == '1'">
            <div class="red-dot bg-c"></div>
            <div class="mark-animation bg-c"></div>
        </template> -->
        <!-- 控反不一致 -->
        <!-- <template v-if="type == '2'">
            <div class="red-dot bg-k"></div>
            <div class="mark-animation bg-k"></div>
        </template> -->
        <!-- 多种状态 -->
        <template v-if="type?.length">
            <template v-if="type.includes(1) && type.includes(2) && type.includes(3)">
                <div class="multistate">
                    <div class="red-dot bg-l"></div>
                    <div class="red-dot bg-k"></div>
                    <div class="red-dot bg-c"></div>
                </div>
                <div class="mark-animation bg-c"></div>
            </template>
            <template v-else-if="type.includes(1) && type.includes(2)">
                <div class="multistate1">
                    <div class="red-dot bg-k"></div>
                    <div class="red-dot bg-c"></div>
                </div>
                <div class="mark-animation bg-c"></div>
            </template>
            <template v-else-if="type.includes(1) && type.includes(3)">
                <div class="multistate2">
                    <div class="red-dot bg-l"></div>
                    <div class="red-dot bg-c"></div>
                </div>
                <div class="mark-animation bg-c"></div>
            </template>
            <template v-else-if="type.includes(2) && type.includes(3)">
                <div class="multistate3">
                    <div class="red-dot bg-l"></div>
                    <div class="red-dot bg-k"></div>
                </div>
                <div class="mark-animation bg-k"></div>
            </template>
            <template v-else-if="type.includes(1)">
                <div class="red-dot bg-c"></div>
                <div class="mark-animation bg-c"></div>
            </template>
            <template v-else-if="type.includes(2)">
                <div class="red-dot bg-k"></div>
                <div class="mark-animation bg-k"></div>
            </template>
            <template v-else-if="type.includes(3)">
                <div class="red-dot bg-l"></div>
            </template>
        </template>
        <!-- 离线 -->
        <!-- <template v-if="type == '4'">
            <div class="red-dot bg-l"></div>
        </template> -->

        <!-- 红点 -->
        <template v-if="type == '5'">
            <div class="red-dot bg-c"></div>
        </template>
    </div>
</template>
<script setup>
const props = defineProps({
    type: {
        type: Array,
        default: () => []
    },
    abnormalFloors: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.red-dot {
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    position: absolute;
    right: 2px;
    top: 0px;
}
.mark-animation {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    opacity: 0.2;
    right: -2px;
    top: -4px;
    animation: mark-animation 2s cubic-bezier(0, 0, 0.25, 1) infinite;
    pointer-events: none;
}
// 动画 变大再变小
@keyframes mark-animation {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(2);
        opacity: 0.2;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
.bg-c {
    background-color: #f55047;
}
.bg-k {
    background-color: #ff9d00;
}
.bg-l {
    background-color: #8b949e;
}
.multistate {
    .bg-l {
        position: absolute;
        right: 8px !important;
    }
    .bg-k {
        position: absolute;
        right: 5px !important;
    }
}
.multistate1 {
    .bg-c {
        position: absolute;
        right: 3px !important;
    }
    .bg-k {
        position: absolute;
        right: 6px !important;
    }
}
.multistate2 {
    .bg-c {
        position: absolute;
        right: 3px !important;
    }
    .bg-l {
        position: absolute;
        right: 6px !important;
    }
}
.multistate3 {
    .bg-k {
        position: absolute;
        right: 3px !important;
    }
    .bg-l {
        position: absolute;
        right: 6px !important;
    }
}
</style>
