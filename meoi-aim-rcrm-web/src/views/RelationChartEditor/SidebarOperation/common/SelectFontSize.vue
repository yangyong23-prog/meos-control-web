<template>
    <div
        class="font-name"
        :class="{
            'font-name-overall': tabModel === 'OVERALL_LAYOUT',
            'font-name-detail': tabModel === 'DETAIL_ADJUSTMENT'
        }"
    >
        <span v-if="tabModel === 'OVERALL_LAYOUT'">设备名称字号</span>
        <span v-else>信息点字号<span class="remarks">（应用于全局）</span></span>
    </div>
    <m-select v-model="cardFontSize" :options="list" :size="300" :width="300" @change="modifyCardFontSize"> </m-select>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    // OVERALL_LAYOUT 整体布局调整 DETAIL_ADJUSTMENT 细节调整
    tabModel: {
        type: String,
        default: ''
    },
    fontSize: {
        type: Number
    }
});
const emits = defineEmits(['change', 'update:fontSize']);
const list = ref([
    {
        id: 20,
        name: '20px'
    },
    {
        id: 24,
        name: '24px'
    },
    {
        id: 28,
        name: '28px'
    },
    {
        id: 32,
        name: '32px'
    },
    {
        id: 36,
        name: '36px'
    },
    {
        id: 40,
        name: '40px'
    }
]);

const cardFontSize = computed({
    get() {
        console.log('props.fontSize>>>', props.fontSize);

        return props.fontSize;
    },
    set(val) {
        emits('update:fontSize', val);
    }
});

const modifyCardFontSize = id => {
    emits('change', id);
};
</script>

<style lang="scss" scoped>
.font-name {
    height: 22px;
    line-height: 22px;
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
    .remarks {
        color: #8b949e;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    }
}
</style>
