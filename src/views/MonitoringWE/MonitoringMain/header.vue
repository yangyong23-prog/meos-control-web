<template>
    <div class="header-warp">
        <m-popover
            style="pointer-events: none"
            placement="top"
            :enterable="false"
            :disabled="!graphUpdating"
            theme="darkTransparent"
            :show-arrow="false"
            :content="i18n.global.t('meos_control_web.frequent_switch_wait')"
        >
            <div>
                <m-select
                    v-model="curSystemValue"
                    :class="graphUpdating ? 'disabled' : 'normal'"
                    noborder
                    :disabled="graphUpdating"
                    :clearable="false"
                    panel-searchable
                    size="auto"
                    :menu-size="240"
                    :options="systemList"
                    @change="changeSystem"
                >
                </m-select>
            </div>
        </m-popover>
        <MapSearch
            :equips="searchValue"
            :equip-filter-fn="equipFilterFn"
            @choose="chooseObj"
        ></MapSearch>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import MapSearch from './headerSearch.vue';
import { searchDataListKey, systemListKey, curSystemItemKey, graphUpdatingKey } from '../hooks/useCommonConfig';
import { closeDetailDrawerInjectKey } from '../hooks/useDrawerCommon';

const searchValue = inject(searchDataListKey);
const curSystemItem = inject(curSystemItemKey);
const systemList = inject(systemListKey);
const closeDetailDrawerInject = inject(closeDetailDrawerInjectKey);
const graphUpdating = inject(graphUpdatingKey);
const curSystemValue = ref('');
const curSearchValue = ref('');
const emits = defineEmits(['selectedNode']);

const equipFilterFn = equip => {
    return equip?.localName?.includes(curSearchValue.value);
};

watchEffect(() => {
    curSystemValue.value = curSystemItem?.value?.id;
});

const chooseObj = obj => {
    emits('selectedNode', obj?.id);
};

const changeSystem = id => {
    curSystemItem.value = systemList.value.find(item => item.id === id);
    closeDetailDrawerInject();
};
</script>

<style lang="less" scoped>
.header-warp {
    position: absolute;
    width: 100%;
    height: 52px;
    padding: 16px 0 0 16px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    :deep(.m-select-inner-value) {
        font-size: 18px;
        font-weight: 700;
        line-height: 26px;
    }
    .normal {
        color: var(--gray-900, #1b2129);
    }
    .disabled {
        color: '#C4C9CF';
    }
}
</style>
