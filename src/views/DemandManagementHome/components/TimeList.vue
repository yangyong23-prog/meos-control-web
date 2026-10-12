<template>
    <div class="f">
        <div class="ft" style="min-width: 130px">{{ title }}</div>
        <div>
            <m-form-item
                v-for="(item, i) in list"
                :key="item.id"
                label-width="1"
                :prop="'item.' + i + '.value'"
                :item-model="item.value"
                :rules="[
                    {
                        validator: (value, rule, callback) => validateListItem(callback, item),
                        trigger: ['change']
                    }
                ]"
                class="form-box"
                label=""
            >
                <m-time-picker
                    v-model="item.value"
                    hide-clear
                    :popover-attrs="{
                        'popover-class': 'popoverClass',
                        arrowOverflow: false
                    }"
                    :placeholder="acquiesce ? i18n.global.t('meos_control_web.all_day_schedulable') : i18n.global.t('meos_control_web.start_time_to_end_time')"
                    format="hm"
                    range
                    step-m="15"
                    placement="bottomRight"
                    @change="changeDate(i)"
                />
                &nbsp;
                <div>
                    <m-tips placement="bottom" :content="i18n.global.t('meos_control_web.add_time_slot')" theme="darkTransparent">
                        <m-button :disabled="list.length === 10" type="icon" icon="IconMeriComponentCadd" @click="addItem(list, i)" />
                    </m-tips>
                    <m-tips v-if="list.length > 1" placement="bottom" :content="i18n.global.t('meos_control_web.delete_period')" theme="darkTransparent">
                        <m-button class="addBtn" type="icon" icon="IconMeriComponentSubtract" @click="deleteItem(list, i)" />
                    </m-tips>
                </div>
            </m-form-item>
        </div>
    </div>
</template>
<script setup>
import { uniqueId } from 'lodash';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { dayjsIsBetween, dayjsIsSame } from '@/utils/dayjsTools';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    }
});
const acquiesce = ref(true);
const validateListItem = (callback, data) => {
    if (data.value) {
        const dataStart = `2023-01-01 ${data.value.split('-')[0]}`;
        const dataEnd = `2023-01-01 ${data.value.split('-')[1]}`;
        const timeList = props.list.filter(item => item.id !== data.id);
        let flag = false,
            text = '';
        for (const item of timeList) {
            if (item.value) {
                const start = `2023-01-01 ${item.value.split('-')[0]}`;
                const end = `2023-01-01 ${item.value.split('-')[1]}`;
                console.log(dataStart, dataEnd);
                console.log(start, end);
                if (dayjsIsBetween(dayjs(dataStart), start, end)) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.time_slot_no_overlap');
                }
                if (dayjsIsBetween(dayjs(dataEnd), start, end)) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.time_slot_no_overlap');
                }
                if (dayjsIsSame(dayjs(dataEnd), dayjs(end))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.time_slot_no_overlap');
                }
                if (dayjsIsSame(dayjs(dataStart), dayjs(start))) {
                    flag = true;
                    text = i18n.global.t('meos_control_web.time_slot_no_overlap');
                }
            }
        }
        if (!flag) {
            if (dataStart === dataEnd) {
                flag = true;
                text = i18n.global.t('meos_control_web.min_select_15_minutes');
            }
        }
        if (flag) {
            callback(new Error(text));
        } else {
            callback();
        }
    } else {
        callback();
    }
};
const changeDate = i => {
    console.log(i);
};
const addItem = list => {
    acquiesce.value = false;
    list.push({
        value: '',
        id: uniqueId('item')
    });
};
const deleteItem = (data, i) => {
    data.splice(i, 1);
    if (data?.length === 1) {
        acquiesce.value = true;
    }
};
</script>
<style lang="less" scoped>
.addBtn {
    margin-left: 0px !important;
}
</style>
