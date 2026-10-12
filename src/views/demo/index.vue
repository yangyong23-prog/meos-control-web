<template>
    <div class="demo">
        <H5>{{ i18n.global.t('meos_control_web.please_open_vpn_for_data') }}</H5>
        <BrTable
            style="height: 500px"
            :params="params"
            url="https://www.fastmock.site/mock/ed26be7a6453f01821416b9b7af488dd/devin/table/list"
            :columns="columns"
            :span-arr-set="[{ keys: ['id'], index: [0] }]"
        >
            <template #name="{ row }">
                <m-tag color="#00A2A7" bg-color="#CBF7F3" size="large"> {{ row.name }} </m-tag>
            </template>
        </BrTable>
        <Calendar>
            <template #date-cell="{ data }">
                <div :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                    {{ data.isSelected ? '√' : '' }}
                </div>
            </template>
        </Calendar>
    </div>
</template>

<script lang="ts" setup>
import i18n from '@/localization';
import BrTable from '@/components/brcomponents/br-table/index.vue';
import Calendar from '@/components/calendar/calendar.vue';
const params = ref({});
const columns = ref([
    {
        dataIndex: 'id',
        title: 'id'
    },
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.full_name')
    },
    {
        dataIndex: 'age',
        title: i18n.global.t('meos_control_web.age')
    },
    {
        dataIndex: 'email',
        title: i18n.global.t('meos_control_web.email')
    }
]);
const value = ref(new Date('2024-03'));
</script>
<style lang="less" scoped>
.demo {
    width: 1000px;
    margin: 100px auto;
}
</style>
