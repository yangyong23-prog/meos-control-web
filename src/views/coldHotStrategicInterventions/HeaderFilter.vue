<template>
    <div class="header-filter fcb">
        <div class="header-filter-left fc">
            <div class="back-box">
                <img class="back" src="@/assets/imgs/up.png" @click.stop="goBack" />
                <span class="back-text" @click.stop="goBack">{{ i18n.global.t('meos_control_web.back') }}</span>
            </div>
            <Up />
            <span class="line"></span>
            <div class="schedule fs18 fw700">
                {{ i18n.global.t('meos_control_web.heating_cooling_source_schedule') }}
            </div>
            <span class="system">{{ route.query.systemName }}</span>
            <div v-for="item in list" :key="item.key" class="header-filter-left-item fc">
                <template v-if="item.type === 'month'">
                    <div class="daterange-box month">
                        <left-svg class="svg-left" @click="changeBtn('leftM')" />
                        <m-date-picker v-model="params.month" class="picker" :clearable="false" type="month" v-bind="item.attrs" @change="changeParams('month')" />
                        <right-svg class="svg-right" @click="changeBtn('rightM')" />
                    </div>
                </template>
            </div>
            <linear-svg v-if="monthData.length" class="linear-svg" />
            <span v-if="monthData.length" class="linear"
                >{{ i18n.global.t('meos_control_web.configured_strategy_months')
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
            <SetButton v-if="showBatchDelete" id="cold-hot-batch-delete-btn" ref="batchDeleteBtnRef" type="default" @click="handleBatchDelete">
                {{ i18n.global.t('meos_control_web.batch_delete') }}
            </SetButton>
            <m-popover
                popover-class="cold-hot-batch-delete-popover"
                virtual-triggering
                :virtual-ref="batchDeleteTrigger"
                trigger="manually"
                :is-open="isBatchDeletePopoverOpen"
                :show-arrow="false"
            >
                <template #content>
                    <div class="batch-delete-panel">
                        <div class="batch-delete-section">
                            <div class="batch-delete-label">
                                <span>{{ i18n.global.t('meos_control_web.time_range') }}</span>
                                <span class="required">*</span>
                            </div>
                            <m-date-picker
                                v-model="deleteDateRange"
                                class="batch-delete-date-picker"
                                :class="{ 'is-error': showDeleteValidate && !deleteDateRange }"
                                type="daterange"
                                format="YYYY.MM.DD"
                                range-separator=" - "
                                :scope="batchDeleteDateScope"
                                :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                :clearable="false"
                                :placeholder="i18n.global.t('meos_control_web.select_date')"
                            />
                            <div v-if="showDeleteValidate && !deleteDateRange" class="batch-delete-error">
                                {{ i18n.global.t('meos_control_web.input_required_check_error_4') }}
                            </div>
                        </div>
                        <div class="batch-delete-actions">
                            <m-button type="default" size="medium" @click="closeBatchDeletePopover">{{ i18n.global.t('common.cancel') }}</m-button>
                            <m-button type="danger" size="medium" @click="submitBatchDelete">{{ i18n.global.t('common.delete') }}</m-button>
                        </div>
                    </div>
                </template>
            </m-popover>
        </div>
    </div>
</template>
<script setup lang="ts">
import i18n from '@/localization';
import { useRoute } from '@/hooks/setupHelper';
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import SetButton from '@/components/common/SetButton.vue';
import leftSvg from './svgIcon/left.vue';
import rightSvg from './svgIcon/right.vue';
import linearSvg from './svgIcon/linear.vue';
import { getDayjsTz } from '@/utils/globalVariables';

const props = withDefaults(
    defineProps<{
        list: any[];
        monthData: string;
        showBatchDelete?: boolean;
    }>(),
    {
        monthData: '',
        showBatchDelete: false
    }
);

const emit = defineEmits(['changeParams', 'defaultParams', 'batchDelete']);

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
    props.list.forEach((item: any) => {
        params.value.month = item.dayHandler() || `${getDayjsTz().format('YYYY.MM')}`;
    });
    emit('defaultParams', params.value);
}

refreshParams();

const changeParams = (key?: string) => {
    emitter.emit('changeMonth');
    emit('changeParams', params.value, key);
    console.log(params.value);
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
        default:
            break;
    }
    changeParams();
};

