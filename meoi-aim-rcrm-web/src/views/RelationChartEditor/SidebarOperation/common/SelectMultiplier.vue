<template>
    <div class="fc">
        <span class="multiplier-title">小附件大小：{{ currentValue }}x</span>
        <m-popconfirm @confirm="changePassByScale">
            <template #main="">
                <div class="pop-content">
                    <span class="remark">该设置应用于同类所有小附件</span>
                    <m-select v-model="selectValue" prefix="倍数：" :options="list" :size="260" :width="260">
                    </m-select>
                </div>
            </template>
            <m-button type="link" size="small">设置</m-button>
        </m-popconfirm>
    </div>
</template>

<script setup>
import { $Message } from 'meri-plus';
import { ref, watchEffect } from 'vue';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    nowMultiplier: {
        type: Number,
        default: 1
    }
});
const emit = defineEmits(['changePassByScale']);

const currentValue = ref('');
const selectValue = ref('');

const list = ref([
    { id: '0.5', name: '0.5x' },
    { id: '1', name: '1x' },
    { id: '2', name: '2x' },
    { id: '3', name: '3x' },
    { id: '4', name: '4x' }
]);

const changePassByScale = () => {
    if (!selectValue.value) {
        $Message.error({
            title: '请选择小附件倍数',
            showClose: true
        });
        return;
    }
    emit('changePassByScale', Number(selectValue.value));
};

watchEffect(() => {
    if (props.nowMultiplier) {
        currentValue.value = props.nowMultiplier.toString();
    }
});
</script>

<style lang="scss" scoped>
.multiplier-title {
    @include font-size-color(14px, #2e3742, 'Microsoft YaHei UI');

    flex: 1;
    font-weight: 700;
    height: 22px;
    line-height: 22px;
}
.pop-content {
    display: flex;
    flex-direction: column;
    .remark {
        color: #8b949e;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 8px;
    }
}
</style>
