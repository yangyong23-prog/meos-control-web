<template>
    <div class="operation-log">
        <div class="operation-log__banner">
            <div class="operation-log__banner_title">{{ i18n.global.t('meos_control_web.operation_log') }}</div>
            <m-date-picker
                v-model="logTimeValue"
                :width="346"
                time-format="hm"
                type="datetimerange"
                :placeholder="i18n.global.t('meos_control_web.select_time_range')"
                :caption="i18n.global.t('meos_control_web.log_time_colon')"
                :time-picker="{
                    format: 'hm'
                }"
                :clearable="false"
                :max-allowed-days="7"
                class="mr12"
                @change="changeLogCategoryList"
            ></m-date-picker>
            <m-select
                v-model="markValue"
                class="operation-log__banner_mark mr12"
                :prefix="i18n.global.t('meos_control_web.log_id_colon')"
                :size="160"
                popover-class="mark-popover"
                :options="markList"
                @change="changeLogCategoryList"
            >
            </m-select>
            <m-tree-select
                :key="`logCategory_${logCategoryKey}` + selectedCategory"
                v-model="selectedCategory"
                searchable
                :prefix="i18n.global.t('meos_control_web.log_category_colon')"
                :placeholder="i18n.global.t('common.all')"
                :size="180"
                :menu-size="300"
                :data="logCategoryList"
                lazy
                :load="load"
                @change="handleCategoryChange"
            >
            </m-tree-select>
            <!--更多筛选-->
            <moreFilter
                v-model="isFilterMoreOpen"
                v-model:need-reset-filter="needResetFilter"
                :request-data="requestData"
                :system-class-code="firstLevelCategory"
                @handle-more-filter-change="handleMoreFilterChange"
            />
            <div class="operation-log__banner_line"></div>
            <div class="operation-log__banner_reset" @click="handleFilterReset">{{ i18n.global.t('meos_control_web.reset') }}</div>
            <div class="operation-log__banner_right">
                <m-input
                    v-model="searchValue"
                    :clearable="true"
                    :width="272"
                    :placeholder="i18n.global.t('meos_control_web.press_enter_search_operator_object_keyword')"
                    prefix-icon="IconMeriActionSearch"
                    @press-enter="handleSearchPressEnter"
                >
                </m-input>
                <div class="switch">
                    <div v-for="item in viewModeList" :key="item.id" :class="['switch__item', viewMode.id === item.id ? 'active' : '']" @click="handleViewModeChange(item)">
                        <svg class="icon svg-icon" aria-hidden="true">
                            <use :xlink:href="`#icon-${item.id}`"></use>
                        </svg>
                    </div>
                </div>
                <m-button id="export" type="primary" :loading="downloading" @click="handleLogExport">{{ i18n.global.t('meos_control_web.download') }}</m-button>
            </div>
        </div>
        <div class="operation-log__content">
            <component
                :is="viewMode.component"
                v-if="firstLevelCategory"
                :request-data="requestData"
                :init-time="initTime"
                :log-category-list-flat="logCategoryListFlat"
                :new-log-system="isNewLogSystem"
                @handle-filter-reset="handleFilterReset"
                @handle-more-filter-reset="handleMoreFilterReset"
                @handle-init-time-reset="handleInitTimeReset"
            ></component>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import cardList from './component/cardList.vue';
import tableList from './component/tableList.vue';
import moreFilter from './component/moreFilter.vue';
import { queryLogCategoryList, runningLogExport, queryRunningLogType, downloadLog, getSecondLevelRunningLogCategory } from '@/apis/operationLog';
import dayjs from 'dayjs';
import { downloadFileByBlob } from '@/utils';
import axios from 'axios';
import baseStore from '@/store/baseStore';
import { CATEGORYTOAUTH } from './constant';
import { getDayjsTz } from '@/utils/globalVariables';
// 走新日志逻辑的系统
// airConditioningColdSource： 冰蓄冷
const NEW_LOG_SYSTEM = [
    'airConditioningColdSource', // 空调冷源
    'StatusAndControl_SPEVCD', // 空调末端
    'StatusAndControl_AC', // 冷热源
    'lightxplantrunmonitor', // 室内照明
    'odlightxplantrunmonitor', // 室外照明
    'airConditioningHeatSource', // 空调热源
    'airConditioningHeatAndColdSource', // 空调冷热源
    'ventilatexplantrunmonitor', // 通风
    'StatusAndControl_KEF', // 油烟机
    'space_Security', // 安防
    'wsSewageTreatment', // 污水处理
    'StatusAndControl_WS' // 生活给水
];

