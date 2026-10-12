<template>
    <div
        class="font-name"
        :class="{
            'font-name-overall': tabModel === 'OVERALL_LAYOUT',
            'font-name-detail': tabModel === 'DETAIL_ADJUSTMENT'
        }"
    >
        {{ tabModel === 'OVERALL_LAYOUT' ? '文本框最大宽度' : '信息卡片宽度' }}
        <span v-if="tabModel === 'DETAIL_ADJUSTMENT' && currentChooseModles?.length > 1" class="remark"
            >已选宽度区间（{{ min }}～{{ max }}）</span
        >
    </div>
    <m-input-number
        v-model="cardWidth"
        text-align="left"
        controls="rightButton"
        :width="300"
        :error-text="cardWidthErrorText"
        :precision="0"
        @blur="modifyCardWidth"
        @keyup.enter="modifyCardWidth"
    >
        <template #suffix>px</template>
    </m-input-number>
</template>

<script setup>
import { computed, ref, watch, inject } from 'vue';
const currentChooseModles = inject('currentChooseModles');
const props = defineProps({
    // OVERALL_LAYOUT 整体布局调整 DETAIL_ADJUSTMENT 细节调整
    tabModel: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: null
    },
    cardWidthErrorText: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['change', 'update:width']);
const modifyCardWidth = event => {
    emit('change', event);
};

const cardWidth = computed({
    get() {
        return props.width;
    },
    set(val) {
        emit('update:width', val);
    }
});
const max = ref(0);
const min = ref(0);

watch(
    currentChooseModles,
    () => {
        if (!currentChooseModles || !currentChooseModles.value) {
            max.value = null;
            min.value = null;
            return;
        }
        const widthList = currentChooseModles?.value.map(item => item.width);
        // 获取最大值
        max.value = Math.max(...widthList);
        // 获取最小值
        min.value = Math.min(...widthList);
    },
    {
        immediate: true
    }
);
</script>

<style lang="scss" scoped>
.font-name {
    height: 22px;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    .remark {
        color: #8b949e;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
    }
}
.font-name-overall {
    color: #8b949e;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 4px;
}
.font-name-detail {
    color: #2e3742;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
}
</style>
