<!--
 * @Author: guoxiaohuan
 * @Date: 2023-09-18 19:52:08
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2023-12-25 14:52:51
 * @Description: 
-->
<template>
    <div class="header-filter fcb">
        <div class="header-filter-left fc">
            <img class="back" :class="{ 'back-1920': screenWidth >= 1920, 'back-1366': screenWidth < 1920 }" src="@/assets/imgs/up.png" @click.stop="goBack" />
            <span class="back-text" :class="{ 'back-text-1920': screenWidth >= 1920, 'back-text-1366': screenWidth < 1920 }" @click.stop="goBack">{{
                i18n.global.t('meos_control_web.back')
            }}</span>
            <Up />
            <span class="line" :class="{ 'line-1920': screenWidth >= 1920, 'line-1366': screenWidth < 1920 }"></span>
            <div class="schedule" :class="{ 'schedule-1920': screenWidth >= 1920, 'schedule-1366': screenWidth < 1920 }">
                {{ route.query.type == '1' ? i18n.global.t('meos_control_web.end_stage_pump_schedule') : i18n.global.t('meos_control_web.cooling_station_schedule') }}
            </div>
            <span class="system">{{ route.query.systemName }}</span>
            <div v-for="item in list" :key="item.key" class="header-filter-left-item fc">
                <template v-if="item.type === 'daterange' && route.query.type == '1'">
                    <div class="daterange-box">
                        <svg class="svg-left" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="changeBtn('leftD')">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.80662 9.53821C6.51741 9.77814 6.51741 10.2218 6.80662 10.4618L12.7669 15.4065C13.1579 15.7309 13.75 15.4528 13.75 14.9447L13.75 5.05526C13.75 4.54718 13.1579 4.26907 12.7669 4.59348L6.80662 9.53821Z"
                                fill="#8D9399"
                            />
                        </svg>
                        <!-- <img src="@/assets/imgs/left.png" class="svg-left" @click="changeBtn('leftD')" /> -->
                        <m-date-picker v-model="params.daterange" class="picker" :clearable="false" type="daterange" v-bind="item.attrs" @change="changeParams('daterange')" />

                        <svg class="svg-right" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="changeBtn('rightD')">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M13.1934 10.4618C13.4826 10.2219 13.4826 9.77816 13.1934 9.53823L7.2331 4.5935C6.84206 4.26909 6.25 4.54719 6.25 5.05528L6.25 14.9447C6.25 15.4528 6.84206 15.7309 7.2331 15.4065L13.1934 10.4618Z"
                                fill="#8D9399"
                            />
                        </svg>
                        <!-- <img src="@/assets/imgs/right.png"/> -->
                    </div>
                </template>
                <template v-if="item.type === 'month' && route.query.type == '0'">
                    <div class="daterange-box month">
                        <svg class="svg-left" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="changeBtn('leftM')">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.80662 9.53821C6.51741 9.77814 6.51741 10.2218 6.80662 10.4618L12.7669 15.4065C13.1579 15.7309 13.75 15.4528 13.75 14.9447L13.75 5.05526C13.75 4.54718 13.1579 4.26907 12.7669 4.59348L6.80662 9.53821Z"
                                fill="#8D9399"
                            />
                        </svg>
                        <!-- <img src="@/assets/imgs/left.png" class="svg-left" @click="changeBtn('leftM')" /> -->
                        <m-date-picker v-model="params.month" class="picker" :clearable="false" type="month" v-bind="item.attrs" @change="changeParams('month')" />
                        <svg class="svg-right" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" @click="changeBtn('rightM')">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M13.1934 10.4618C13.4826 10.2219 13.4826 9.77816 13.1934 9.53823L7.2331 4.5935C6.84206 4.26909 6.25 4.54719 6.25 5.05528L6.25 14.9447C6.25 15.4528 6.84206 15.7309 7.2331 15.4065L13.1934 10.4618Z"
                                fill="#8D9399"
                            />
                        </svg>
                        <!-- <img src="@/assets/imgs/right.png" class="svg-right" @click="changeBtn('rightM')" /> -->
                    </div>
                </template>
            </div>
            <svg v-if="monthData.length" class="linear-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.85348 13C7.82958 13 8.40994 12.3755 8.97979 11.5658C8.97979 11.4693 9.01448 11.2145 8.99296 11.0701L8.23496 11.9336C8.07737 12.0965 7.88225 12.2107 7.78921 12.1798C7.70392 12.151 7.65322 12.0603 7.67052 11.971L8.9353 8.01711C9.04021 7.51474 8.75421 7.05838 8.15018 7C7.51439 7 6.57789 7.63891 6.00725 8.44856C6.00725 8.54578 5.98918 8.78613 6.01009 8.93057L6.76887 8.06637C6.92569 7.90353 7.10764 7.78995 7.1999 7.82081C7.29294 7.85166 7.34432 7.95474 7.31377 8.05131L6.05795 11.9861C5.91292 12.4458 6.18705 12.8976 6.85348 13Z"
                    fill="#8D9399"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99589 4C7.83038 4.00369 7.66854 4.04709 7.51039 4.13018C7.35223 4.21327 7.22717 4.33422 7.13522 4.49302C7.04327 4.65182 6.99822 4.82078 7.00005 4.99989C7.00189 5.179 7.04695 5.34611 7.13522 5.50122C7.2235 5.65633 7.34395 5.7782 7.49659 5.86683C7.64923 5.95547 7.81566 5.99978 7.99589 5.99978C8.17244 6.00348 8.33887 5.96008 8.49519 5.8696C8.6515 5.77912 8.7738 5.65633 8.86207 5.50122C8.95035 5.34611 8.99632 5.17808 9 4.99712C9 4.81985 8.95402 4.65182 8.86207 4.49302C8.77012 4.33422 8.64323 4.21235 8.48139 4.12741C8.31956 4.04247 8.15772 4 7.99589 4Z"
                    fill="#8D9399"
                />
                <circle cx="8" cy="8" r="7.5" stroke="#1B2129" />
            </svg>
            <span v-if="monthData.length" class="linear">
                {{ i18n.global.t('meos_control_web.configured_schedule_months') }}
                {{
                    monthData
                        .split('、')
                        .filter((item: any) => item)
                        .join('、')
                }}
            </span>
        </div>
        <div class="header-filter-right">
            <m-input
                v-if="showSearch"
                v-model="params.search"
                prefix-icon="IconMeriActionSearch"
                :width="200"
                :placeholder="placeholder"
                @press-enter="
                    () => {
                        hasSearch = true;
                        changeParams();
                    }
                "
                @input="handleInput"
                @clear="
                    () => {
                        hasSearch = true;
                        changeParams();
                    }
                "
            />
            <m-button v-if="isDownLoad" :id="urlComputed" class="downLoad" type="default" size="medium" @click="downLoad">{{
                i18n.global.t('meos_control_web.download')
            }}</m-button>
            <slot name="append" :params="params" :list="list"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import i18n from '@/localization';
