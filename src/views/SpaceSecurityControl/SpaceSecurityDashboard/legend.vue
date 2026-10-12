<template>
    <!-- dashboard 图例 -->
    <div class="legend-warp">
        <template v-for="(group, groupIndex) in legendData" :key="groupIndex">
            <span v-if="groupIndex > 0" class="split"></span>
            <div class="legend-group">
                <span class="legend-group-name">{{ group.groupName }}:</span>
                <div v-for="(item, index) in group.list" :key="index" class="legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const legendData = [
    {
        groupName: i18n.global.t('meos_control_web.disarm'),
        list: [
            {
                name: i18n.global.t('common.arm'),
                color: '#F2B4A0'
            },
            {
                name: i18n.global.t('meos_control_web.disarm_alt'),
                color: '#B0C1D4'
            },
            {
                name: i18n.global.t('meos_control_web.partial_arm'),
                color: '#F1CD87'
            },
            {
                name: i18n.global.t('meos_control_web.monitoring_unavailable'),
                color: '#C3C8CE'
            }
        ]
    }
    // ,
    // {
    //     groupName: '通行状态',
    //     list: [
    //         {
    //             name: '开放式通行',
    //             color: '#85D1A3'
    //         },
    //         {
    //             name: '权限通行',
    //             color: '#8CBFE5'
    //         },
    //         {
    //             name: '不可通行',
    //             color: '#F0ABA8'
    //         },
    //         {
    //             name: '无法监测',
    //             color: '#BBC1C8'
    //         }
    //     ]
    // }
];
</script>
<style lang="less" scoped>
.legend-warp {
    padding: 0px 20px 12px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    position: absolute;
    bottom: 0;
    width: 100%;
    .legend-group {
        display: flex;
        gap: 8px;
        align-items: center;
        .legend-group-name {
            color: var(--gray-800);
            font-size: 14px;
            font-weight: bold;
            line-height: 22px;
        }
        .legend-item {
            display: flex;
            gap: 4px;
            align-items: center;
            .mark {
                width: 12px;
                height: 12px;
                border-radius: 2px;
            }
            .legend-name {
                color: var(--gray-600);
                font-size: 14px;
                line-height: 22px;
            }
        }
    }
    .split {
        width: 1px;
        height: 14px;
        background-color: var(--gray-400);
    }
}
</style>