let isFilterMoreOpen = ref(false),
    viewModeList = ref([
        {
            id: 'card',
            name: i18n.global.t('meos_control_web.card_view'),
            component: cardList
        },
        {
            id: 'table',
            name: i18n.global.t('meos_control_web.table_view'),
            component: tableList
        }
    ]),
    viewMode = ref(viewModeList.value[0]),
    // 记录日志分类组件change事件 的selectNode
    oldSelectNode = {};

// 日志标识
const markList = ref([]); // 日志标识
// eslint-disable-next-line one-var
let markValue = ref('all');
// 日志初始值
const logTimeStartTime = getDayjsTz().format('YYYY.MM.DD');
const logTimeEndTime = getDayjsTz().format('YYYY.MM.DD');

// 日志时间 - 默认选择30天
// eslint-disable-next-line one-var
let logTimeValue = ref(`${logTimeStartTime} 00:00-${logTimeEndTime} 23:59`),
    moreFilterData = ref({
        effectTime: '',
        objectIds: [],
        systemId: ''
    }),
    // 是否需要重置筛选条件
    needResetFilter = ref(false),
    // 日志分类列表
    logCategoryList = ref([]),
    // 日志分类选中项
    selectedCategory = ref([]),
    // 日志分类筛选 - key
    logCategoryKey = ref(0),
    // 所有日志的平铺结构
    logCategoryListFlat = ref({}),
    // 当前模糊搜索 - 关键字
    keyWord = ref(''),
    // 当前模糊搜索 - 双向绑定值
    searchValue = ref(''),
    // 当前页码
    pageNumber = ref(1),
    // 初始化进入页面的时间
    initTime = ref(getDayjsTz().format('YYYY-MM-DD HH:mm:ss')),
    downloading = ref(false); // 是否正在下载日志

