<template>
    <div class="relationships-wrap">
        <div v-show="curLoading" class="loading-content"></div>
        <div v-if="!curLoading && (!groupList || groupList?.length === 0)" class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
        <m-scrollbar v-else box-class="rel-equipment-box-scrollbar" @scroll="onScroll">
            <div class="group-content">
                <template v-for="(groupItem, index) in groupList" :key="index">
                    <div class="w100 fcb" :style="{ marginTop: index > 0 ? '20px' : 0 }">
                        <div class="title-item f16 fb7">{{ groupItem?.groupName }}</div>
                        <div v-if="useExpand" class="fc unpack" style="cursor: pointer" @click="() => (groupItem.open = !groupItem.open)">
                            <div class="mr4">{{ groupItem.open ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}</div>
                            <SvgIcon name="unpack" />
                        </div>
                    </div>
                    <div v-show="groupItem.open" class="w100">
                        <template v-if="groupItem.childType === 'building'">
                            <template v-for="(building, i) in groupItem.children" :key="i">
                                <div v-if="building.children && building.children.length > 1" class="building-item" @click="building.open = !building.open">
                                    <IconMeriComponentArrowDown v-show="building.open" color="#8B949E" size="16" />
                                    <IconMeriComponentArrowRight v-show="!building.open" color="#8B949E" size="16" />
                                    {{ building.name }}
                                </div>
                                <div v-show="building.open" class="w100">
                                    <ObjItem v-for="(obj, idx) in building.children" :key="idx" :data="obj" v-bind="$attrs"> </ObjItem>
                                </div>
                            </template>
                        </template>
                        <ObjItem v-for="(obj, idx) in groupItem.children" v-else :key="idx" :data="obj" v-bind="$attrs"> </ObjItem>
                    </div>
                </template>
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import ObjItem from './objItem.vue';
import { IconMeriComponentArrowDown, IconMeriComponentArrowRight } from 'meri-icon';
import useRelationships from './useRelationships';
import { curExpandObjIdKey } from './useRelationships';
import useLoading from '@/hooks/useLoading';

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    // 是用内部hook数据
    useInternal: {
        type: Boolean,
        default: true
    },
    useExpand: {
        type: Boolean,
        default: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    buildings: {
        type: Array,
        default: () => null
    },
    data: {
        type: Array,
        default: () => []
    },
    groupCode: {
        type: String,
        default: 'relation'
    },
    handleData: {
        type: Function,
        default: null
    }
});
const curExpandObjId = ref('');
const emits = defineEmits(['loadedObjects']);
const { openLoading, closeLoading } = useLoading(
    'content',
    '#ffffff',
    'ball',
    // {
    //     width: '100px',
    //     height: '100px'
    // },
    0
);

const { groupList: _groupList, loading: _loading } = useRelationships(props, emits);
const groupList = computed(() => {
    return props.useInternal ? _groupList.value : props.data || [];
});
const curLoading = computed(() => {
    return props.useInternal ? _loading.value : props.loading;
});
watch(
    curLoading,
    () => {
        if (curLoading.value) {
            openLoading();
        } else {
            closeLoading();
        }
    },
    { immediate: true }
);
provide(curExpandObjIdKey, curExpandObjId);
</script>

<style lang="less" scoped>
.relationships-wrap {
    width: 100%;
    height: 100%;
}
.group-content {
    width: 100%;
    height: 100%;
    display: flex;

    flex-direction: column;
    align-items: flex-start;
    // gap: 20px;
}
.loading-content {
    height: 100%;
}
:deep(.rel-equipment-box-scrollbar) {
    padding: 16px 24px 16px 24px;
}
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}
.title-item {
    position: relative;
    margin-left: 10px;

    &::before {
        position: absolute;
        width: 3px;
        height: 14px;
        background: #246fe5;
        left: -10px;
        top: 4px;
        content: '';
    }
}
.unpack {
    padding: 4px;
}
.unpack:hover {
    border-radius: 2px;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.building-item {
    display: flex;
    width: 432px;
    height: 28px;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    margin-top: 12px;

    color: var(--gray-500, #8b949e);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */

    &:hover {
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
.item {
    display: flex;
    padding: 12px 12px;
    flex-direction: column;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    .equip-name {
        color: var(--Grey-900);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
    }
    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .title-tag {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        height: 20px;
        gap: 4px;
        margin-top: 4px;
    }
    .info-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .info {
            min-width: calc(50% - 8px);
            margin-top: 8px;
            .font {
                color: #626c78;
            }
            .iot-info {
                color: #246fe5;
            }

            .iot-info:hover {
                color: #1b4acc;
                cursor: pointer;
            }
        }
    }

    &:hover {
        background-color: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        cursor: pointer;
        .equip-name {
            color: var(--blue-500, #246fe5);
        }
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