import { defineComponent, PropType, Ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { useRouter } from 'vue-router';
import { $Message } from 'meri-plus';
import { getDownLoad } from '@/apis/public';
import emitter from '@/utils/bus';
import { useRoute } from '@/hooks/setupHelper';

export default defineComponent({
    components: {},
    props: {
        list: {
            type: Array as PropType<any>,
            required: true
        },
        placeholder: {
            type: String as PropType<string>,
            required: false,
            default: ''
        },
        searchValue: {
            type: String as PropType<string>,
            required: false,
            default: ''
        },
        downLoadUrl: {
            type: String as PropType<string>,
            required: false,
            default: ''
        },
        isDownLoad: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: false
        },
        // eslint-disable-next-line vue/require-default-prop
        downLoadParams: {
            type: Object as PropType<any>,
            required: false
        },
        // eslint-disable-next-line vue/prop-name-casing
        leftOptionName: {
            type: String as PropType<string>,
            required: false,
            default: ''
        },
        // eslint-disable-next-line vue/prop-name-casing
        rightOptionName: {
            type: String as PropType<string>,
            required: false,
            default: ''
        },
        showSearch: {
            type: Boolean as PropType<boolean>,
            required: false,
            default: true
        },
        monthData: {
            type: String as PropType<string>,
            required: true,
            default: ''
        }
    },
    emits: ['changeParams', 'defaultParams'],
    setup(props, { emit, expose }) {
        const router = useRouter();
        const route = useRoute();

        // 返回
        const goBack = () => {
            // router.push({
            //     path: '/system-status-home/:classCode/graph',
            //     query: router.currentRoute.value.query
            // });
            router.go(-1);
        };
        const urlComputed = computed(() => props.downLoadUrl.split('/').slice(-1).join());
        const params: Ref<Record<string, any>> = ref({
            search: '',
            daterange: '',
            month: ''
        });
        const showDate = ref(true);
        const hasSearch: Ref<boolean> = ref(false);

        function refreshParams() {
            const { list } = props;
            list.forEach((item: any) => {
                if (item.type === 'daterange') {
                    const start = getDayjsTz()
                        .subtract(item.subtract - 1, 'day')
                        .startOf('day')
                        .format('YYYY.MM.DD');
                    const end = getDayjsTz().endOf('day').format('YYYY.MM.DD');
                    params.value.daterange = item.dayHandler() || `${start}-${end}`;
                } else if (item.type === 'month') {
                    params.value.month = item.dayHandler() || `${getDayjsTz().format('YYYY.MM')}`;
                } else {
                    params.value[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
                }
            });
            params.value.search = props.searchValue;
            emit('defaultParams', params.value);
        }
        refreshParams();
        const handleInput = (value: string) => {
            if (!value) {
                if (hasSearch.value) {
                    hasSearch.value = false;
                    changeParams();
                }
            }
        };

        // 单独写的日期组件左右的按钮 月日
        const changeBtn = (type: string) => {
            switch (type) {
                case 'leftM':
                    params.value.month = dayjs(params.value.month.replace('.', '-')).add(-1, 'month').format('YYYY.MM');
                    emitter.emit('changeMonth', 'left');
                    break;
                case 'rightM':
                    params.value.month = dayjs(params.value.month.replace('.', '-')).add(1, 'month').format('YYYY.MM');
                    emitter.emit('changeMonth', 'right');
                    break;
                case 'leftD':
                    params.value.daterange = `${dayjs(unref(params).daterange.split('-')[0]).subtract(7, 'day').format('YYYY.MM.DD')}-${dayjs(unref(params).daterange.split('-')[1])
                        .subtract(7, 'day')
                        .format('YYYY.MM.DD')}`;
                    break;
                case 'rightD':
                    params.value.daterange = `${dayjs(unref(params).daterange.split('-')[0]).subtract(-7, 'day').format('YYYY.MM.DD')}-${dayjs(
                        unref(params).daterange.split('-')[1]
                    )
                        .subtract(-7, 'day')
                        .format('YYYY.MM.DD')}`;
                    break;
                default:
                    break;
            }
            changeParams();
        };
        const changeParams = (key?: string) => {
            if (key === 'daterange') {
                const date = params.value.daterange.split('-');
                const diffDays = dayjs(date[1]).diff(date[0], 'day');
                const daterangeObj = props.list.find((item: { type: string }) => item.type === 'daterange');
                // eslint-disable-next-line no-empty
                if (diffDays > daterangeObj.diffDays - 1) {
                } else {
                    emit('changeParams', params.value, key);
                }
            } else if (key === 'month') {
                emitter.emit('changeMonth');
                emit('changeParams', params.value, key);
            } else {
                emit('changeParams', params.value, key);
            }
        };
        const changeData = (key: string, value: any) => {
            if (key) {
                params.value[key] = value;
            }
        };
        const screenWidth = ref(document.documentElement.clientWidth) as any;

        watch(
            () => screenWidth.value,
            val => {
                screenWidth.value = val;
            },
            {
                deep: true
            }
        );
        expose({ changeData, refreshParams, params });
        watch(
            () => params.value.daterange,
            (nowVal, oldVal) => {
                const date = nowVal.split('-');
                const diffDays = dayjs(date[1]).diff(date[0], 'day');
                const daterangeObj = props.list.find((item: { type: string }) => item.type === 'daterange');
                if (diffDays > daterangeObj.diffDays - 1) {
                    $Message.error({ title: i18n.global.t('meos_control_web.long_choose_days', { diffDays: daterangeObj.diffDays }) });
                    nextTick(() => {
                        params.value.daterange = oldVal;
                        emit('changeParams', params.value);
                    });
                }
            }
        );
        // 下载文件
        const downLoad = async () => {
            getDownLoad(props.downLoadParams, props.downLoadUrl).then((res: any) => {
                if (res) {
                    const fileName = `${props.leftOptionName}-${props.rightOptionName}.xls`;
                    const down = document.createElement('a');
                    down.download = fileName;
                    down.style.display = 'none'; // 隐藏,没必要展示出来
                    down.href = URL.createObjectURL(res);
                    document.body.appendChild(down);
                    down.click();
                    URL.revokeObjectURL(down.href); // 释放URL 对象
                    document.body.removeChild(down); // 下载完成移除
                } else {
                    $Message.error(i18n.global.t('meos_control_web.server_exception'));
                }
            });
        };

        onMounted(() => {
            window.addEventListener('resize', () => {
                screenWidth.value = document.documentElement.clientWidth;
            });
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', () => {
                screenWidth.value = document.documentElement.clientWidth;
            });
        });

        return {
            params,
            showDate,
            changeParams,
            handleInput,
            hasSearch,
            downLoad,
            urlComputed,
            goBack,
            i18n,
            route,
            changeBtn,
            screenWidth
        };
    }
});
</script>
<style scoped lang="less">
.header-filter {
    padding: 0 16px;
    position: relative;
    &-left {
        font-family: Microsoft YaHei UI;
        color: #1b2129;
        .back {
            cursor: pointer;
        }
        .back-1920 {
            width: 20px;
            height: 20px;
        }
        .back-1366 {
            width: 14px;
            height: 14px;
        }
        .back-text {
            text-align: center;
            cursor: pointer;
        }
        .back-text-1920 {
            font-size: 16px;
            line-height: 24px;
            margin: 0 8px 0 2px;
        }
        .back-text-1366 {
            font-size: 12px;
            line-height: 18px;
            margin: 0 6px 0 1px;
        }
        .line {
            width: 1px;
            background: #c4c9cf;
        }
        .line-1920 {
            height: 20px;
            margin: 0 8px;
        }
        .line-1366 {
            height: 14px;
            margin: 0 5px;
        }
        .schedule {
            color: #32383e;
            font-weight: 700;
        }
        .schedule-1920 {
            font-size: 20px;
            line-height: 28px;
        }
        .schedule-1366 {
            font-size: 16px;
            line-height: 20px;
        }
        .system {
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            padding: 1px 8px;
            border-radius: 4px;
            background: #e8ecf0;
            margin: 0 12px;
        }
        .daterange-box {
            position: relative;
            cursor: pointer;
            .svg-left {
                z-index: 1;
                position: absolute;
                top: 5px;
                left: 0;
            }
            .svg-right {
                z-index: 1;
                position: absolute;
                top: 5px;
                right: 0;
            }
        }
        .month {
            :deep(.m-date-picker__result) {
                padding-left: 70px;
            }
        }
    }
    &-left-item {
        :deep(.m-date-picker__result) {
            padding-left: 30px;
            .date-icon {
                display: none;
            }
            span {
                color: var(--gray-500);
            }
            .m-date-picker__result_text {
                color: var(--gray-900);
            }
        }
    }
    .downLoad {
        margin-left: 12px;
    }
    .linear-svg {
        margin: 0 8px 0 12px;
    }
    .linear {
        color: var(--grey-grey-500, #8b949e);
        font-size: 12px;
        line-height: 20px;
    }
}
</style>
