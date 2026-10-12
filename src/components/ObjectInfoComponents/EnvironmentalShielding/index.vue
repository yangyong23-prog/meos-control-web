<template>
    <m-select
        v-model="selectValue"
        :options="list"
        multiple
        has-confirm
        has-check-all
        :disabled="disabledSelect"
        :popover-attrs="{
            onShow: open
        }"
        @confirm="confirm"
    >
        <template #trigger>
            <SetButton type="link">
                <template #default="{ disabled }">
                    {{ setDisabledSelect(disabled) }}
                    {{ i18n.global.t('meos_control_web.environmental_shielding') }}
                </template>
            </SetButton>
        </template>
    </m-select>
</template>

<script setup lang="ts">
import { useGeneralControl } from '@/hooks/useGeneralControl';
import i18n from '@/localization';
import { GroupChildConfig, InfoCodeConfig } from '@/types/InfoCodeConfig';
import { IS_SHIELD, NO_SHIELD, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import SetButton from '@/components/common/SetButton.vue';
import DockSingleton from '@/hooks/responsiveDock';
const { getIotData } = DockSingleton.getInstance();
const { batchAutoCommandSendBySingleObjectFn } = useGeneralControl();
const props = defineProps({
    groupChildren: {
        type: Array as () => Array<GroupChildConfig>,
        default: () => []
    },
    selectObj: {
        type: Object as () => { id: string },
        default: () => ({})
    }
});
interface ListOption extends InfoCodeConfig {
    id: string;
    name: string;
}

const parseShowStyle = (showStyle?: string): { relSet?: string } => {
    if (!showStyle) {
        return {};
    }

    try {
        return JSON.parse(showStyle);
    } catch (error) {
        console.error('showStyle parse error', error);
        return {};
    }
};

const selectValue = ref<string[]>([]);
const list = computed<ListOption[]>(() => {
    const relInfoCodeConfigs: ListOption[] = [];
    const relSetIdSet = new Set<string>();
    props.groupChildren.forEach(item => {
        item.relInfoCodeConfigs.forEach(config => {
            const relSetId = parseShowStyle(config.showStyle).relSet;
            if (relSetId && !relSetIdSet.has(relSetId)) {
                relSetIdSet.add(relSetId);
                relInfoCodeConfigs.push({
                    ...config,
                    id: relSetId,
                    name: config.infoCodeName
                });
            }
        });
    });
    return relInfoCodeConfigs;
});
const confirm = (data: string[]) => {
    const selectedSet = new Set(data);
    batchAutoCommandSendBySingleObjectFn({
        data: {
            objectId: props.selectObj.id,
            commandParams: list.value.map(item => ({
                infoCode: item.id,
                infoValue: selectedSet.has(item.id) ? IS_SHIELD : NO_SHIELD
            }))
        },
        callback: (res: { code: string }) => {
            if (res.code === SUCCESSCODE) {
                useSuccessMessage();
            }
        }
    });
};
const disabledSelect = ref(false);
const setDisabledSelect = (disabled: boolean) => {
    disabledSelect.value = disabled;
    return '';
};
const open = () => {
    const selectedIds = list.value.filter(item => getIotData(props.selectObj.id, item.id)?.dataValue === IS_SHIELD).map(item => item.id);

    selectValue.value = [...new Set(selectedIds)];
};
</script>

<style scoped lang="less">
.component {
    /* styles */
}
</style>
