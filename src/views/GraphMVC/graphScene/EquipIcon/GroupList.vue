<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="group-card" :style="{ left: `${left}px`, top: `${top}px` }" @mouseenter="mouseenter" @mouseleave="close">
        <div class="bg-warp">
            <div class="group-list">
                <template v-for="(item, key) in showObj" :key="key">
                    <div class="class-name">{{ item[0].className }}</div>
                    <div v-for="equip in item" :key="key + equip.id" class="class-item" @click="e => clickItem(e, equip)">
                        <div class="class-item-icon" :style="{ backgroundColor: equipIconBackgroundColor(equip.groupId || equip.classCode) }" v-html="equip.svg" />
                        <div class="class-item-name">
                            <span class="name-txt" @mouseenter="titleEnter">{{ equip.name }}</span
                            ><span v-if="getInfoPointTxt(equip)" class="info-point-txt" @mouseenter="titleEnter">{{ getInfoPointTxt(equip) }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { equipIconBackgroundColor } from '../../utils/d2Utils';

const emits = defineEmits(['hide', 'click']);

const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    list: {
        type: Array
    },
    left: {
        type: Number,
        default: 0
    },
    top: {
        type: Number,
        default: 0
    },
    closeInfoPoint: {
        type: Boolean,
        default: false
    },
    timer: {
        type: [Number, null],
        default: null
    }
});

console.log('props.list>>>', props.list);

const filterAbsorbs = () => {
    const equipIconInfoMap = {};
    (props.list || []).forEach(da => {
        if (!equipIconInfoMap[da.classCode]) {
            equipIconInfoMap[da.classCode] = [];
        }
        equipIconInfoMap[da.classCode].push(da);
    });
    return equipIconInfoMap;
};

const showObj = ref(filterAbsorbs());

const mouseenter = () => {
    clearTimeout(props.timer);
};
const close = () => {
    emits('hide');
};
const clickItem = (e, model) => {
    emits('click', e, model);
};

const getInfoPointTxt = equip => {
    if (props.closeInfoPoint) {
        return '';
    }
    const { _infoCode, rwdInfoVos } = equip;
    if (_infoCode && rwdInfoVos) {
        const info = rwdInfoVos.find(item => item.code === _infoCode);
        let val = info?.value;
        const dataSource = info?.dataSource;
        if (dataSource?.length) {
            const findDa = dataSource.find(item => item.code === val);
            if (findDa) {
                val = findDa.name;
            } else {
                val = '';
            }
        }
        return `${info?.name}:${val || '--'} ${info?.units || ''}`;
    }
    return '';
};
defineExpose({
    close
});
</script>
<style lang="less" scoped>
.group-card {
    position: absolute;
    z-index: 9999;
    transform: translateY(-50%);
    padding-left: 4px;

    &::before {
        content: ' ';
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: transparent #ffffff transparent transparent;
    }

    .bg-warp {
        width: 230px;
        background: #ffffff;
        border-radius: 4px;
        padding: 8px 0;

        .group-list {
            overflow: auto;
            max-height: 262px;

            .class-name {
                font-style: normal;
                font-weight: var(--platform-font-weight);
                font-size: 12px;
                line-height: 18px;
                color: @grey-600;
                padding: 0 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
                cursor: auto;
            }

            .class-item {
                padding: 10px 12px;
                display: flex;
                align-items: flex-start;
                justify-content: start;
                cursor: pointer;

                .class-item-icon {
                    margin-right: 8px;
                    border-radius: 4px;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .class-item-name {
                    font-style: normal;
                    font-weight: var(--platform-font-weight);
                    font-size: 14px;
                    line-height: 22px;
                    color: @grey-900;
                    margin-top: -2px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                    display: flex;
                    gap: 10px;
                    align-items: center;

                    .name-txt {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-break: break-all;
                    }

                    .info-point-txt {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-break: break-all;
                        color: var(--grey-600);
                        font-size: 12px;
                    }
                }

                &:hover {
                    background: @grey-100;
                }
            }
        }
    }
}
</style>
