<template>
    <div ref="modeltopfilterRef" class="modal-top-filter-bar fc" :style="{ height: open ? '80px' : '40px' }">
        <div ref="" class="modal-table-fitler-wrap" :style="{ justifyContent: open ? 'flex-start' : 'flex-end' }">
            <div class="modal-table-fitler-wrap-title">{{ i18n.global.t('meos_control_web.loop_list') }}</div>
            <m-search
                ref="search"
                v-model="query.name"
                :placeholder="i18n.global.t('meos_control_web.search_lighting_loop_name')"
                class="filter-noborder-input"
                immediate
                type="enter"
                :size="240"
                :width="240"
                @input="onInputDelay"
                @change="pageChange(1)"
                @clear="pageChange(1)"
            >
            </m-search>
            <m-select
                v-model="query.settingModes"
                :prefix="i18n.global.t('meos_control_web.switch_demand_colon')"
                multiple
                clearable
                has-check-all
                :options="settingModeOptions"
                :size="200"
            >
            </m-select>
            <m-select
                v-model="query.funcTypes"
                :prefix="i18n.global.t('meos_control_web.function_type_colon')"
                multiple
                clearable
                has-check-all
                :options="funcTypeOpts"
                :size="200"
            >
            </m-select>
            <m-select
                v-model="query.lampFuncTypes"
                :prefix="i18n.global.t('meos_control_web.luminaire_type_colon')"
                multiple
                clearable
                :options="lampOpts"
                has-check-all
                :size="200"
            >
            </m-select>
            <m-tree-select
                v-if="publicAreaVisible"
                v-model="query.relSpaces"
                :prefix="i18n.global.t('meos_control_web.served_space_colon')"
                has-check-all
                clearable
                :data="relSpaces"
                multiple
                panel-searchable
                :size="200"
            >
            </m-tree-select>
            <m-tree-select
                v-model="query.relControllers"
                :prefix="i18n.global.t('meos_control_web.related_lighting_controller_colon')"
                clearable
                :data="relControllers"
                has-check-all
                multiple
                panel-searchable
                :size="200"
            >
            </m-tree-select>
            <div v-if="open" class="right">
                <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                    <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                    <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
                </div>
                <div class="header-btn">
                    <m-button type="link" size="medium" @click="pageChange(1)">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                    <m-button type="link" size="medium" @click="clear()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
                </div>
            </div>
        </div>
        <div v-if="!open" class="modal-table-fitler-wrap-right">
            <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
            </div>
            <div class="header-btn">
                <m-button type="link" size="medium" @click="pageChange(1)">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                <m-button type="link" size="medium" @click="clear()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useElementSize } from '@vueuse/core';
import { IconMeriComponentChevronDown } from 'meri-icon';
import { publicAreaVisibleKey } from '../../../hooks/useGlobalData';
import { SMD_CLOSE, SMD_OPEN, NOT_CONFIGURED, FEEDBACK_ADJUSTMENT } from '@/views/demand-management-light-upgraded/constant/index';
import { funcTypeOptsKey, lampOptsKey, relControllersKey, relSpacesKey } from '@/views/demand-management-light-upgraded/hooks/useConfigPreviewHook';
import { configPreviewModalTableQueryKey, configPreviewPageKey, configPreviewFilterFuncKey } from '@/views/demand-management-light-upgraded/hooks/useConfigPreviewFilterHook';
import i18n from '@/localization';

const query = inject(configPreviewModalTableQueryKey);
const page = inject(configPreviewPageKey);
const search = ref();
const modeltopfilterRef = ref();
const { width } = useElementSize(modeltopfilterRef);
const open = ref(false);
const showFoldBtn = computed(() => {
    if (publicAreaVisible.value) {
        return width.value < 1500;
    } else {
        return width.value < 1280;
    }
});
const emit = defineEmits(['clear']);
const publicAreaVisible = inject(publicAreaVisibleKey);
const calcuLateData = inject(configPreviewFilterFuncKey);
const settingModeOptions = [
    {
        id: SMD_OPEN,
        name: i18n.global.t('meos_control_web.on')
    },
    {
        id: SMD_CLOSE,
        name: i18n.global.t('meos_control_web.off')
    },
    ...(publicAreaVisible.value
        ? [
              {
                  id: FEEDBACK_ADJUSTMENT,
                  name: i18n.global.t('meos_control_web.feedback_adjustment')
              },
              {
                  id: NOT_CONFIGURED,
                  name: i18n.global.t('meos_control_web.unconfiged')
              }
          ]
        : [
              {
                  id: NOT_CONFIGURED,
                  name: i18n.global.t('meos_control_web.unconfiged')
              }
          ])
];
const funcTypeOpts = inject(funcTypeOptsKey);
const lampOpts = inject(lampOptsKey);
const relControllers = inject(relControllersKey);
const relSpaces = inject(relSpacesKey);
const onInputDelay = e => {
    query.value.name = e.target.value.trim();
};
const pageChange = val => {
    page.value.current = val;
    calcuLateData();
};
const changeOpen = () => {
    open.value = !open.value;
};
const clear = () => {
    search.value?.clearInp();
    search.value?.searchHide();
    emit('clear');
};
</script>
<style lang="less" scoped>
.modal-top-filter-bar {
    display: flex;
    height: 48px;
    flex-direction: row;
    overflow: hidden;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    flex-shrink: 0;
    transition: all 0.1s ease;
    gap: 8px;
    max-width: 100%;
    .modal-table-fitler-wrap-right {
        display: flex;
        position: relative;
        flex-direction: row;
        justify-content: flex-end;
        gap: 8px;
        white-space: nowrap;
        flex-wrap: nowrap;
    }
    .modal-table-fitler-wrap {
        display: flex;
        width: 100%;
        position: relative;
        flex-direction: row;
        justify-content: flex-end;
        gap: 8px;
        white-space: nowrap;
        flex-wrap: wrap;
        .filter-noborder-input {
            margin-left: 78px;
        }
        .modal-table-fitler-wrap-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            justify-self: flex-start;
            position: absolute;
            left: 0;
            top: 0;
            height: 32px;
        }
        .right {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
        }
        .modal-table-fitler-wrap-operate {
            display: flex;
            gap: 8px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            flex-wrap: nowrap;
        }
    }
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
            user-select: none;
        }
        .icon {
            width: 18px;
            height: 18px;
        }
        .rotate {
            transform: rotate(180deg);
            transition: transform 0.3s linear;
        }
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
</style>
