<template>
    <div class="new-shell-config-module">
        <aside class="shell-left-wrap">
            <div class="config-left-wrap">
                <NavItem v-for="item in leftList" :key="item.id" :data="item"></NavItem>
            </div>
        </aside>
        <section class="shell-right-wrap">
            <configRight />
        </section>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import NavItem from './configLeft/NavItem.vue';
import configRight from './configRight/index.vue';
import { getGroupList } from '@/apis/xshellConfiguration';
// #选中的二级标题key值
const selectKey = ref('1');
// #展开的一级标题key值
const openKey = ref('automation');
// #左侧列表值
const leftList = ref([
    {
        name: i18n.global.t('meos_control_web.auto_demand_calc_condition_input'),
        key: 'automation',
        id: 'automation',
        children: [
            {
                name: i18n.global.t('meos_control_web.algorithm_and_jump_calc_conditions'),
                key: '1',
                id: '1',
                children: [
                    {
                        name: i18n.global.t('meos_control_web.central_cooling_system'),
                        key: '31',
                        id: '32'
                    },
                    {
                        name: i18n.global.t('meos_control_web.central_heat_cool_source_system'),
                        key: '33',
                        id: '33'
                    }
                ]
            },
            {
                name: i18n.global.t('meos_control_web.space_quality_judgment_condition'),
                key: '2',
                id: '2',
                children: [
                    {
                        name: i18n.global.t('meos_control_web.central_heating_system'),
                        key: '31',
                        id: '32'
                    },
                    {
                        name: i18n.global.t('meos_control_web.central_heat_cool_source_system'),
                        key: '33',
                        id: '33'
                    }
                ]
            },
            {
                name: i18n.global.t('meos_control_web.space_quality_judgment_and_demand_jump_calc_condition_input'),
                key: '3',
                id: '3',
                children: []
            }
        ]
    },
    {
        name: i18n.global.t('meos_control_web.frontend_input_range'),
        key: 'web',
        children: [
            {
                name: i18n.global.t('common.space'),
                key: '4',
                id: '5',
                children: []
            }
        ]
    }
]);
// #当前选中的列表信息
const selectList = ref([
    {
        name: i18n.global.t('meos_control_web.central_cooling_system'),
        key: '31',
        id: '32'
    },
    {
        name: i18n.global.t('meos_control_web.central_heat_cool_source_system'),
        key: '33',
        id: '33'
    }
]);
// #加载状态
const loading = ref(false);
// 页面是否编辑过 -> 切换tab使用,进行弹窗提示
const isEdit = ref(false);

// ?请求壳配置列表
const queryShellConfig = async () => {
    loading.value = true;
    try {
        let data = await getGroupList();
    } finally {
        loading.value = false;
    }
};
// queryShellConfig();

provide('selectKey', selectKey);
provide('openKey', openKey);
provide('leftList', leftList);
provide('loading', loading);
provide('isEdit', isEdit);
provide('selectList', selectList);
</script>

<style lang="less" scoped>
.new-shell-config-module {
    height: 100%;
    display: flex;
    justify-content: space-between;
    .shell-left-wrap {
        display: flex;
        width: 260px;
        height: 100%;
        padding: 16px 12px;
        box-sizing: border-box;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        flex-shrink: 0;
        background: @grey-50;
        .config-left-wrap {
            height: 100%;
            width: 100%;
        }
    }
    .shell-right-wrap {
        flex: 1;
        width: 0;
        min-width: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
}
</style>
