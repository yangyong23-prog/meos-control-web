// @ts-ignore
import i18n from '@/localization';
import { PropType } from 'vue';
export interface ListItem {
    id: any;
    name: string;
    type?: string;
}
export const TagSelectProps = {
    modelValue: {
        type: Array as PropType<ListItem[]>,
        required: true,
        default: () => []
    },
    searchValue: {
        type: String as PropType<string>
    },
    clearable: {
        type: Boolean as PropType<boolean>,
        default: true
    },
    options: {
        type: Array as PropType<ListItem[]>,
        default: () => []
    },
    width: {
        type: String as PropType<string>,
        default: '240px'
    },
    disabled: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    placeholder: {
        type: String as PropType<string>,
        default: i18n.global.t('meos_control_web.please_select')
    },
    optionTypeTab: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    tabDataAndOptions: {
        type: Object as PropType<{ id: string; name: string; disabled: boolean; renderSlot: any; options: ListItem[] }[]>,
        default: () => ({ options: [] })
    },
    tabAttrs: {
        type: Object as PropType<any>,
        default: () => ({})
    },
    maxHeight: {
        type: String as PropType<string>,
        default: '300px'
    }
};
