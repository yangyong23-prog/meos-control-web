<!--运行日志卡片视图-->
<template>
    <div class="card-list-box">
        <div v-show="items && items.length" class="card-list-box-content">
            <!--新日志条数-->
            <div v-if="newLogCount > 0" class="new-log-count" @click="handleNewLogCount">
                <IconMeriActionRefresh color="#246FE5" />
                <span class="new-log-count__count">{{ newLogCount }}</span> {{ i18n.global.t('meos_control_web.num_new_log', { num: '' }) }}
            </div>
            <!--向上加载、无更多-->
            <div v-if="showTopLoader && items.length" class="loading-more">
                <IconMeriComponentButtonGrey color="#626C78" class="loading-more__icon" />
                <span>{{ i18n.global.t('meos_control_web.loading_dots') }}</span>
            </div>
            <div id="scrollContainer" :class="['card-list', showBottomNoData ? 'to-limit' : '', showBottomLoader || showTopLoader ? 'loading' : '']">
                <ul>
                    <li v-for="item in items" :key="item.id" :class="['card-list__item-box', item.detail && item.detail.length ? '' : 'no-detail']" @click="handleDetailShow(item)">
                        <div :class="['card-list__timeline', item.isNewLog ? 'active' : '']">
                            <span class="card-list__timeline_dot"></span>
                            <span class="card-list__timeline_line"></span>
                        </div>
                        <div class="card-list__item" :style="{ borderColor: item.borderColor, paddingBottom: item.open ? '12px' : '0' }">
                            <div class="card-list__item_title">
                                <span class="time">{{ item.createTime }}</span>
                                <span class="mode" :style="{ color: item.typeColor, background: item.typeBgColor }">{{ item.typeName }}</span>
                                <span class="line"></span>
                                <span class="person" v-html="item.createUser"></span>
                                <span class="desc" v-html="item.contentDesc"></span>
                                <span v-if="item.secondLevelCategoryName" class="tag">{{ item.secondLevelCategoryName }}</span>
                                <div style="position: absolute; top: 16px; right: 12px; display: flex; gap: 10px; font-size: 14px">
                                    <span
                                        v-if="props.newLogSystem"
                                        :style="`display: flex; justify-content: center; align-items: center; gap: 5px; color:${(LogState[item.state] || LogState[0])[1]}`"
                                    >
                                        <img :src="(LogState[item.state] || LogState[0])[2]" style="height: 16px; width: 16px" />
                                        {{ (LogState[item.state] || LogState[0])[0] }}
                                    </span>
                                    <span v-if="shpwDetailButton(item)" :class="['operator', item.open ? 'active' : '']"
                                        >{{ i18n.global.t('meos_control_web.operation_detail') }}<IconMeriComponentChevronDown color="#246FE5" />
                                    </span>
                                </div>
                            </div>
                            <ul v-show="item.open" class="card-list__item_detail">
                                <li v-for="(detail, index) in item.detail" :key="index">
                                    <span class="line"></span>
                                    <span class="name" v-html="detail.contentDescDetail"></span>
                                </li>
                                <li v-if="item.effectTime || item.reason" :class="['operate-time-reason', props.newLogSystem ? 'withoutTopBorder' : '']">
                                    <div v-if="item.effectTime" class="time">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-time" />
                                        </svg>
                                        <span>{{ i18n.global.t('meos_control_web.effective_time_colon') }}</span>
                                        <span>{{ item.effectTime }}</span>
                                    </div>
                                    <div v-if="item.reason" class="reason">
                                        <svg class="icon" aria-hidden="true">
                                            <use xlink:href="#icon-reason" />
                                        </svg>
                                        <span>{{ i18n.global.t('meos_control_web.operation_reason_colon') }}</span>
                                        <span>{{ item.reason }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <!--向下加载、无更多-->
            <div v-if="showBottomLoader" class="loading-more">
                <IconMeriComponentButtonGrey color="#626C78" class="loading-more__icon" />
                <span>{{ i18n.global.t('meos_control_web.loading_dots') }}</span>
            </div>
            <div v-show="showBottomNoData && items.length" class="loading-no-data">{{ i18n.global.t('meos_control_web.no_more_data') }}</div>
        </div>
        <!--无数据-->
        <mIllustration v-if="!items.length" :title="i18n.global.t('common.no_data')" type="noContent" class="no-data" />
        <!--回到顶部-->
        <div v-if="containerScrollTop > 10 && items && items.length" class="back-top" @click="handleBackTop">
            <IconMeriComponentChevronDown color="#626C78" hover-color="#246FE5" class="back-top__arrow" />
        </div>
    </div>
</template>
<script setup>
import { IconMeriComponentChevronDown, IconMeriComponentButtonGrey, IconMeriActionRefresh } from 'meri-icon';
import { ref, nextTick, onUnmounted } from 'vue';
import { queryLogListByPage, queryRunningLogListByPage } from '@/apis/operationLog';
import dayjs from 'dayjs';
import _ from 'lodash';
import baseStore from '@/store/baseStore';
import { MLoading } from 'meri-plus';
import success from '@/assets/images/log/success.png';
import failed from '@/assets/images/log/failed.png';
import overtime from '@/assets/images/log/overtime.png';
import stop from '@/assets/images/log/stop.png';
import error from '@/assets/images/log/error.png';
import unkonw from '@/assets/images/log/unknow.png';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';

const props = defineProps(['requestData', 'initTime', 'newLogSystem']);
const emits = defineEmits(['handleMoreFilterReset', 'handleInitTimeReset']);

const createTime = ref('');
createTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');

let items = ref([]), // 存储加载的数据
    topPage = ref(0), // 顶部加载页数
    bottomPage = ref(1), // 底部加载页数
    showTopLoader = ref(false), // 是否显示顶部加载提示
    showTopNoData = ref(false), // 是否显示顶部无数据提示
    showBottomLoader = ref(false), // 是否显示底部加载提示
    showBottomNoData = ref(false), // 是否显示底部无数据提示
    containerScrollTop = ref(0), // 容器滚动高度
    // 新日志数量
    newLogCount = ref(0),
    // 循环请求接口的开始时间 - 每次点击新日志按钮，需要重置为当前时间
    loopStartTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss'),
    // 滚动容器
    scrollContainer = document.getElementById('scrollContainer') || {},
    // 是否显示初始化loading
    isInitLoading = ref(''),
    abortController = null;

// 监听筛选条件变更
watch(
    () => props.requestData,
    (newVal, oldVal) => {
        items.value = [];
        topPage.value = 1;
        bottomPage.value = 1;
        showTopLoader.value = false;
        showBottomLoader.value = false;
        loadData('bottom', true);
    },
    { deep: true }
);

const shpwDetailButton = data => {
    if (props.newLogSystem) {
        return data.effectTime || data.reason;
    }
    return data.detail && data.detail.length;
};

// 帮助方法 - 处理列表数据
const helpHandleListData = data => {
    return data.map(item => {
        let { vars = [], template } = item.content;

        // 使用循环逐个替换变量
        for (let i = 0; i < vars.length; i++) {
            let regex = new RegExp('\\{' + i + '\\}', 'g');
            template = template.replace(regex, ` <span style="color:#1B2129;font-weight: bold;">${vars[i]}</span> `);
        }

        item?.detail?.forEach(detail => {
            let { vars, template } = detail;
            for (let i = 0; i < vars.length; i++) {
                let regex = new RegExp('\\{' + i + '\\}', 'g');
                template = template.replace(regex, ` <span style="color:#1B2129;">${vars[i]}</span> `);
            }

            detail.contentDescDetail = template;
        });
        const { keyWord } = props.requestData;
        // eslint-disable-next-line one-var
        let regexKeyWord = new RegExp(`${keyWord}`, 'g');

        return Object.assign(item, {
            open: false,
            typeName: styleObj[item.type][0] || '--',
            typeColor: styleObj[item.type][1] || '',
            typeBgColor: styleObj[item.type][2] || '',
            borderColor: styleObj[item.type][3] || '',
            contentDesc: props.newLogSystem ? item.contentDesc : keyWord.length ? template.replace(regexKeyWord, `<span style="color:#246FE5;">${keyWord}</span>`) : template,
            isNewLog: dayjsIsAfter(dayjs(item.createTime), dayjs(props.initTime)),
            effectTime:
                item.effectStartTime && item.effectEndTime
                    ? `${dayjs(item.effectStartTime).format('YYYY.MM.DD HH:mm:ss')}-${dayjs(item.effectEndTime).format('YYYY.MM.DD HH:mm:ss')}`
                    : '',
            createUser: keyWord.length ? item.createUser.replace(regexKeyWord, `<span style="color:#246FE5;">${keyWord}</span>`) : item.createUser,
            reason: (props.newLogSystem ? item.content?.reasonSource : item.reason) || ''
        });
    });
};

const styleObj = {
    1: [i18n.global.t('meos_control_web.auto'), '#683BD6', '#F1E5FE', '#9B6CED'],
    2: [i18n.global.t('meos_control_web.manual1'), '#E68600', '#FFF0CC', '#FFB800'],
    3: [i18n.global.t('meos_control_web.alarm'), '#D72824', '#FFE6E5', '#F55047']
};

const LogState = {
    '-1': [i18n.global.t('meos_control_web.status_undetected'), '#8B949E', unkonw],
    0: [i18n.global.t('meos_control_web.status_undetected'), '#8B949E', unkonw],
    1: [i18n.global.t('meos_control_web.execution_success'), '#3FBE72', success],
    2: [i18n.global.t('meos_control_web.execution_failed'), '#F55047', failed],
    3: [i18n.global.t('meos_control_web.execution_timeout'), '#F29F00', overtime],
    4: [i18n.global.t('meos_control_web.execution_terminated'), '#F29F00', stop],
    5: [i18n.global.t('meos_control_web.execution_exception'), '#F55047', error]
};

// 模拟从API获取数据的方法
const fetchData = page => {
    if (page < 1) return;
    abortController?.abort();
    abortController = null;
    abortController = new AbortController();

    let apiPromise = queryLogListByPage,
        params = Object.assign(props.requestData, {
            pageNumber: page
        });

    if (page === 1) {
        params.createTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
    }
    if (props.newLogSystem) {
        apiPromise = queryRunningLogListByPage;
        params = {
            ...params,
            dataEndTime: params.endTime,
            dataStartTime: params.startTime,
            effectStartTime: params.effectTime,
            workDate: params.createTime
        };
    }

    // 在此处实际调用API获取数据，示例中使用setTimeout模拟异步加载
    return new Promise(resolve => {
        apiPromise(params, abortController.signal)
            .then(({ code, data }) => {
                if (code === '00000') {
                    resolve(helpHandleListData(data));
                } else {
                    resolve([]);
                }
            })
            .catch(err => {
                resolve([]);
            });
    });
};

// 加载数据方法
const loadData = async (position, isLoadingShow = false) => {
    if (position === 'top' && showTopLoader.value) return; // 如果顶部正在加载，则不执行重复加载
    if (position === 'bottom' && showBottomLoader.value) return; // 如果底部正在加载，则不执行重复加载

    if (position === 'top') showTopLoader.value = true;
    if (position === 'bottom') showBottomLoader.value = true;

    try {
        if (position === 'top' && topPage.value === 0) {
            showTopNoData.value = true;
            return;
        }
        // 筛选条件变更时，开启loading
        if (isLoadingShow) {
            if (isInitLoading.value) {
                isInitLoading.value.destroy();
            }
            isInitLoading.value = MLoading.service({
                target: '.card-list-box',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: { width: '100px', height: '100px' }
            });
        }
        const newData = await fetchData(position === 'top' ? topPage.value : bottomPage.value);
        // 关闭loading
        isInitLoading?.value?.destroy();
        if (position === 'top') {
            items.value = newData.concat(items.value); // 将新数据添加到顶部
            topPage.value--; // 更新顶部页数

            // 页面最多显示60条数据，超出截取数组尾部数据
            nextTick(() => {
                if (items.value.length > 60) {
                    bottomPage.value--;
                    items.value.splice(items.value.length - 15, 15);
                }
                scrollContainer.scrollTop = scrollContainer.scrollTop + 80;
            });
        } else {
            // 底部加载到数据为空时，显示暂无数据
            if (!newData.length) {
                showBottomNoData.value = true;
                showBottomLoader.value = false;
                nextTick(() => {
                    scrollContainer.style.paddingBottom = '10px';
                });
                return;
            }

            items.value = items.value.concat(newData); // 将新数据添加到底部
            // 页面最多显示60条数据，超出截取数据头部
            nextTick(() => {
                if (items.value.length > 60) {
                    topPage.value++;
                    items.value.splice(0, 15);
                    // 截取数组头部数据，会影响滚动条位置，导致滚动加载多次执行，所以手动更新滚动位置
                    scrollContainer.scrollTop = scrollContainer.scrollTop - 880;
                }
            });

            bottomPage.value++; // 更新底部页数
        }
    } catch (error) {
        console.error('Error loading data: ', error);
    } finally {
        if (position === 'top') showTopLoader.value = false;
        if (position === 'bottom') showBottomLoader.value = false;
    }
};

// 处理滚动事件
const handleScroll = () => {
    showTopNoData.value = false;
    showBottomNoData.value = false;

    if (scrollContainer) {
        containerScrollTop.value = scrollContainer.scrollTop;
        if (scrollContainer.scrollTop === 0) {
            loadData('top'); // 当滚动到顶部时加载顶部数据
        } else if (scrollContainer.scrollTop + scrollContainer.clientHeight === scrollContainer.scrollHeight) {
            loadData('bottom'); // 当滚动到底部时加载底部数据
        }
    }
};

// 事件 - 回到顶部
const handleBackTop = async () => {
    scrollContainer && (scrollContainer.scrollTop = 0);
    // 重置数据
    items.value = [];
    items.value = await fetchData(1);
    // 重置页码
    topPage.value = 0;
    bottomPage.value = 2;
};

// 事件 - 点击新日志数量
const handleNewLogCount = async () => {
    // emits('handleFilterReset');
    emits('handleMoreFilterReset');
    emits('handleInitTimeReset');
    // await handleBackTop();
    newLogCount.value = 0;
    loopStartTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
};

// 事件 - 行点击
const handleDetailShow = item => {
    if (shpwDetailButton(item)) {
        item.open = !item.open;
    }
};

// 请求 - 获取新日志数量
const queryNewLogCount = () => {
    // 新日志定义：从初始化进入页面的时间到当前时间，其它筛选条件都置空
    let params = {
            projectId: baseStore().projectId, // 项目ID
            startTime: loopStartTime, // 开始时间
            endTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
            type: props.requestData.type, // 日志标识，1：自动，2：人工
            keyWord: null, // 模糊搜索
            effectTime: props.requestData.effectTime, // 生效时间
            systemId: props.requestData.systemId, // 系统ID
            objectIds: null, // 操作对象ids
            pageNumber: 1, // 页码
            pageSize: 1, //每页数量
            orderBy: '' // 排序：asc：升序，desc：降序
        },
        apiPromise = queryLogListByPage;
    params.firstLevelCategory = props.requestData.firstLevelCategory;
    params.secondLevelCategory = props.requestData.secondLevelCategory;
    if (props.newLogSystem) {
        apiPromise = queryRunningLogListByPage;
        params = {
            ...params,
            dataEndTime: params.endTime,
            dataStartTime: params.startTime,
            effectStartTime: params.effectTime
        };
    }

    apiPromise(params).then(({ code, total, data }) => {
        if (code === '00000') {
            newLogCount.value = total || 0;
            // 页面无滚动时，直接加载新日志
            if (containerScrollTop.value < 10 && newLogCount.value > 0) {
                handleBackTop();
            }
        } else {
            newLogCount.value = 0;
        }
    });
};

// 30s请求一次接口，获取新日志数量
// eslint-disable-next-line one-var
let querySetInterval = setInterval(() => {
    queryNewLogCount();
}, 1000 * 30);

onUnmounted(() => {
    querySetInterval && clearInterval(querySetInterval);
});

nextTick(() => {
    scrollContainer = document.getElementById('scrollContainer');
    scrollContainer?.addEventListener(
        'scroll',
        _.throttle(handleScroll, 300, {
            leading: true
        })
    );
});

// 初始化加载底部数据
loadData('bottom', true);
</script>
<style lang="less" scoped>
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(90deg);
    }
    50% {
        transform: rotate(180deg);
    }
    75% {
        transform: rotate(270deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.card-list-box {
    height: 100%;
    position: relative;

    &-content {
        height: 100%;
        position: relative;
    }

    .new-log-count {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 1;
        border: 1px solid #246fe5;
        border-radius: 8px;
        background: #ebf6ff;
        color: #246fe5;
        cursor: pointer;
        height: 38px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        box-shadow: 0 0.5px 3px 0 rgba(27, 33, 41, 0.08), 0 3px 12px 0 rgba(27, 33, 41, 0.12);

        &__arrow {
            transform: rotate(180deg);
        }

        &__count {
            padding: 0 4px;
        }

        &:hover {
            background: #d9ebff;
        }

        &:active {
            box-shadow: none;
        }
    }

    .loading-more {
        color: #626c78;
        display: flex;
        align-items: center;
        justify-content: center;

        // 加载中
        &__icon {
            animation: rotate 0.7s linear infinite;
            margin-right: 4px;
        }
    }

    .loading-no-data {
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        color: #626c78;
        height: 30px;
    }

    .no-data {
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .back-top {
        position: absolute;
        bottom: 16px;
        right: 16px;
        display: flex;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid #c4c9cf;
        box-shadow: 0 0.5px 3px 0 rgba(27, 33, 41, 0.08), 0 3px 12px 0 rgba(27, 33, 41, 0.12);
        align-items: center;
        background: #fff;
        z-index: 1;
        justify-content: center;
        cursor: pointer;

        &__arrow {
            transform: rotate(180deg);
        }

        &:hover {
            border: 1px solid #246fe5;
        }

        &:active {
            box-shadow: none;
        }
    }

    .card-list {
        padding: 0 20px 20px;
        height: 100%;
        overflow-y: scroll;

        &__timeline {
            margin-right: 30px;
            position: relative;
            top: 20px;

            &_dot {
                width: 12px;
                height: 12px;
                border-radius: 100%;
                background: #c4c9cf;
                display: inline-block;
                box-sizing: content-box;
            }

            &_line {
                width: 1px;
                background: #e1e5eb;
                position: absolute;
                top: 16px;
                left: 6px;
                height: 100%;
            }

            &.active {
                margin-right: 14px;

                .card-list__timeline_dot {
                    background: #246fe5;
                    border: 8px solid #d9ebff;
                    position: relative;
                    right: 7px;
                }

                .card-list__timeline_line {
                    top: 20px;
                }
            }
        }

        &__item {
            background: #fff;
            padding: 16px 12px;
            border-radius: 8px;
            border-left-width: 3px;
            border-style: solid;
            position: relative;
            flex: 1;

            &_title {
                font-size: 16px;
                padding-bottom: 16px;
                display: flex;
                align-items: center;

                > span {
                    display: inline-block;
                    margin-right: 8px;
                }

                .time {
                    color: #626c78;
                    font-weight: bold;
                }

                .mode {
                    padding: 0 6px;
                    align-items: center;
                    border-radius: 4px;
                    background: #fff0cc;
                    color: #e68600;
                    margin: 0 8px;
                    height: 24px;
                    font-size: 14px;
                    line-height: 24px;
                }

                .line {
                    width: 1px;
                    height: 14px;
                    background: #c4c9cf;
                    margin-right: 8px;
                }

                .person,
                .address,
                .content {
                    font-weight: bold;
                    color: #2e3742;
                }

                .desc {
                    color: #424c59;
                }

                .tag {
                    padding: 1px 8px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    line-height: 24px;
                    color: #1b4acc;
                    background: #d9ebff;
                }

                .label {
                    height: 22px;
                    border-radius: 4px;
                    line-height: 22px;
                    padding: 0 8px;
                    background: #d9ebff;
                    color: #1b4acc;
                }

                .operator {
                    color: #246fe5;
                    cursor: pointer;
                    // position: absolute;
                    // right: 12px;
                    // top: 16px;
                    display: flex;
                    align-items: center;

                    svg {
                        transition: transform 0.3s;
                        margin-left: 4px;
                    }

                    &.active {
                        svg {
                            transform: rotate(180deg);
                        }
                    }
                }
            }

            &_detail {
                border-radius: 4px;
                background: linear-gradient(90deg, rgba(232, 236, 240, 0.6) 0%, rgba(232, 236, 240, 0) 100%);
                padding: 8px 12px;

                li {
                    margin-bottom: 8px;
                    line-height: 22px;
                    display: flex;
                    align-items: center;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    &.operate-time-reason {
                        color: #626c78;
                        flex-direction: column;
                        align-items: start;

                        &:not(.withoutTopBorder) {
                            border-top: 1px solid #e1e5eb;
                            padding-top: 8px;
                        }

                        .time,
                        .reason {
                            display: flex;
                            align-items: center;
                            line-height: 20px;

                            .icon {
                                margin-right: 4px;
                            }

                            &.time:not(:last-of-type) {
                                margin-bottom: 8px;
                            }
                        }
                    }
                }

                .line {
                    width: 3px;
                    height: 12px;
                    background: #246fe5;
                    display: inline-block;
                    margin-right: 8px;
                }

                .name,
                .content {
                    color: #626c78;
                }
            }
        }

        &__item-box {
            display: flex;
            align-items: stretch;
            margin-bottom: 12px;
            cursor: pointer;

            &:last-child .card-list__timeline .card-list__timeline_line {
                display: none;
            }

            &.no-detail {
                cursor: auto;
            }

            &:hover {
                .card-list__item {
                    box-shadow: 0 2px 10px 0 #1b21291a;
                    top: -2px;
                    transition: all 0.2s;
                }
            }
        }

        &.to-limit {
            height: calc(100% - 30px);
            padding-bottom: 70px;
        }

        &.loading {
            height: calc(100% - 50px);
        }
    }
}
</style>
