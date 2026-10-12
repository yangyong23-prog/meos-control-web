<template>
    <m-popover placement="bottom" trigger="manually" :is-open="modelValue">
        <template #content>
            <div class="filter-more-panel">
                <div class="filter-more-panel__title">{{ i18n.global.t('meos_control_web.advanced_filter') }}</div>
                <div class="filter-more-panel__item">
                    <label>{{ i18n.global.t('meos_control_web.effective_time_includes') }}</label>
                    <m-date-picker
                        v-model="effectTimeValue"
                        type="datetime"
                        :placeholder="i18n.global.t('meos_control_web.select_effective_time_range')"
                        :time-picker="{
                            format: 'hm'
                        }"
                    ></m-date-picker>
                </div>
                <div class="filter-more-panel__item">
                    <label>{{ i18n.global.t('meos_control_web.belonging_system_colon') }}</label>
                    <m-select v-model="selectedSystemId" :options="systemList"> </m-select>
                </div>
                <div class="filter-more-panel__item target">
                    <label>{{ i18n.global.t('meos_control_web.operation_target_colon') }}</label>
                    <div>
                        <operateTargetSelect v-model="selectedEquipmentList" :system-id="selectedSystemId" :request-data="requestData" :system-class-code="systemClassCode" />
                        <div class="equipment-selected">
                            <m-tag
                                v-for="(selectedItem, index) in selectedEquipmentList"
                                :key="`${selectedItem.objectId}-selected`"
                                has-prefix
                                size="small"
                                color="#1B2129"
                                bg-color="#E8ECF0"
                                @click-prefix="handleTargetDelete(index)"
                            >
                                {{ selectedItem.objectName }}
                            </m-tag>
                        </div>
                    </div>
                </div>
                <div class="filter-more-panel__operate">
                    <m-button class="filter-more-panel__operate_cacel" @click="emits('update:modelValue', !modelValue)">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" class="filter-more-panel__operate_filter" @click="handleMoreFilterChange">{{ i18n.global.t('meos_control_web.filter') }}</m-button>
                </div>
            </div>
        </template>
        <div id="logFilterMore" class="filter-more" @click="emits('update:modelValue', !modelValue)">
            <span class="filter-more__btn">
                <IconMeriActionFilter />
                <span v-if="hasMoreFilter" class="filter-more__btn_dot"></span>
            </span>
        </div>
    </m-popover>
</template>
<script setup lang="ts">
import operateTargetSelect from './operateTargetSelect.vue';
import { querySystemListData } from '@/apis/operationLog';
import { defineProps } from 'vue';
import { IconMeriActionFilter } from 'meri-icon';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps(['modelValue', 'needResetFilter', 'requestData', 'systemClassCode']);

const emits = defineEmits(['handleMoreFilterChange', 'update:modelValue', 'update:needResetFilter']);

// 生效时间
let effectTimeValue = ref('') as any,
    // 所属系统列表
    systemList = ref([]) as any,
    // 当前选中的所属系统id
    selectedSystemId = ref('all'),
    // 当前选中的操作对象列表
    selectedEquipmentList = ref([]) as any,
    // 是否有高级筛选条件
    hasMoreFilter = ref(false);

// 监听是否需要重置筛选条件
watch(
    () => props.needResetFilter,
    (val: boolean) => {
        if (val) {
            effectTimeValue.value = '';
            selectedSystemId.value = 'all';
            selectedEquipmentList.value = [];
            hasMoreFilter.value = false;
            emits('update:needResetFilter', false);
        }
    }
);

// 请求 - 所属系统
querySystemListData({
    criteria: {
        objType: OBJ_TYPE.SYSTEM,
        valid: 1
    }
}).then(({ code, data }) => {
    if (code === '00000') {
        systemList.value = data.map((item: any) => {
            return {
                id: item.id,
                name: item.localName ?? '--'
            };
        });
        systemList.value.unshift({
            id: 'all',
            name: i18n.global.t('common.all')
        });
    } else {
        systemList.value = [];
    }
});

// 事件 - 筛选
const handleMoreFilterChange = () => {
    emits('handleMoreFilterChange', {
        effectTime: effectTimeValue.value,
        systemId: selectedSystemId.value === 'all' ? null : selectedSystemId.value,
        objectIds: selectedEquipmentList.value.map((o: any) => o.objectId)
    });

    hasMoreFilter.value = effectTimeValue.value || selectedSystemId.value || selectedEquipmentList.value.length;

    emits('update:modelValue', !props.modelValue);
};

// 事件 - 操作对象删除
const handleTargetDelete = (index: number) => {
    selectedEquipmentList.value.splice(index, 1);
};
</script>
<style lang="less" scoped>
.filter-more-panel {
    min-width: 380px;
    &__title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .equipment-selected {
            margin-top: 8px;
            max-height: 225px;
            overflow-y: auto;

            .m-tag {
                //margin-bottom: 8px;
                margin: 4px 2px;
            }
        }

        label {
            flex: 0 0 100px;
            margin-right: 12px;
        }

        &_operate {
            svg {
                margin-right: 4px;
            }

            &:hover {
                svg {
                    path {
                        fill: #246fe5;
                    }
                }
            }
        }

        &.target {
            align-items: start;

            label {
                margin-top: 8px;
            }
        }
    }

    &__operate {
        display: flex;
        justify-content: right;

        &_cacel {
            margin-right: 12px;
        }

        &_filter {
            margin-left: 0;
        }
    }
}

.filter-more {
    position: relative;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-right: 6px;

    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }

    &__btn {
        position: relative;
        font-size: 0;

        &_dot {
            position: absolute;
            right: -2px;
            top: -4px;
            width: 9px;
            height: 9px;
            border-radius: 100%;
            background: #246fe5;
            border: 1px solid #fff;
        }
    }
}
</style>
<style lang="less">
.mark-popover {
    width: 140px !important;
}
</style>
