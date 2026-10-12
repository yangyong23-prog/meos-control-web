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
                {{ i18n.global.t('meos_control_web.heat_station_schedule') }}
            </div>
            <span class="system">{{ route.query.systemName }}</span>
            <div v-for="item in list" :key="item.key" class="header-filter-left-item fc">
                <template v-if="item.type === 'month'">
                    <div class="daterange-box month">
                        <svg aria-hidden="true" class="svg-left" style="height: 20px; width: 20px" @click="changeBtn('leftM')">
                            <use xlink:href="#icon-left" />
                        </svg>
                        <m-date-picker v-model="params.month" class="picker" :clearable="false" type="month" v-bind="item.attrs" @change="changeParams('month')" />
                        <svg aria-hidden="true" class="svg-right" style="height: 20px; width: 20px" @click="changeBtn('rightM')">
                            <use xlink:href="#icon-right" />
                        </svg>
                    </div>
                </template>
            </div>
            <svg v-if="monthData.length" aria-hidden="true" class="linear-svg" style="height: 16px; width: 16px">
                <use xlink:href="#icon-linears" />
            </svg>
            <span v-if="monthData.length" class="linear"
                >{{ i18n.global.t('meos_control_web.configured_schedule_months')
                }}{{
                    monthData
                        .split('、')
                        .filter((item: any) => item)
                        .join('、')
                }}</span
            >
        </div>
        <div class="header-filter-right">
            <slot name="append" :params="params" :list="list"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { $Message } from 'meri-plus';
import { getDownLoad } from '@/apis/public';
import emitter from '@/utils/bus';
import { useRoute } from '@/hooks/setupHelper';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

export default defineComponent({
    components: {},
    props: {
        list: {
            type: Array as PropType<any>,
            required: true
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
            router.go(-1);
        };
        const params: Ref<Record<string, any>> = ref({
            search: '',
            month: ''
        });

        function refreshParams() {
            const { list } = props;
            list.forEach((item: any) => {
                if (item.type === 'month') {
                    params.value.month = item.dayHandler() || `${getDayjsTz().format('YYYY.MM')}`;
                } else {
                    params.value[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
                }
            });
            emit('defaultParams', params.value);
        }
        refreshParams();

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
                default:
                    break;
            }
            changeParams();
        };
        const changeParams = (key?: string) => {
            if (key === 'month') {
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
            changeParams,
            i18n,
            goBack,
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
