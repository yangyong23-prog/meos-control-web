<template>
    <div class="instance-basic-info-wrap" style="height: 100%">
        <m-scrollbar v-if="showData && !isLoading" box-class="instance-basic-info-scrollbar">
            <div class="has-data">
                <div v-for="(group, indexP) in basicInfoList" :key="indexP" class="plate">
                    <div class="group-name">
                        <span>{{ group.groupName || '--' }}</span>
                        <span class="vertical-line" />
                    </div>
                    <div class="sub">
                        <div v-for="(column, indexC) in group.relInfoCodeConfigs" :key="indexC" class="column">
                            <div class="label">{{ column.infoCodeName }}</div>
                            <div class="text-warp">
                                <div v-if="column.originDataType == 'Pic'" class="text">
                                    <div class="picture">
                                        <div v-if="!column?.dataValue?.length" class="text">--</div>
                                        <ImgView v-else :data="column"></ImgView>
                                    </div>
                                </div>
                                <!-- 文本 TODO 自定义指令 textEllips -->
                                <div v-else class="text">
                                    {{ getShowText(column) || '--' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </m-scrollbar>
        <div v-else-if="!isLoading" class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useBaseInfo from '../hooks/useBaseInfo';
import ImgView from './ImgView.vue';
import { toNumber } from 'lodash';
const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});
const { queryEquipmentInfo, basicInfoList, isLoading } = useBaseInfo();
// 判断数据是否为空
const showData = computed(() => {
    const infocodes = basicInfoList.value.reduce((acc, group) => {
        return acc + (group?.relInfoCodeConfigs?.length || 0);
    }, 0);
    return !!infocodes;
});

const getShowText = column => {
    if (column.dataSource) {
        const dataName = column.dataSource.find(dsource => toNumber(dsource.code) === toNumber(column.dataValue));

        if (dataName) {
            return dataName.name;
        }
    }
    return column.dataValue;
};

watch(
    () => props.id,
    () => {
        queryEquipmentInfo([props.id]);
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
:deep(.instance-basic-info-scrollbar) {
    padding: 20px 10px 0 24px;
    font-size: 16px;
    width: 100%;
    .m-scrollbar__content {
        width: 100%;
        overflow: hidden;
    }
}
.img-warp {
    :deep(.m-image-upload) {
        width: 80px;
        height: 80px;
        display: block;
        overflow: hidden;
        .m-image-upload-item {
            width: 100%;
            height: 100%;
            display: block;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 2px;
            overflow: hidden;
        }
    }
}
.plate {
    background-color: #fff;
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }

    .group-name {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: var(--gray-900);
        position: relative;
        padding-left: 12px;
        .vertical-line {
            top: 5px;
            left: 0px;
            width: 3px;
            height: 14px;
            background: #246fe5;
            position: absolute;
        }
    }

    .sub {
        padding-bottom: 16px;
        padding-left: 12px;

        &:last-of-type {
            margin-bottom: 0;
        }

        .sub-name {
            border-radius: 4px;
            padding: 0px 12px;
            margin: 16px -12px 0;
            line-height: 22px;
            font-weight: 700;
            font-size: 14px;
            color: var(--gray-900);
        }
    }

    .column {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: normal;
        line-height: 22px;

        .label {
            width: 142px;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: var(--platform-font-weight);
            font-size: 14px;
            line-height: 22px;
            color: var(--gray-600);
            word-break: break-all;
        }

        .text-warp {
            width: calc(100% - 158px);
            line-height: 22px;
            font-size: 14px;
            color: var(--gray-900);

            .text {
                color: var(--gray-900);
                word-break: break-all;
                cursor: default;
            }

            .text-ellips {
                display: -webkit-box;
                overflow: hidden;
                word-break: break-all;
                -webkit-line-clamp: 2;

                /* autoprefixer: off */
                -webkit-box-orient: vertical;
            }

            .text-blue {
                color: var(--blue-500);
                cursor: pointer;
            }

            .more {
                color: var(--blue-500);
                cursor: pointer;
            }

            .sub-text-warp {
                display: flex;
                margin-bottom: 4px;

                &:last-child {
                    margin-bottom: 0;
                }

                .sub-text {
                    width: calc(100% - 46px);
                    word-wrap: break-word;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .divider {
                    margin-top: 4px;
                    margin-left: 8px;
                    margin-right: 8px;
                    width: 1px;
                    height: 14px;
                    background: var(--gray-300);
                }
            }
        }

        .text-warp-position-map {
            width: 100%;
            margin-top: -4px;

            .plate-content {
                .position-info {
                    display: flex;
                    justify-content: flex-start;

                    .space-name {
                        display: flex;
                        align-items: flex-start;
                        font-style: normal;
                        font-weight: var(--platform-font-weight);
                        font-size: 14px;
                        line-height: 22px;

                        .space-name-label {
                            flex-shrink: 0;
                            color: var(--grey-600);
                        }

                        .warp {
                            display: flex;

                            .text-ellips {
                                display: -webkit-box;
                                overflow: hidden;
                                word-break: break-all;
                                -webkit-line-clamp: 1;

                                /* autoprefixer: off */
                                -webkit-box-orient: vertical;
                            }

                            .space-name-value {
                                word-break: break-all;
                                color: var(--grey-900);

                                &.space-name-value-blue {
                                    color: var(--blue-500);
                                    cursor: pointer;
                                }
                            }
                        }
                    }

                    .space-name-floor {
                        flex-shrink: 0;
                        display: inline-block;
                        line-height: 22px;
                        margin-left: 8px;
                        padding: 0 4px;
                        background: @grey-200;
                        border-radius: 4px;
                        word-break: keep-all;
                        color: @grey-800;
                        font-size: 14px;
                        height: 22px;
                    }

                    .split {
                        flex-shrink: 0;
                        margin: 5px 8px;
                        width: 2px;
                        background-color: #e4e6e7;
                        height: 12px;
                    }
                }
            }
        }
    }
}

// .loading-warp {
//     width: 100%;
//     height: 100%;
// }

.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