// 当前选中的日志分类
const firstLevelCategory = ref('');
// 当前选中的二级日志分类
const secondLevelCategory = ref('');
//
const thirdLevelCategory = ref([]);
/*计算属性 - start*/
const logTime = computed(() => {
    let logTimeArr = logTimeValue.value ? logTimeValue.value.split('-') : [];
    // 开始时间
    const startTime = logTimeArr?.length ? dayjs(logTimeArr[0]).format('YYYY-MM-DD HH:mm:ss') : '';
    // 结束时间
    const endTime = logTimeArr?.length > 1 ? dayjs(logTimeArr[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    return {
        startTime,
        endTime
    };
});

const isNewLogSystem = computed(() => {
    return NEW_LOG_SYSTEM.includes(firstLevelCategory.value);
});

const requestData = computed(() => {
    const { effectTime, objectIds, systemId } = moreFilterData.value;
    let obj = {};
    if (isNewLogSystem.value) {
        obj.firstLevelCategory = firstLevelCategory.value;
        obj.secondLevelCategory = secondLevelCategory.value;
    } else {
        obj.firstLevelCategory = [firstLevelCategory.value];
        obj.thirdLevelCategory = thirdLevelCategory.value;
    }
    return {
        projectId: baseStore().projectId, // 项目ID
        startTime: logTime.value.startTime, // 开始时间
        endTime: logTime.value.endTime, // 结束时间
        type: markValue.value === 'all' ? null : markValue.value, // 日志标识，1：自动，2：人工
        keyWord: keyWord.value, // 模糊搜索
        effectTime: effectTime ? dayjs(effectTime).format('YYYY-MM-DD HH:mm:ss') : null, // 生效时间
        systemId, // 系统ID
        objectIds, // 操作对象ids
        pageNumber: pageNumber.value, // 页码
        pageSize: 15, //每页数量
        orderBy: '', // 排序：asc：升序，desc：降序
        ...obj
    };
});
/*计算属性 - end*/

// 监听模糊搜索清空 - 重新请求数据
watch(
    () => searchValue.value,
    val => {
        if (!val) {
            keyWord.value = '';
        }
    }
);

const helpGetLogCategoryList = sourceData => {
    if (!Array.isArray(sourceData)) return;
    sourceData.forEach(item => {
        let resultItem = {
            id: item.code,
            name: item.name,
            authKey: CATEGORYTOAUTH[item.code] || item.code,
            children: []
        };
        // 筛选权限
        if (baseStore().hasAuth(resultItem.authKey)) {
            logCategoryList.value.push(resultItem);
        }
        // 获取日志分类平铺结构
        logCategoryListFlat.value[item.code] = {
            id: item.code,
            name: item.name
        };
    });
};
const load = async (node, done) => {
    try {
        const res = await getSecondLevelRunningLogCategory({
            firstLevelCategory: node.id,
            dataStartTime: logTime.value.startTime, // 开始时间
            dataEndTime: logTime.value.endTime, // 结束时间
            type: markValue.value === 'all' ? null : markValue.value // 日志标识，1：自动，2：人工
        });
        const data = res.data.map(item => {
            const obj = { id: item.code, name: item.name, parentId: node.id };
            if (item.childCategoryList) {
                obj.children = item.childCategoryList.map(child => ({
                    id: child.code,
                    name: child.name,
                    parentId: item.code
                }));
            }
            return obj;
        });
        data.forEach(item => {
            logCategoryListFlat.value[item.id] = {
                id: item.id,
                name: item.name
            };
        });
        done(data);
    } catch (error) {
        console.log(error);
        done([]);
    }
}; // 帮助 - 获取下载需要的时间格式
const helpGetDownloadTime = time => {
    if (!(time && dayjs(time).isValid())) return '';
    const dayTime = dayjs(time);
    const month = dayTime.month() + 1 > 9 ? `${dayTime.month() + 1}` : `0${dayTime.month() + 1}`;
    const day = dayTime.date() > 9 ? `${dayTime.date()}` : `0${dayTime.date()}`;
    const hour = dayTime.hour() > 9 ? `${dayTime.hour()}` : `0${dayTime.hour()}`;
    const minute = dayTime.minute() > 9 ? `${dayTime.minute()}` : `0${dayTime.minute()}`;
    return i18n.global.t('meos_control_web.date_format6', {
        year: dayTime.year(),
        month: month,
        day: day,
        hour: hour,
        minute: minute
    });
};
const getLogCategoryList = id => {
    // 请求 - 日志分类
    queryLogCategoryList()
        .then(({ code, data }) => {
            logCategoryKey.value++;
            if (code === '00000' && Array.isArray(data)) {
                logCategoryList.value = [];
                helpGetLogCategoryList(data);
                resetCategoryLogType(id);
            }
        })
        .catch(() => {});
};
getLogCategoryList();
// 请求 - 日志标识
queryRunningLogType()
    .then(({ result, data }) => {
        markList.value = [];
        if (result === 'success') {
            const resData = Object.entries(data).map(entry => ({ id: entry[0], name: entry[1] }));
            markList.value = [
                {
                    id: 'all',
                    name: i18n.global.t('common.all')
                }
            ].concat(resData);
        }
    })
    .catch(() => {});

// 事件 - 模式切换
const handleViewModeChange = item => {
    viewMode.value = item;
};

// 事件、请求 - 日志下载
const handleLogExport = () => {
    if (downloading.value) {
        return;
    }
    downloading.value = true;
    let params = requestData.value,
        downloadPromise = runningLogExport;
    if (isNewLogSystem.value) {
        downloadPromise = downloadLog;
        params = {
            ...params,
            dataEndTime: params.endTime,
            dataStartTime: params.startTime,
            categoryList: params.thirdLevelCategory,
            effectStartTime: params.effectTime
        };
    }
    downloadPromise(params)
        .then(({ code, data }) => {
            if (code === '00000') {
                return axios(`/mid-frame-server/download/meos/${data}`, {
                    baseURL: undefined,
                    method: 'get',
                    responseType: 'blob'
                }).then(res => {
                    let { startTime, endTime } = logTime.value;
                    downloadFileByBlob(res.data, `${i18n.global.t('meos_control_web.operation_log')} ${helpGetDownloadTime(startTime)}-${helpGetDownloadTime(endTime)}.xls`);
                });
            }
            return Promise.resolve();
        })
        .finally(() => {
            downloading.value = false;
        });
};

// 事件 - 更多筛选
const handleMoreFilterChange = data => {
    moreFilterData.value = data;
};

const resetCategoryLogType = id => {
    let dataId = id || logCategoryList.value?.[0].id;
    if (dataId) {
        selectedCategory.value = [dataId];
        firstLevelCategory.value = dataId;
        secondLevelCategory.value = '';
        firstLevelCategory.value = dataId;
        oldSelectNode = id ? oldSelectNode : logCategoryList.value[0];
        logCategoryList.value.forEach(item => {
            item.children = [];
            item.open = false;
            delete item._tree_lazy_isLoaded;
            delete item._tree_lazy_loading;
        });
    }
};

// 事件 - 重置筛选条件
const handleFilterReset = () => {
    pageNumber.value = 1;
    logTimeValue.value = `${logTimeStartTime} 00:00-${logTimeEndTime} 23:59`;
    markValue.value = 'all';
    moreFilterData.value = {
        effectTime: '',
        objectIds: [],
        systemId: ''
    };
    needResetFilter.value = true;
    logCategoryKey.value += 1;

    resetCategoryLogType();
};

const handleMoreFilterReset = () => {
    moreFilterData.value = {
        effectTime: '',
        objectIds: [],
        systemId: ''
    };
};

const handleInitTimeReset = () => {
    initTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
};

// 事件 - 搜索回车
const handleSearchPressEnter = () => {
    keyWord.value = searchValue.value;
};
const changeLogCategoryList = () => {
    secondLevelCategory.value = '';
    getLogCategoryList(firstLevelCategory.value);
};

const getCategoryListRootId = data => {
    if (data?.parent) {
        return getCategoryListRootId(data.parent);
    }
    return data.id;
};

const getCategoryListLeafId = data => {
    const result = [];
    if (!data) {
        return result;
    }
    if (!data?.children?.length) {
        result.push(data.id);
    } else {
        for (let i = 0; i < data.children.length; i++) {
            result.push(...getCategoryListLeafId(data.children[i]));
        }
    }
    return result;
};

// 事件 - 日志分类变更
const handleCategoryChange = (data, selectNode) => {
    if (data[0] === selectedCategory.value[0]) {
        return;
    }
    if (!selectNode) {
        return;
    }
    thirdLevelCategory.value = [];
    // TreeSelect组件有个Bug,获取焦点展开下拉列表的时候也会触发change事件,所以这里需要判断一下
    // 如果两次点击的节点相同，则不触发change事件
    if (oldSelectNode?.id === selectNode?.id) {
        return;
    }
    oldSelectNode = selectNode;
    // firstLevelCategory.value = selectNode
    if (selectNode.parentId) {
        firstLevelCategory.value = selectNode.parentId;
        secondLevelCategory.value = selectNode.id;
        if (selectNode.children?.length) {
            thirdLevelCategory.value = selectNode.children.map(child => child.id);
        }
    } else {
        firstLevelCategory.value = selectNode.id;
        secondLevelCategory.value = '';
    }
    console.log('=============+++++++++++', selectNode, firstLevelCategory.value);
};

// 点击空白处关闭更多筛选框
document.getElementById('app')?.addEventListener('click', e => {
    if (!document.getElementById('logFilterMore')?.contains(e.target)) {
        isFilterMoreOpen.value = false;
    }
});
</script>
<style lang="less" scoped>
.operation-log__banner_right {
    :deep(.m-input) {
        width: fit-content !important;
        flex: 1;
        max-width: 272px;
    }
}
.operation-log {
    background: #f7f9fa;
    height: 100%;
    :deep(.m-date-picker__result) {
        box-sizing: content-box;
    }

    &__banner {
        height: 64px;
        display: flex;
        align-items: center;
        padding: 0 16px;

        > div {
            margin-right: 12px;

            &:last-child {
                margin-right: 0;
            }
        }

        &_mark {
            margin-left: 12px;

            /deep/ .m-select-inner {
                width: 140px !important;
            }

            /deep/ .m-select-inner-value {
                width: auto;
            }
        }

        &_title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2429;

            line-height: 24px;
            min-width: 64px;
        }

        &_line {
            width: 1px;
            height: 12px;
            background: #e1e5eb;
            margin-right: 12px;
        }

        &_reset {
            color: #246fe5;
            cursor: pointer;
            font-size: 14px;
            min-width: 28px;
        }

        &_right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: right;

            .switch {
                margin: 0 12px;
                background: #e8ecf0;
                border-radius: 6px;
                display: flex;
                align-items: center;
                font-size: 22px;
                height: 32px;
                padding: 0 2px;

                &__item {
                    height: 28px;
                    width: 54px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.active {
                        background: #fff;
                    }
                }
            }
        }
    }

    &__content {
        height: calc(100% - 70px);
        overflow-y: auto;
        position: relative;
    }
}
</style>
<style lang="less">
.mark-popover {
    width: 140px !important;
}
</style>
