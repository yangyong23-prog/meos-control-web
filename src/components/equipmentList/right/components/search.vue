<template>
    <header class="header-container">
        <div class="sblb-header" :style="{ height: open ? 'auto' : '44px' }">
            <div ref="headerRef" :class="['header-list-wrap', open ? 'open' : '']">
                <div class="left" :style="{ maxWidth: open ? '100%' : leftWidth + 'px' }">
                    <div v-if="searchOptions?.length > 1" class="search-wrap" style="width: 260px; display: flex">
                        <div class="search-select" style="">
                            <m-select v-model="searchTarget" noborder :options="searchOptions" :size="90" popover-class="common-input-wrap-select-box"> </m-select>
                        </div>
                        <m-search
                            ref="searchRef"
                            v-model="searchContent"
                            style="margin-left: -4px"
                            :placeholder="`${i18n.global.t('meos_control_web.press_enter_to_search')}`"
                            type="enter"
                            :width="170"
                            :clearable="true"
                            @input="onInputDelay"
                            @clear="onSearch(true)"
                            @change="onSearch(false)"
                        >
                        </m-search>
                    </div>
                    <m-search
                        v-else
                        ref="searchRef"
                        v-model="searchContent"
                        :placeholder="`${i18n.global.t('meos_control_web.press_enter_search_equipment_name')}`"
                        :prefix="`${i18n.global.t('meos_control_web.equipment_name_colon')}`"
                        type="enter"
                        :width="260"
                        :clearable="true"
                        @input="onInputDelay"
                        @clear="onSearch(true)"
                        @change="onSearch(false)"
                    >
                    </m-search>
                    <div v-for="(item, index) in showInHeader" :key="index" class="input-wrap">
                        <m-select
                            v-if="item.type === 'select'"
                            v-model="item.value"
                            multiple
                            has-check-all
                            :options="item.options"
                            :prefix="item.showTitle + '：'"
                            :clearable="true"
                            :menu-size="260"
                            popover-class="common-input-wrap-select-box"
                            @change="
                                v => {
                                    change(index, v);
                                }
                            "
                        >
                        </m-select>
                        <m-tree-select
                            v-else-if="item.type === 'treeSelect'"
                            v-model="item.value"
                            multiple
                            :options="item.options"
                            :prefix="item.showTitle + '：'"
                            :clearable="true"
                            :menu-size="260"
                            popover-class="common-input-wrap-select-box"
                            @change="
                                v => {
                                    change(index, v);
                                }
                            "
                        >
                        </m-tree-select>
                    </div>
                    <div v-if="open" class="right">
                        <m-tips v-if="showInExpand.length > 0" trigger="click">
                            <template #content>
                                <div v-for="(item, index) in showInExpand" :key="index" style="margin-bottom: 10px">
                                    <m-select
                                        v-if="item.type === 'select'"
                                        v-model="item.value"
                                        multiple
                                        has-check-all
                                        :options="item.options"
                                        :prefix="item.showTitle + '：'"
                                        :clearable="true"
                                        :menu-size="240"
                                        popover-class="common-input-wrap-select-box"
                                        @change="
                                            v => {
                                                change(index + showInHeader.length, v);
                                            }
                                        "
                                    >
                                    </m-select>
                                </div>
                            </template>
                            <span class="filter-box">
                                <span v-if="showInExpandHasValueNum > 0" class="dot-number">{{ showInExpandHasValueNum }}</span>
                                <filterSvg></filterSvg>
                            </span>
                        </m-tips>
                        <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                            <span class="title">{{ i18n.global.t('meos_control_web.collapse') }}</span>
                            <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
                        </div>
                        <div class="header-btn">
                            <m-button type="link" size="medium" @click="onSearch('query')">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                            <m-button type="link" size="medium" @click="reset()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
                        </div>
                    </div>
                </div>
                <div v-if="!open" class="right">
                    <div v-if="showFoldBtn" class="btn-wrap" @click="changeOpen">
                        <span class="title">{{ open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</span>
                        <IconMeriComponentChevronDown color="#1b2129" class="arrow" :class="{ rotate: open }" />
                    </div>
                    <div class="header-btn">
                        <m-button type="link" size="medium" @click="onSearch('query')">{{ i18n.global.t('meos_control_web.query') }}</m-button>
                        <m-button type="link" size="medium" @click="reset()">{{ i18n.global.t('meos_control_web.reset') }}</m-button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import i18n from '@/localization';
import { useHeaderHook } from '../../hooks/useHeaderHook';
import { IconMeriComponentChevronDown } from 'meri-icon';
import { useElementSize } from '@vueuse/core';
import { searchListKey, refreshTableFnKey, tableQueryParamsKey } from '../../hooks/useTableDataHook';
import filterSvg from '@/assets/svg/filter.svg';
import _ from 'lodash';
import { isIotInfoType } from '@/utils/infoTemplate';
// 搜索hooks
const { changeOpen, headerRef, columnNum, open, setFoldBtnStatus } = useHeaderHook();
const { width: headerWidth } = useElementSize(headerRef);

const searchList = inject(searchListKey);
const refreshTableFn = inject(refreshTableFnKey);
const tableQueryParams = inject(tableQueryParamsKey);

const showInHeader = ref([]);
const showInExpand = ref([]);
const searchListTemp = ref([]);
const searchRef = ref();

const searchTarget = ref('localName');
const searchContent = ref('');

const getShowTitle = obj => {
    return obj.searchName;
};

const searchOptions = computed(() => {
    const arr = [
        {
            id: 'localName',
            name: i18n.global.t('meos_control_web.equipment_name')
        }
    ];
    searchList.value?.forEach(obj => {
        if (!obj.dataSource?.length) {
            arr.push({
                ...obj,
                id: obj.infoCode,
                name: getShowTitle(obj)
            });
        }
    });
    return arr;
});

watchEffect(() => {
    const searchs = structuredClone(searchList.value);
    searchListTemp.value = searchs?.filter(obj => {
        const isNotInput = obj.dataSource?.length > 0;
        if (isNotInput) {
            obj.type = 'select';
            obj.options = obj.dataSource?.map(opt => ({ ...opt, id: opt.code }));
            obj.showTitle = getShowTitle(obj);
        }
        return isNotInput;
    });
    showInHeader.value = searchListTemp.value.filter((item, index) => {
        return index < columnNum.value * 3 - 2;
    });
    showInExpand.value = searchListTemp.value.filter((item, index) => {
        return index >= columnNum.value * 3 - 2;
    });
    console.log(searchListTemp.value, showInHeader.value, showInExpand.value);
});

const leftColumns = computed(() => {
    return searchListTemp.value.length + 1;
});

const showFoldBtn = computed(() => {
    return leftColumns.value > Math.floor((headerWidth.value - 96) / 272);
});

const leftWidth = computed(() => {
    let offset = 96;
    if (showFoldBtn.value) {
        offset = 186;
    }
    return Math.min(leftColumns.value, Math.floor((headerWidth.value - offset) / 272)) * 272;
});

const showInExpandHasValueNum = computed(() => {
    return searchListTemp.value.filter((item, index) => {
        const isValidValue = Array.isArray(item.value) ? item.value?.length > 0 : !!item.value;
        return index >= columnNum.value * 3 - 2 && isValidValue;
    }).length;
});
const getQueryParams = () => {
    const dynamicInfoCodeFilters = [];
    const staticInfoCodeFilters = [];
    if (searchContent.value) {
        const info = searchOptions.value?.find(obj => obj.id === searchTarget.value);
        if (info?.infoCodeType && isIotInfoType(info?.infoCodeType)) {
            dynamicInfoCodeFilters.push({
                infoCode: info.infoCode,
                dataValue: searchContent.value
            });
        } else {
            staticInfoCodeFilters.push({
                infoCode: searchTarget.value,
                sign: '$like',
                dataValue: searchContent.value
            });
        }
    }
    searchListTemp.value?.forEach(obj => {
        const isValidValue = Array.isArray(obj.value) ? obj.value?.length > 0 : !!obj.value;
        if (isValidValue) {
            if (obj?.infoCodeType && isIotInfoType(obj?.infoCodeType)) {
                dynamicInfoCodeFilters.push({
                    infoCode: obj.infoCode,
                    dataValue: obj.value
                });
            } else {
                staticInfoCodeFilters.push({
                    infoCode: obj.infoCode,
                    dataValue: obj.value
                });
            }
        }
    });
    return {
        dynamicInfoCodeFilters,
        staticInfoCodeFilters
    };
};
// 输入事件
const onInputDelay = e => {
    searchContent.value = e.target.value.trim();
};

const onSearch = () => {
    tableQueryParams.value = { ...tableQueryParams.value, ...getQueryParams() };
    // console.log('searchListTemp.value', getQueryParams());
    refreshTableFn(true);
};

const reset = () => {
    // 暂时只删除信息点参数，后面有服务空间，所在空间之后再改
    delete tableQueryParams.value.dynamicInfoCodeFilters;
    delete tableQueryParams.value.staticInfoCodeFilters;

    searchListTemp.value?.forEach(obj => {
        obj.value = '';
    });
    // console.log('searchContent.value: ', searchContent.value);
    if (searchContent.value) {
        searchRef.value?.clearInp();
        searchContent.value = '';
    }
    // console.log(searchListTemp.value);
    refreshTableFn(true);
};

const input = (index, e) => {
    searchListTemp.value[index].value = e.target.value;
};

const change = (index, v) => {
    searchListTemp.value[index].value = v;
};
onMounted(() => {
    console.log(1111);
});
</script>

<style lang="less" scoped>
.header-container {
    display: flex;
    justify-content: flex-start;
    position: relative;
    z-index: 11;
    .sblb-header {
        padding: 0 0 0 16px;
        padding-top: 12px;
        box-sizing: content-box;
        border: none;
        overflow: hidden;
        width: 100%;
        transition: height 0.25s linear;
        .header-list-wrap {
            display: flex;
            width: 100%;
            justify-content: flex-start;
            &.open {
                flex-direction: column;
                .left {
                    .right {
                        width: 260px;
                        display: flex;
                        align-items: center;
                        .filter-box {
                            display: inline-flex;
                            width: 32px;
                            height: 32px;
                            justify-content: center;
                            align-items: center;
                            border-radius: 6px;
                            &:hover {
                                cursor: pointer;
                                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                            }
                            position: relative;
                            .dot-number {
                                position: absolute;
                                border-radius: 9px;
                                display: inline-block;
                                width: 18px;
                                height: 18px;
                                line-height: 18px;
                                text-align: center;
                                background: var(--blue-500, #246fe5);
                                color: #ffffff;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                left: 20px;
                                top: -4px;
                            }
                        }
                    }
                }
                .right {
                    margin-bottom: 12px;
                }
            }
            .left {
                display: flex;
                overflow: hidden;
                min-width: 260px;
                flex-grow: 1;
                flex-wrap: wrap;
                gap: 12px;
                .search-wrap {
                    width: 270px;
                    display: flex;
                    .search-select {
                        z-index: 2;
                        height: 32px;
                        border-radius: 4px 0 0 4px;
                        border: 1px solid var(--gray-400, #c4c9cf);
                        background: var(--gray-200, #e8ecf0);
                    }
                }
                .placeholder,
                .input-wrap {
                    width: 260px;
                    height: 32px;
                    :deep(.m-select-wrap) {
                        width: 260px !important;
                        .m-select-inner {
                            width: 260px !important;
                            display: flex;
                            align-items: center;
                            flex-wrap: nowrap;
                        }
                    }
                    :deep(.m-select-inner-prefix) {
                        max-width: 148px;
                        display: inline-block;
                    }
                }
                .input-wrap-service {
                    height: 32px;
                    display: flex;
                    width: 260px;
                    align-items: center;
                    overflow: hidden;
                    .input-select-left {
                        border-top-left-radius: 4px;
                        padding: 4px 8px;
                        text-align: center;
                        white-space: nowrap;
                        box-sizing: border-box;
                        border-bottom-left-radius: 4px;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        width: 72px;
                        border: 1px solid rgba(196, 201, 207, 1);
                        border-right: none;
                        background: var(--gray-200, #e8ecf0);
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 22px;
                        letter-spacing: 0px;
                        color: rgba(27, 33, 41, 1);
                    }
                    :deep(.m-select-wrap) {
                        .m-select-inner {
                            width: 90px !important;
                            border-top-right-radius: 0;
                            border-bottom-right-radius: 0;
                            border-right: none;
                            background: var(--gray-200, #e8ecf0);
                        }
                    }
                    :deep(.m-cascader) {
                        .m-select-inner {
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                        .m-cascader__result {
                            border-top-left-radius: 0;
                            border-bottom-left-radius: 0;
                        }
                    }
                }
            }

            .right {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .btn-wrap {
                    display: flex;
                    cursor: pointer;
                    // width: 62px;
                    height: 32px;
                    padding: 4px 8px;
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
                    &:hover {
                        border-radius: 4px;
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
            }

            .arrow {
                transition: transform 0.3s linear;
            }
            .rotate {
                transform: rotate(180deg);
                transition: transform 0.3s linear;
            }
        }
    }
    .header-btn {
        display: flex;
        margin-right: 16px;
    }
}
</style>
