<template>
    <div v-if="!list || list?.length === 0" class="no-data">
        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
    </div>
    <m-scrollbar v-else box-class="rel-equipment-box-scrollbar" @scroll="onScroll">
        <div class="fcb">
            <div class="title-item f16 fb7 mt16">
                {{ i18n.global.t('meos_control_web.property_zone') }}<span class="sec-title">({{ i18n.global.t('meos_control_web.spaces_served_by_loop') }})</span>
            </div>
        </div>
        <div>
            <ObjItem v-for="(obj, idx) in list" :key="idx" :data="obj" v-bind="$attrs"> </ObjItem>
        </div>
    </m-scrollbar>
</template>

<script setup>
import i18n from '@/localization';
import ObjItem from './objItem.vue';
import useLoading from '@/hooks/useLoading';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    selectObj: {
        type: Object,
        default: () => {}
    },

    list: {
        type: Array,
        default: () => []
    }
});

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
</script>

<style lang="less" scoped>
.content {
    height: 100%;
}
:deep(.rel-equipment-box-scrollbar) {
    padding: 0 24px 16px 24px;
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
    .sec-title {
        margin-left: 4px;
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
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
