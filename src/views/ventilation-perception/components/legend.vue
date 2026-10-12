<template>
    <div class="legend-wrap" :style="{ padding: '11px 20px' }">
        <!-- 全楼运行tab或楼层 -->
        <template v-if="(currentTab === 'runStatus' && !floorView) || (currentTab === 'runStatus' && floorView)">
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
            <div v-for="(item, index) in switchList.slice(0, 5)" :key="index + 's'" class="switch legend-item">
                <i class="mark" :style="{ background: item.color }"></i><span class="legend-name ft">{{ item.name }}</span>
            </div>
            <template v-if="selectData || floorView">
                <div class="divide"></div>
                <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>

                <div v-for="(item, index) in floorView ? switchListEq.slice(0, 6) : switchListEq" :key="index" class="pipeline legend-item">
                    <span v-if="item.innerText" class="rect-icon" :style="{ backgroundColor: item.bgColor, borderColor: borderColor }">{{ item.innerText }}</span>
                    <i v-else class="mark" :style="{ background: item.color }"></i
                    ><span class="legend-name" :style="{ color: index === switchListEq.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
                </div>
            </template>
        </template>
        <!-- 全楼异常tab或楼层 -->
        <template v-else>
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
            <div v-for="(item, index) in selectData ? switchList.slice(5, 7) : switchList.slice(5, 6)" :key="index + 's'" class="switch legend-item">
                <i class="mark" :style="{ background: item.color }"></i><span class="legend-name ft">{{ item.name }}</span>
            </div>
            <div class="divide"></div>
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>
            <template v-if="floorView">
                <div v-for="(item, index) in switchListEq.slice(0, 6)" :key="index" class="pipeline legend-item">
                    <span v-if="item.innerText" class="rect-icon" :style="{ backgroundColor: item.bgColor, borderColor: borderColor }">{{ item.innerText }}</span>
                    <i v-else class="mark" :style="{ background: item.color }"></i
                    ><span class="legend-name" :style="{ color: index === switchListEq.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
                </div>
            </template>
            <template v-else>
                <div v-for="(item, index) in selectData ? switchListEq : switchListEq.slice(0, 6)" :key="index" class="pipeline legend-item">
                    <span v-if="item.innerText" class="rect-icon" :style="{ backgroundColor: item.bgColor, borderColor: borderColor }">{{ item.innerText }}</span>
                    <i v-else class="mark" :style="{ background: item.color }"></i
                    ><span class="legend-name" :style="{ color: index === switchListEq.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';

// 当前tab
const currentTab = inject('currentTab');
// 当前楼层tab
const currentTabFloor = inject('currentTabFloor');
//当前楼层对象
const currentFloorObj = inject('currentFloorObj');
//选择的设备或者空间
const showModuleInfo = inject('showModuleInfo');

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});
const selectData = computed(() => {
    return showModuleInfo.value;
});
const switchList = computed(() => legendObj.spaceStatus);
const switchListEq = computed(() => legendObj.switchListEq);

const legendObj = {
    spaceStatus: [
        {
            name: i18n.global.t('meos_control_web.supply_and_exhaust_air'),
            color: '#83CDA0'
        },
        {
            name: i18n.global.t('meos_control_web.supplying_air'),
            color: '#80CDD8'
        },
        {
            name: i18n.global.t('meos_control_web.exhausting'),
            color: '#8AC9F8'
        },
        {
            name: i18n.global.t('meos_control_web.not_ventilated'),
            color: '#C9B79B'
        },
        {
            name: i18n.global.t('meos_control_web.monitoring_unavailable'),
            color: '#BBC1C8'
        },
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F49995'
        },
        {
            name: i18n.global.t('meos_control_web.normal'),
            color: '#85CDA1'
        }
    ],
    switchListEq: [
        {
            name: i18n.global.t('meos_control_web.on'),
            color: '#fff',
            bgColor: '#09B3B5',
            borderColor: 'rgba(255, 255, 255, 0.70)',
            innerText: i18n.global.t('meos_control_web.on')
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            color: '#fff',
            bgColor: '#424C59',
            borderColor: 'rgba(255, 255, 255, 0.70)',
            innerText: i18n.global.t('meos_control_web.off')
        },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            color: '#fff',
            bgColor: '#C4C9CF',
            borderColor: 'rgba(255, 255, 255, 0.70)',
            innerText: '--'
        },
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        },
        {
            name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
            color: '#FFB800'
        },
        {
            name: i18n.global.t('meos_control_web.offline'),
            color: '#C4C9CF'
        },
        {
            name: i18n.global.t('meos_control_web.normal'),
            color: '#15AE55'
        }
    ]
};
</script>

<style lang="less" scoped>
.legend-wrap {
    max-width: calc(100% - 85px);
    width: max-content;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    border-radius: 4px 4px 0px 0px;
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 14px;
    white-space: nowrap;
    .legend-category-name {
        font-weight: 700;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }

        .rect-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 2px;
            margin-right: 4px;
            font-size: 10px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 18px;
            color: #fff;
            border-width: 1px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
.divide {
    width: 1px;
    height: 14px;
    background: @grey-400;
    margin: 0 14px 0 2px;
}
.pipeline .mark {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 90px;
    margin-right: 4px;
    border: 1px solid #fff;
}

.switch .mark {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    border-radius: 2px;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    line-height: 14px;
}
.mark-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
}
</style>
