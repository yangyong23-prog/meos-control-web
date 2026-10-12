<template>
    <div class="equipment-item">
        <div class="equipment-item-title">
            <div class="equipment-title-text fw700 fcb">
                <div>
                    {{ data.localName }}
                </div>
                <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                    <div class="title-icon fc" @click.stop="jumpTo(data.id)">
                        <EquipHoverIcon></EquipHoverIcon>
                    </div>
                </m-tips>
            </div>
            <div class="title-tag">
                <m-tag color="var(--blue-700)" size="small" bg-color="var(--blue-100)">{{ data.inFloor.localName }}</m-tag>
                <templateObjectTags :status-data="equipStatus" :select-obj="{ id: data.id }" :template-type="DETAIL" />
            </div>
        </div>
        <InfoCodeList :id="data.id" :control-list="controlList" :select-obj-id="selectObj.id" forced />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import InfoCodeList from './InfoCodeList.vue';
import templateObjectTags from '@/components/templateObjectTags/index.vue';
import { ENABLE_CTRL } from '../../variables';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import { DETAIL, GROUP_CODE_KEY_MAP } from '@/utils/globalVariables';

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
    }
});
const controlList = ref([]);
const equipStatus = ref({});
const setControlList = () => {
    const arr = [];
    const controlledParameterSet = props.data?.relInfoCodeGroupConfigs?.find(item => item.groupCode === GROUP_CODE_KEY_MAP.controlledParameterSet);
    equipStatus.value = props.data?.relInfoCodeGroupConfigs?.find(item => item.groupCode === GROUP_CODE_KEY_MAP.equipStatus);
    controlledParameterSet?.relInfoCodeConfigs?.forEach(item => {
        const actualInfo = item.relInfoCodeConfigs?.[0] || {};
        item.setInfoCode = item.infoCode;
        item.actualInfoCode = actualInfo.infoCode;
        item.id = props.data.id;
        item.type = ENABLE_CTRL;
    });
    arr.push(...(controlledParameterSet?.relInfoCodeConfigs || []));
    arr.forEach((item, i) => {
        if (arr[i + 1] && arr[i + 1].type === item.type) {
            item.isGroup = true;
        }
    });
    return structuredClone(arr);
};
const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
onMounted(() => {
    controlList.value = setControlList();
});
</script>
<style lang="less" scoped>
.equipment-item {
    border-radius: 8px;
    background-color: var(--gray-50);
    padding-top: 10px;
    border: 1px solid var(--gray-50);
    &:hover {
        border: 1px solid var(--blue-500);
        .title-icon {
            display: flex !important;
        }
    }
    :deep(.control-item) {
        background-color: var(--gray-50);
    }
    & + .equipment-item {
        margin-top: 10px;
    }

    &-title {
        padding-left: 8px;
        margin-bottom: 8px;
        .title-tag {
            margin-top: 8px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            height: 20px;
            gap: 4px;
        }
        .equipment-title-text {
            padding-right: 10px;
            height: 22px;
            .title-icon {
                cursor: pointer;
                border-radius: 2px;
                display: none;
                &:hover {
                    background-color: var(--alpha-30);
                }
            }
        }
    }
}
</style>
