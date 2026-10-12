<template>
    <div class="table-list wh100">
        <BrTable
            type="local"
            :columns="columns"
            :span-arr-set="isOneBuild ? [] : [{ keys: ['buildName'], index: [0] }]"
            :data-source="dataSource"
            :show-pagination="false"
            column-line
        >
            <template v-for="slotName in slots" :key="slotName" #[slotName]="{ row }">
                <span v-html="getCount(row, slotName)"></span>
            </template>
        </BrTable>
    </div>
</template>

<script setup>
import BrTable from '@/components/brcomponents/br-table/index.vue';
import i18n from '@/localization';
import { isNil, orderBy } from 'lodash';
const props = defineProps({
    dataSource: { type: Array, default: () => [], required: true },
    classListMap: { type: Map, default: () => new Map(), required: true },
    isOneBuild: { type: Boolean, default: false }
});
const columns = ref([
    {
        dataIndex: 'buildName',
        title: i18n.global.t('common.build'),
        fixed: 'left'
    },
    {
        dataIndex: 'name',
        title: i18n.global.t('common.floor'),
        fixed: 'left'
    },
    {
        dataIndex: 'total',
        title: i18n.global.t('meos_control_web.equipment_total'),
        children: [
            {
                dataIndex: 'total-runningCount',
                title: i18n.global.t('meos_control_web.open_count')
            },
            {
                dataIndex: 'total-totalCount',
                title: i18n.global.t('meos_control_web.total_count')
            }
        ]
    }
]);
const slots = ref(['total-runningCount', 'total-totalCount']);
const text = `<span style="color: var(--gray-400)">${i18n.global.t('common.no_data_short')}</span>`;

const sumStatField = (statistics, field) => {
    let hasValue = false;
    const total = statistics.reduce((sum, stat) => {
        if (isNil(stat?.[field])) {
            return sum;
        }
        hasValue = true;
        return sum + (stat[field] || 0);
    }, 0);

    return hasValue ? total : text;
};

const findStatByName = (statistics, slotName, suffix) => {
    const classCode = slotName.replace(suffix, '');
    return statistics.find(item => item.templateName === classCode);
};

const getCount = (row, name) => {
    const statistics = row?.statistics || [];

    if (name === 'total-totalCount') {
        return sumStatField(statistics, 'totalCount');
    }

    if (name === 'total-runningCount') {
        return sumStatField(statistics, 'openCount');
    }

    if (name.endsWith('-runningCount')) {
        const stat = findStatByName(statistics, name, '-runningCount');
        return stat?.totalCount ? (!isNil(stat.openCount) ? stat.openCount : text) : text;
    }

    if (name.endsWith('-totalCount')) {
        const stat = findStatByName(statistics, name, '-totalCount');
        return stat?.totalCount ?? text;
    }

    return text;
};
const handleColumns = () => {
    const arr = [];
    props.classListMap.forEach(item => {
        arr.push({
            dataIndex: `${item.classCode}-runningCount`,
            title: item.templateName,
            templateSequence: item.templateSequence,
            children: [
                {
                    dataIndex: `${item.classCode}-runningCount`,
                    title: i18n.global.t('meos_control_web.open_count')
                },
                {
                    dataIndex: `${item.classCode}-totalCount`,
                    title: i18n.global.t('meos_control_web.total_count')
                }
            ]
        });
        slots.value.push(`${item.classCode}-runningCount`);
        slots.value.push(`${item.classCode}-totalCount`);
    });
    columns.value.push(...orderBy(arr, ['templateSequence']));
};
onMounted(() => {
    if (props.isOneBuild) {
        columns.value.shift();
    }
    handleColumns();
});
</script>
<style lang="less" scoped>
.table-list {
    :deep(.meri-table) {
        height: 100%;
    }
}
</style>
