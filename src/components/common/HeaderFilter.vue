<template>
    <div class="header-filter fcb">
        <div class="header-filter-left fc">
            <div v-for="item in list" :key="item.key" class="header-filter-left-item">
                <template v-if="item.type === 'tabs'">
                    <m-tabs v-model="params[item.key]" v-bind="item.attrs" @change="changeParams" />
                </template>
                <template v-if="item.type === 'daterange'">
                    <m-date-picker v-model="params.daterange" type="daterange" v-bind="item.attrs" @change="changeParams" />
                </template>
                <template v-if="item.type === 'select'">
                    <m-select v-model="params[item.key]" v-bind="item.attrs" @change="changeParams" />
                </template>
            </div>
        </div>
        <div class="header-filter-right">
            <m-input
                v-model="params.search"
                prefix-icon="IconMeriActionSearch"
                :width="240"
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
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { defineComponent, PropType, Ref } from 'vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
export default defineComponent({
    props: {
        list: {
            type: Array as PropType<any>,
            required: true
        },
        placeholder: {
            type: String as PropType<string>,
            required: false,
            default: ''
        }
    },
    emits: ['changeParams', 'defaultParams'],
    setup(props, { emit, expose }) {
        const params: Ref<Record<string, any>> = ref({
            search: '',
            daterange: ''
        });
        const showDate = ref(true);
        const hasSearch: Ref<boolean> = ref(false);
        function refreshParams() {
            const { list } = props;
            list.forEach((item: any) => {
                if (item.type === 'daterange') {
                    const start = getDayjsTz().subtract(item.subtract, 'day').startOf('day').format('YYYY.MM.DD');
                    const end = getDayjsTz().endOf('day').format('YYYY.MM.DD');
                    params.value.daterange = `${start}-${end}`;
                } else {
                    params.value[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
                }
            });
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
        const changeParams = () => {
            emit('changeParams', params.value);
        };
        const changeData = (key: string, value: any) => {
            if (key) {
                params.value[key] = value;
            }
        };
        expose({ changeData, refreshParams });
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
                    });
                }
            }
        );
        watch(
            () => props.list,
            () => {
                refreshParams();
            },
            { deep: true }
        );
        return { params, showDate, changeParams, handleInput, hasSearch };
    }
});
</script>
<style scoped lang="less">
.header-filter {
    padding: 0 16px;
    &-left-item {
        margin-right: 12px;
        :deep(.m-date-picker__result) {
            span {
                color: var(--gray-500);
            }
            .m-date-picker__result_text {
                color: var(--gray-900);
            }
        }
    }
}
</style>
