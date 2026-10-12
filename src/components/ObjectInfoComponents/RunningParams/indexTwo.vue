<template>
    <div class="operation-monitoring-running-params">
        <template v-for="item in firstSix" :key="item.infoCode">
            <ValueName
                :id="selectObj.id"
                :name="item.infoCodeName + '：'"
                :value="value(item.infoCode, item.infoCodeType).text"
                :info-code="item.infoCode"
                type="horizontal"
                layout="name-value"
                :is-link="value(item.infoCode, item.infoCodeType).infoCodeType === IOT_RUNNING"
                :time="value(item.infoCode, item.infoCodeType).time"
            />
        </template>
        <template v-if="others.length > 0">
            <template v-if="isOpen">
                <template v-for="item in others" :key="item.infoCode">
                    <ValueName
                        :id="selectObj.id"
                        :name="item.infoCodeName + '：'"
                        :info-code="item.infoCode"
                        :value="value(item.infoCode, item.infoCodeType).text"
                        type="horizontal"
                        layout="name-value"
                        :is-link="value(item.infoCode, item.infoCodeType).infoCodeType === IOT_RUNNING"
                        :time="value(item.infoCode, item.infoCodeType).time"
                    />
                </template>
            </template>
            <div>
                <span class="open-more" @click="openHandle">
                    {{ isOpen ? i18n.global.t('meos_control_web.collapse_more') : i18n.global.t('meos_control_web.expand_more') }}
                    <IconMeriComponentChevronUp v-if="isOpen" :size="16"></IconMeriComponentChevronUp>
                    <IconMeriComponentChevronDown v-else :size="16"></IconMeriComponentChevronDown>
                </span>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ValueName from '../../common/ValueName.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmptyNoReturn } from '@/utils/tools';
import { getValueStr } from '@/utils/viewUtils';
import { isEmpty } from 'lodash';
import IconMeriComponentChevronDown from '@/assets/svg/arrow.down.svg';
import IconMeriComponentChevronUp from '@/assets/svg/arrow.up.svg';
import emitter from '@/utils/bus';
import { uuid } from 'yushu-js-utils';
import { isIotInfoType } from '@/utils/infoTemplate';
import { IOT_RUNNING } from '@/utils/globalVariables';

const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {};
        }
    },
    selectObj: {
        type: Object,
        default: () => {
            return {};
        }
    },
    stratification: {
        type: Boolean,
        default: true
    }
});
const { getIotData, getCustomInfo } = DockSingleton.getInstance();

const isOpen = ref(false);

const uuId = ref(uuid(10));

const infoCodes = computed(() => {
    const arr = [...(props.data.relInfoCodeConfigs || [])];
    if (props.data.groupChildren?.length) {
        props.data.groupChildren?.forEach(item => {
            arr.push(...(item.relInfoCodeConfigs || []));
        });
    }
    return arr;
});

const firstSix = computed(() => {
    return infoCodes.value.filter((item, index) => {
        return index < 6;
    });
});

const others = computed(() => {
    if (infoCodes.value.length < 7) return [];
    return infoCodes.value.filter((item, index) => {
        return index > 5;
    });
});

const value = (infoCode, infoCodeType) => {
    let data = {};
    if (isIotInfoType(infoCodeType)) {
        data = getIotData(props.selectObj.id, infoCode);
    } else {
        data = getCustomInfo(props.selectObj.id, infoCodeType, infoCode);
    }

    return { text: getValueStr(data).text, isEmpty: isEmptyNoReturn(data.dataValue), time: data.dataTime, infoCodeType: data.infoCodeType };
};

const openHandle = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        emitter.emit('running-params-open', uuId.value);
    }
};

const close = id => {
    if (uuId.value !== id && isOpen.value) {
        isOpen.value = false;
    }
};

emitter.on('running-params-open', id => {
    close(id);
});

onUnmounted(() => {
    emitter.off('running-params-open');
});
</script>
<style lang="less" scoped>
.operation-monitoring-running-params {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 4px;
    margin-top: 8px;
    :deep(.value-name) {
        color: var(--gray-600);
        width: auto;
        min-width: calc(50% - 4px);
        .value-name-title {
            overflow: inherit !important;
        }
    }
    .open-more {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        color: var(--blue-500, #246fe5);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        padding: 2px;
        &:hover {
            border-radius: 2px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
</style>
