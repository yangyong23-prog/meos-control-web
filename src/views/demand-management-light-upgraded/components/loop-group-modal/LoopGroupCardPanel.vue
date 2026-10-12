<template>
    <div :class="['loop-grouping-panel-container', cardStatus.hover ? 'isHover' : '']" @click="handlePreview" @mouseenter="handleMouse('enter')" @mouseleave="handleMouse('leave')">
        <div class="top">
            <div v-ellipsis class="title m-ellipsis">
                {{ data?.name }}
            </div>
            <div v-ellipsis class="content m-ellipsis">{{ data?.purpose }}</div>
        </div>
        <div class="bottom">
            <I18nSlot html-tag="div" class="left" name-key="meos_control_web.total_num_loop">
                <template #num>
                    <span class="highLight">{{ data?.relObjects?.length ?? 0 }}</span>
                </template>
            </I18nSlot>
            <div v-show="showBtns" class="right">
                <div :class="['icon-container', isSelected('edit') ? 'selected' : '']"><IconMeriActionEditor @click.stop="handleEdit" /></div>

                <m-popconfirm
                    :content="i18n.global.t('meos_control_web.acknowledge_delete_group')"
                    status="danger"
                    :before-confirm="handleBeforeConfirm"
                    :width="'310px'"
                    confirm-button-class="del-btns-group"
                    popover-class="loop-group-card-panel-popover"
                    :confirm-button-text="i18n.global.t('common.delete')"
                    :cancel-button-text="i18n.global.t('common.cancel')"
                    placement="bottom"
                    @show="handleShowTip('show')"
                    @hide="handleShowTip('hide')"
                >
                    <div :class="['icon-container', isSelected('remove') ? 'selected' : '']"><IconMeriActionDelete /></div>
                </m-popconfirm>

                <div :class="['icon-container', isSelected('copy') ? 'selected' : '']"><IconMeriActionCopy @click.stop="handleCopy" /></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import { IconMeriActionEditor, IconMeriActionDelete, IconMeriActionCopy } from 'meri-icon';
import { delScene } from '@/apis/lightingRequirements';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import { changeActiveFuncTypeKey } from '../../hooks/useLoopGroupHook';
import { updateGroupListTimeKey } from '../../hooks/useGlobalData';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    activeFuncType: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(['preview', 'edit', 'remove', 'copy']);

const cardStatus = reactive({
    hover: false,
    edit: false,
    remove: false,
    copy: false
});

const changeActiveFuncType = inject(changeActiveFuncTypeKey, () => {});
const updateGroupListTime = inject(updateGroupListTimeKey);

const showBtns = computed(() => {
    return cardStatus.hover || cardStatus.edit || cardStatus.remove || cardStatus.copy;
});

const isSelected = type => cardStatus[type] === true;

const handlePreview = () => {
    cardStatus.hover = true;
    if (cardStatus.remove) {
        return;
    }
    emits('preview', props?.data);
};

const handleMouse = type => {
    if (type === 'enter') {
        cardStatus.hover = true;
    } else {
        if (cardStatus.remove) {
            return;
        }
        cardStatus.hover = false;
    }
};

const handleEdit = async () => {
    cardStatus.edit = true;
    emits('edit', props?.data, () => {
        cardStatus.edit = false;
    });
};

const handleShowTip = type => {
    if (type === 'show') {
        cardStatus.remove = true;
    } else {
        cardStatus.hover = false;
        cardStatus.remove = false;
    }
};

const handleBeforeConfirm = async done => {
    try {
        const res = await delScene({ id: props?.data?.id });
        if (res?.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('meos_control_web.delete_success'));
            changeActiveFuncType(props.activeFuncType);
            emits('remove', props?.data?.id);
            updateGroupListTime.value = new Date().toISOString();
        }
        done();
    } catch (error) {
        done();
        console.error('删除任务配置失败:', error);
    }
};
// 超过30字符则截断并加省略号
function truncateStr(str) {
    if (typeof str !== 'string') return '';
    return str.length > 30 ? str.slice(0, 30) : str;
}
const handleCopy = async () => {
    cardStatus.copy = true;
    const obj = structuredClone(props.data);
    obj.name = `${props.data.name} - ${i18n.global.t('meos_control_web.copy')}`;
    obj.name = truncateStr(obj.name);
    delete obj.id;
    emits('copy', obj, () => {
        cardStatus.copy = false;
    });
};
</script>

<style lang="less" scoped>
.loop-grouping-panel-container {
    display: flex;
    flex-direction: column;

    border-radius: 4px;
    border: 1px solid var(--gray-300, #e1e5eb);
    background: var(--Grey-Grey-0, #fff);
    cursor: pointer;

    width: 248px;

    .top {
        display: flex;
        padding: 6px 12px;
        flex-direction: column;
        border-bottom: 1px solid rgba(232, 236, 240, 0.7);
    }

    .title {
        max-width: 100%;
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        height: 26px;
    }

    .content {
        max-width: 100%;
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        height: 26px;
    }

    .bottom {
        display: flex;
        height: 32px;
        padding: 0px 12px;
        justify-content: space-between;
        align-items: center;

        background: rgba(247, 249, 250, 0.6);
    }

    .left {
        color: var(--gray-600, #626c78);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .right {
        display: flex;
        align-items: center;
        gap: 8px;

        .icon-container {
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                border-radius: 3px;
            }
        }

        .selected {
            background-color: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            border-radius: 3px;
        }
    }
}

.isHover {
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}

.highLight {
    color: var(--blue-500, #246fe5);
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
}
</style>
<style lang="less">
.loop-group-card-panel-popover {
    .m-popconfirm {
        .m-popconfirm__text {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
        .m-popconfirm__footer .del-btns-group {
            min-width: 64px;
        }
    }
}
</style>
