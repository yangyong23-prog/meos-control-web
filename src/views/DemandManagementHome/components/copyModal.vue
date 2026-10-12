<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        modal-class-name="copy-tempalte-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.copy_template')"
        :need-scrollbar="false"
        :width="600"
        :height="368"
        :z-index="10"
        :max-height="642"
        :escable="false"
        @close="closeModal"
    >
        <template #content>
            <m-scrollbar bar-x-size="0px" bar-x-hover-size="0px" class="content-wrap">
                <div class="desc-copy">
                    <IconMeriComponentNotificationWarning :size="18"> </IconMeriComponentNotificationWarning>
                    <span>{{ i18n.global.t('meos_control_web.copy_template_by_one_key') }}</span>
                </div>
                <div v-if="templateList?.length === 0" class="no-data-box">
                    <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
                </div>
                <m-radio-group v-else v-model="value">
                    <div class="list">
                        <m-radio v-for="item in templateList" :key="item.value" :class="value === item.value ? 'check-item' : ''" :label="item.value">
                            {{ item.label }}
                        </m-radio>
                    </div>
                </m-radio-group>
            </m-scrollbar>
        </template>
        <template #footer>
            <div class="footer-btn-group">
                <div class="btns">
                    <m-button type="default" :disabled="submitLoading" @click.stop="closeModal">
                        {{ i18n.global.t('common.cancel') }}
                    </m-button>
                    <m-button type="primary" :loading="submitLoading" @click="confirm">
                        {{ i18n.global.t('common.confirm') }}
                    </m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentNotificationWarning } from 'meri-icon';
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import Empty from '@/components/common/Empty.vue';
import { templateIdInjectKey } from '../constant/injectKey';
import { copyTemplate } from '@/apis/DemandManagementHome';

const props = defineProps({
    templateList: {
        type: Array,
        default() {
            return [];
        }
    }
});

const emits = defineEmits(['close', 'after-submit']);
const showModal = ref(false);
const submitLoading = ref(false);
const value = ref('');
const templateId = inject(templateIdInjectKey);

onMounted(() => {
    showModal.value = true;
});

const closeModal = () => {
    submitLoading.value = false;
    showModal.value = false;
    nextTick(() => {
        emits('close');
    });
};

const confirm = () => {
    if (!value.value) {
        return $Message.error(i18n.global.t('meos_control_web.not_yet_selected'));
    }
    // 模拟请求
    submitLoading.value = true;
    copyTemplate({
        fromTemplateId: value.value,
        toTemplateId: templateId.value
    })
        .then(res => {
            if (res.result === 'success') {
                $Message.success('复制成功');
                emits('after-submit', value.value);
                emitter.emit('queryWorkConditionByShellConfigData');
                closeModal();
            }
        })
        .finally(() => {
            submitLoading.value = false;
        });
};
</script>

<style lang="less" scoped>
.copy-tempalte-modal {
    .content-wrap {
        .no-data-box {
            height: 320px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .desc-copy {
            display: flex;
            gap: 8px;
            // justify-content: center;
            align-items: center;
            padding: 12px 24px;
            color: var(--Grey-Grey-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
            background: var(--Palette-Orange-100, #fff0cc);
        }
    }
    .footer-btn-group {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .btns {
            display: flex;
            align-items: center;
        }
    }
}
</style>
<style lang="less">
.copy-tempalte-modal {
    .m-modal-main-content {
        padding: 0px !important;
        .list {
            padding: 12px 24px;
            box-sizing: border-box;
            .m-radio {
                box-sizing: border-box;
                padding: 12px 12px;
                align-items: center;
                width: 100%;
                &:hover {
                    border-radius: 4px;
                    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                }
                .m-radio-label {
                    color: var(--Grey-Grey-900, #1b2129);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;
                }
            }
            .check-item {
                .m-radio-label {
                    color: var(--Palette-Blue-500, #246fe5);
                }
                border-radius: 4px;
                background: var(--Palette-Blue-100, #d9ebff);
                &:hover {
                    background: var(--Palette-Blue-100, #d9ebff);
                }
            }
        }
    }
}
</style>
