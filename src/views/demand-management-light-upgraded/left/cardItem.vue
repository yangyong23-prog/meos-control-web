<template>
    <div class="card-container" :class="{ isActive: curLeftConfigObj?.objectType === data.objectType }">
        <div class="card-title" :class="{ mb8: data.open }" @click="changeData">
            <IconMeriComponentChevronUp v-if="data.open" class="mr8" :size="16" color="#8B949E" />
            <IconMeriComponentChevronDown v-else class="mr8" :size="16" color="#8B949E" />
            <m-tag class="card-tag" size="small" :color="CONFIG_LEFT_OBJECT_TYPE_TO_TAG[data.objectType][1]" :bg-color="CONFIG_LEFT_OBJECT_TYPE_TO_TAG[data.objectType][2]">{{
                CONFIG_LEFT_OBJECT_TYPE_TO_TAG[data.objectType][0]
            }}</m-tag>
        </div>
        <template v-if="data.open">
            <div
                v-for="child in data?.children"
                :key="child.groupName"
                class="card-item"
                :class="{ activeItem: curLeftConfigObj?.objectType === data.objectType && curLeftConfigObjItem?.groupName === child.groupName }"
                @click="changeList(data, child)"
            >
                <m-popover theme="darkTransparent" :show-arrow="false" :disabled="!child?.instanceNames || child.objectType === 'PROJECT'">
                    <template #content>
                        <div style="max-width: 420px; overflow: auto">{{ i18n.global.t('meos_control_web.included_object') }} {{ child?.instanceNames }}</div>
                    </template>
                    <div>{{ child.groupName }}</div>
                </m-popover>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { CONFIG_LEFT_OBJECT_TYPE_TO_TAG } from '../constant/index';
import { toRefs } from 'vue';
import { curLeftConfigObjKey, curLeftConfigObjItemKey, isRightConfigEditKey } from '../hooks/useConfigCommonHook';
import { IconMeriComponentChevronUp, IconMeriComponentChevronDown } from 'meri-icon';

const curLeftConfigObj = inject(curLeftConfigObjKey);
const curLeftConfigObjItem = inject(curLeftConfigObjItemKey);
const isRightConfigEdit = inject(isRightConfigEditKey);

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['changeList']);
const changeData = () => {
    const { data } = toRefs(props);
    data.value.open = !data.value.open;
};
const changeList = (item, child) => {
    const isSelf = child?.relInstanceIds?.join('|') === curLeftConfigObjItem?.value?.relInstanceIds?.join('|');
    if (isRightConfigEdit.value && isSelf) {
        return;
    }
    emits('changeList', item, child);
};
</script>

<style lang="less" scoped>
.card-container {
    padding: 12px;
    margin-right: 16px;
    border-radius: 8px;
    border: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
    background: var(--Grey-Grey-0, #fff);
    margin-bottom: 12px;
    .card-title {
        height: 28px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .card-tag {
            user-select: none;
        }
    }
    .card-item {
        padding: 9px 8px 9px 24px;
        overflow: hidden;
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        line-height: 22px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    &:hover {
        padding: 11px;
        border: 2px solid var(--blue-500, #246fe5);
        background: var(--Grey-Grey-0, #fff);
        box-shadow: 0px 6px 2px 0px rgba(78, 138, 232, 0.04);
    }
    .activeItem {
        color: var(--blue-500, #246fe5);
        font-weight: 700;
        background: var(--blue-100, #d9ebff);
    }
}
.isActive {
    padding: 11px;
    border: 2px solid var(--blue-500, #246fe5);
    background: var(--Grey-Grey-0, #fff);
    box-shadow: 0px 6px 2px 0px rgba(78, 138, 232, 0.04);
}
</style>
