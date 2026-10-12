<template>
    <m-scrollbar v-if="!loading && showData" box-class="instance-basic-info-scrollbar ">
        <div class="has-data">
            <div v-for="(group, indexP) in fieldGroupsData()" :key="indexP" class="plate">
                <div class="group-name">
                    <span>{{ group.name || '--' }}</span>
                    <span class="vertical-line" />
                </div>
                <div v-for="(sub, indexS) in subGroupsData(group.subGroups)" :key="'sub' + indexS" class="sub">
                    <div v-if="!hidesubGName(sub, group.subGroups)" class="sub-name">{{ sub.name }}</div>
                    <div v-for="(column, indexC) in fieldsData(sub.fields)" :key="indexC" class="column">
                        <div v-if="column?.fieldMeta?.dataType !== 'POSITION_MAP'" class="label">{{ column.label }}</div>
                        <div class="text-warp" :class="column?.fieldMeta?.dataType == 'POSITION_MAP' ? 'text-warp-position-map' : ''">
                            <!-- 文本 TODO 自定义指令 textEllips -->
                            <div v-if="column.type == 'TEXT'" :key="data.id" v-textEllips="column" class="text" :class="!column.isOpen ? 'text-ellips' : ''">
                                {{ column.showText || '--' }}
                            </div>

                            <!-- 复杂类型 -->
                            <div v-else-if="column.type == 'BLOB'" class="text">
                                <!-- ATTACHMENT -->
                                <div v-if="column.fieldMeta && column.fieldMeta.dataType == 'ATTACHMENT'" class="text">
                                    <div v-if="column.fieldMeta.multiple">
                                        <div v-if="column.rawValue && column.rawValue.length === 0" class="text">--</div>
                                        <div v-else>
                                            <div v-for="obj in column.rawValue" :key="obj.id" class="sub-text-warp">
                                                <div v-ellipsis class="sub-text">{{ obj.name || '--' }}</div>
                                                <template v-if="!readonly">
                                                    <div class="divider" />
                                                    <div class="text-blue" @click="download(obj)">{{ i18n.global.t('meos_control_web.download') }}</div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="column.rawValue" class="text">{{ column.rawValue.name || '--' }}</div>
                                        <div v-else class="text">--</div>
                                    </div>
                                </div>

                                <!-- PICTURE -->
                                <div v-else-if="column.fieldMeta && column.fieldMeta.dataType == 'PICTURE'" class="text">
                                    <div class="picture">
                                        <div v-if="!column?.rawValue?.length" class="text">--</div>
                                        <ImgView v-else :data="column"></ImgView>
                                    </div>
                                </div>

                                <!-- POSITION_MAP -->
                                <div v-else-if="column.fieldMeta && column.fieldMeta.dataType == 'POSITION_MAP'" class="plate-content">
                                    <div class="position-info">
                                        <div class="space-name">
                                            <div v-if="fullSpaceName(column.rawValue) || column.rawValue.floor.localId" class="space-name-label">
                                                {{ i18n.global.t('meos_control_web.located_position_colon') }}
                                            </div>
                                            <div class="warp">
                                                <div v-ellipsis class="text text-ellips">
                                                    {{ fullSpaceName(column.rawValue) || '--' }}
                                                </div>
                                            </div>
                                            <div v-if="!fullSpaceName(column.rawValue) && !column.rawValue.floor.localId" class="space-name-no-data">
                                                {{ i18n.global.t('meos_control_web.no_location_name_info') }}
                                            </div>
                                        </div>
                                        <div v-if="column.rawValue.floor.localId" class="space-name-floor">{{ column.rawValue.floor.localId }}</div>
                                    </div>
                                </div>

                                <!-- SIMPLE_OBJECT -->
                                <div v-else-if="column.fieldMeta && column.fieldMeta.dataType == 'SIMPLE_OBJECT'" class="text">
                                    <div v-if="column.fieldMeta.multiple" class="text">
                                        <div v-if="column.rawValue && column.rawValue.length === 0" class="text">--</div>
                                        <div v-else>
                                            <span v-for="(obj, index) in column.rawValue" :key="obj.id" class="text">
                                                <span>{{ obj.localName ?? '--' }}</span>
                                                <span v-if="index !== column.rawValue.length - 1">、</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div v-else-if="readonly" class="text">
                                        {{ column.rawValue.localName ?? '--' }}
                                    </div>
                                    <div v-else class="text-blue" @click="showDetail(column.rawValue)">
                                        {{ column.rawValue.localName ?? '--' }}
                                    </div>
                                </div>
                            </div>

                            <div v-if="column.more" class="more" @click="changeCollapseExpand(column)">
                                {{ column.isOpen ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </m-scrollbar>
    <div v-else-if="!loading" class="no-data">
        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getBaseInfo } from '@/apis/ACOperationControl';
import { MLoading } from 'meri-plus';
import ImgView from './ImgView.vue';
const FORM_CONTROL_SPECIAL_TYPE = ['POSITION_MAP', 'SIMPLE_OBJECT', 'PICTURE', 'ATTACHMENT'];

const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});

// 自定义指令
const vTextEllips = {
    mounted: (el, binding) => {
        if (binding.value.isOpen) {
            binding.value.more = true;
            binding.value.isOpen = false;
        } else {
            if (el.scrollHeight > el.clientHeight) {
                binding.value.more = true;
            } else {
                binding.value.more = false;
            }
        }
    }
};

const data = ref();

// 判断数据是否为空
const showData = computed(() => {
    return !!data.value?.fieldGroups?.length;
});

const fieldsData = fields => {
    if (!fields || (fields && !fields.length)) return [];
    return fields.filter(field => {
        if (FORM_CONTROL_SPECIAL_TYPE.includes(field?.fieldMeta?.dataType)) {
            return Array.isArray(field.rawValue) ? field.rawValue.length : field.rawValue;
        }
        return field.showText;
    });
};

const subGroupsData = subG => {
    return subG.filter(sub => fieldsData(sub.fields).length);
};

const fieldGroupsData = () => {
    return data.value?.fieldGroups?.filter(filedG => subGroupsData(filedG.subGroups).length) || [];
};

const hidesubGName = (sub, subG) => {
    return (sub.name === i18n.global.t('meos_control_web.others') && subGroupsData(subG).length === 1) || !sub.name;
};

const changeCollapseExpand = column => {
    column.isOpen = !column.isOpen;
};

const download = obj => {
    const { name, url } = obj;

    console.log('TODO 下载', url);
    // downloadResource(url, name);
};

const fullSpaceName = rawValue => {
    let fullSpaceName = '';
    if (data.value.objType === 'space') {
        if (rawValue?.building?.localName) {
            fullSpaceName = rawValue.building.localName;
        }
    } else if (data.value.objType === 'equipment') {
        if (rawValue?.building?.localName) {
            fullSpaceName = rawValue.building.localName;
        }
        if (rawValue?.space?.localName) {
            fullSpaceName += `-${rawValue.space.localName}`;
        }
    }

    return fullSpaceName;
};

const loading = ref(true);

watch(
    () => props.id,
    () => {
        loading.value = true;
        let Mloading = null;
        Mloading = MLoading.service({
            target: `.instance-basic-info-scrollbar`,
            fullscreen: false,
            duration: 100,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        getBaseInfo(props.id)
            .then(res => {
                data.value = res;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                loading.value = false;
                Mloading?.destroy();
            });
    },
    {
        immediate: true
    }
);

onMounted(() => {});
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

.plate {
    background-color: #fff;
    margin-bottom: 28px;

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
        padding-left: 8px;
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
        padding-left: 8px;

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
        margin-top: 10px;
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
