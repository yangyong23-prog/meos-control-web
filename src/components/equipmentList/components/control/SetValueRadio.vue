<template>
    <div class="set-radio wh100">
        <div class="fc" style="flex: 1">
            <m-radio-group v-model="model">
                <SetRadio v-for="item in data.dataSource" v-bind="$attrs" :key="item.code" :label="item.code" @click="e => click(e, item.code)">{{ item.name }}</SetRadio>
            </m-radio-group>
        </div>
        <SetDiv v-if="data.additionalMapValue?.recoveryDateTime" v-bind="$attrs" @click="e => openRecoveryDateTimeControlForm(e)">
            {{
                i18n.global.t('meos_control_web.deadline_to', {
                    time: dayjs(data?.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                })
            }}
        </SetDiv>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SetRadio from '@/components/common/SetRadio.vue';
import dayjs from 'dayjs';
import SetDiv from '@/components/common/SetDiv.vue';
import { openControlFormKey, openRecoveryDateTimeControlFormKey } from '../../hooks/useControlHook';
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    }
});
const openControlForm = inject(openControlFormKey);
const openRecoveryDateTimeControlFormFn = inject(openRecoveryDateTimeControlFormKey);
const model = computed(() => props.value);
const click = (e, value) => {
    openControlForm({ el: e, value, data: { ...props.data, id: props.id } });
};
const openRecoveryDateTimeControlForm = e => {
    openRecoveryDateTimeControlFormFn({ el: e, data: { ...props.data, id: props.id } });
};
</script>
<style lang="less" scoped>
.set-radio {
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    .recoveryDateTime {
        cursor: pointer;
        color: var(--blue-500);
    }
}
</style>