const changeData = (key: string, value: any) => {
    if (key) {
        params.value[key] = value;
    }
};

const screenWidth = ref(document.documentElement.clientWidth) as any;
const batchDeleteBtnRef = ref();
const batchDeleteTrigger = ref<HTMLElement | null>(null);
const isBatchDeletePopoverOpen = ref(false);
const showDeleteValidate = ref(false);
const deleteDateRange = ref('');
const batchDeleteDateScope = `${getDayjsTz().add(1, 'day')} - ${getDayjsTz().add(1, 'year').endOf('year')}`;

const resetBatchDeleteForm = () => {
    showDeleteValidate.value = false;
    deleteDateRange.value = '';
};

const handleBatchDelete = async (dom?: HTMLElement) => {
    if (dom instanceof HTMLElement) {
        batchDeleteTrigger.value = dom;
    } else {
        await nextTick();
        batchDeleteTrigger.value = batchDeleteBtnRef.value?.$el || document.querySelector('#cold-hot-batch-delete-btn');
    }
    isBatchDeletePopoverOpen.value = !isBatchDeletePopoverOpen.value;
    if (!isBatchDeletePopoverOpen.value) {
        resetBatchDeleteForm();
    }
};

const closeBatchDeletePopover = () => {
    isBatchDeletePopoverOpen.value = false;
    resetBatchDeleteForm();
};

const submitBatchDelete = () => {
    showDeleteValidate.value = true;
    if (!deleteDateRange.value) {
        $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4') });
        return;
    }
    emit('batchDelete', deleteDateRange.value, closeBatchDeletePopover);
};

watch(
    () => screenWidth.value,
    val => {
        screenWidth.value = val;
    },
    {
        deep: true
    }
);

const handleWindowResize = () => {
    screenWidth.value = document.documentElement.clientWidth;
};

onMounted(() => {
    window.addEventListener('resize', handleWindowResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleWindowResize);
});

defineExpose({ changeData, refreshParams, params });
</script>
<style scoped lang="less">
.header-filter {
    padding: 8px 16px;
    position: relative;
    height: 48px;
    &-right {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    &-left {
        font-family: Microsoft YaHei UI;
        color: #1b2129;

        .back-box {
            //border: 1px solid red;
            display: flex;
            align-items: center;
            padding: 5px 8px 5px 4px;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background: rgba(196, 201, 207, 0.3);
            }
        }

        .back {
            cursor: pointer;
            width: 20px;
            height: 20px;
        }

        .back-text {
            text-align: center;
            cursor: pointer;
            font-size: 16px;
        }

        .line {
            width: 1px;
            height: 20px;
            margin: 8px;
            background: #c4c9cf;
        }

        .schedule {
            color: #32383e;
            font-weight: 700;
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
<style lang="less">
.cold-hot-batch-delete-popover {
    --m-popover-padding: 16px 20px;
    --m-popover-border-radius: 8px;

    box-shadow: 0 2px 10px rgba(27, 33, 41, 0.1);
}

.batch-delete-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-end;
    width: 240px;
    color: var(--gray-900, #1b2129);
    font-family: Microsoft YaHei UI;
}

.batch-delete-section {
    width: 100%;
}

.batch-delete-label {
    display: flex;
    gap: 2px;
    margin-bottom: 8px;
    color: var(--gray-600, #626c78);
    font-size: 14px;
    line-height: 22px;

    .required {
        color: var(--red-500, #f55047);
    }
}

.batch-delete-date-picker {
    width: 240px;

    &.is-error {
        .m-date-picker__result {
            border-color: var(--red-500, #f55047);
        }
    }
}

.batch-delete-error {
    margin-top: 4px;
    color: var(--red-500, #f55047);
    font-size: 12px;
    line-height: 17px;
}

.batch-delete-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}
</style>
