<template>
    <m-form-item>
        <template #label>{{ i18n.global.t('meos_control_web.chiller_operating_units') }}<span style="color: var(--red-500)"> *</span></template>
        <m-form-item label="" prop="max" style="margin-bottom: 0" :rules="rules.max">
            <m-select v-model="params.max" :placeholder="i18n.global.t('common.placeholder_input')" controls="operatorIcon" :size="70" :options="maxList" @change="change" />
        </m-form-item>
        &nbsp;&nbsp;{{ i18n.global.t('common.large') }}&nbsp;&nbsp;
        <m-form-item label="" prop="min" style="margin-bottom: 0" :rules="rules.min">
            <m-select v-model="params.min" :placeholder="i18n.global.t('common.placeholder_input')" controls="operatorIcon" :size="70" :options="minList" @change="change" />
        </m-form-item>
        &nbsp;&nbsp;{{ i18n.global.t('common.small') }}
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';

const params = inject(
    'params',
    ref({
        max: '',
        min: '',
        reason: ''
    })
);
const rules = ref({
    min: [{ required: true, message: EMPTYTEXT, trigger: 'change' }],
    max: [{ required: true, message: EMPTYTEXT, trigger: 'change' }]
});

const maxList = ref([{ id: '0', name: '0' }]);
const minList = ref([{ id: '0', name: '0' }]);
const coldNum = inject('coldNum');
const getCoolerNum = () => {
    if (coldNum.value.large_cooler) {
        for (let index = 1; index <= coldNum.value.large_cooler; index++) {
            maxList.value.push({ id: index.toString(), name: index.toString() });
        }
    }
    if (coldNum.value.small_cooler) {
        for (let index = 1; index <= coldNum.value.small_cooler; index++) {
            minList.value.push({ id: index.toString(), name: index.toString() });
        }
    }
};
const change = () => {
    params.value.reason = '';
};

watch(coldNum, () => {
    getCoolerNum();
});
</script>
<style lang="less">
.control-pop {
    .m-form-item .m-form-item__content .m-form-item__error {
        word-break: keep-all;
    }
}
</style>
