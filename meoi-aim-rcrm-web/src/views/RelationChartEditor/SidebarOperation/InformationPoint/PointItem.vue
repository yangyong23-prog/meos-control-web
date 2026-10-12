<template>
    <div
        v-ellipsis
        class="imformation-item"
        :class="[
            selectList?.some(code => code.infoCode === item.infoCode) &&
                item.parameterType !== i18n.global.t('rcrm_web.mark') &&
                'imformation-item-active',
            selectTagList?.some(code => code.infoCode === item.infoCode) &&
                item.parameterType === i18n.global.t('rcrm_web.mark') &&
                'imformation-item-active',
            item.disabled && 'imformation-item-disabled'
        ]"
        @mousedown="handleMouseDown"
        @click="ItemSelect(item)"
    >
        <template v-if="item.parameterType !== i18n.global.t('rcrm_web.mark')">{{ item.aliasName || item.name }}</template>
        <template v-else-if="btnSpecialNameInfoCodeMap[item.infoCode]">{{
            btnSpecialNameInfoCodeMap[item.infoCode]
        }}</template>
        <template v-else-if="item.dataSource">
            {{ getPrefix(item)
            }}<span v-for="(childItem, childIndex) in item.dataSource" :key="childItem.name">
                {{ childItem.name }}
                <span v-if="childIndex < item.dataSource.length - 1">/</span>
            </span>
        </template>
        <template v-else-if="item.infoCodeName">
            {{ item.infoCodeName }}
        </template>
    </div>
</template>
<script setup>
import { inject } from 'vue';
import { btnSpecialNameInfoCodeMap } from '@/views/Common/constant/index';
import { infoCodePrefix } from '@/views/Common/constant/index';
import i18n from '@/localization';

const isShiftDown = inject('isShiftDown');
const selectList = inject('selectList');
const selectTagList = inject('selectTagList');
const emit = defineEmits(['toggleSelect', 'toggleSelectTag']);
defineProps({
    item: {
        type: Object,
        default: () => {}
    }
});

const getPrefix = item => {
    return infoCodePrefix[item.infoCode] || '';
};

const handleMouseDown = event => {
    if (event.shiftKey) {
        isShiftDown.value = true;
    } else {
        isShiftDown.value = false;
    }
};
const ItemSelect = item => {
    if (item.parameterType === i18n.global.t('rcrm_web.mark')) {
        emit('toggleSelectTag', item);
    } else {
        emit('toggleSelect', item);
    }
};
</script>
<style lang="scss" scoped>
.imformation-item {
    cursor: pointer;
    padding: 9px 12px;
    color: #1b2129;
    font-size: 14px;
    line-height: 20px;
    border-radius: 4px;
    border: 1px solid #e1e5eb;

    @include text-ellipsis;
}
.imformation-item-active {
    color: #246fe5;
    border: 1px solid #246fe5;
    background: #ebf6ff;
}
.imformation-item-disabled {
    color: #626c78;
    border: 1px solid #e1e5eb;
    background: #f1f4f6;
    cursor: not-allowed;
}
</style>
