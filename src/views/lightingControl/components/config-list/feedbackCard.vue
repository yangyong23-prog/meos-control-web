<template>
    <div class="feedback-card">
        <div class="feedback-card__header">{{ i18n.global.t('meos_control_web.feedback_adjustment') }}</div>
        <div class="feedback-card__content">
            <i18n-slot html-tag="div" name-key="meos_control_web.involves_normal_lighting_loop" class="feedback-card__content_title" :plural="item.lightingCircuitsNum">
                <template #num>
                    <span class="feedback-card__content_title_num">{{ item.lightingCircuitsNum }}</span>
                </template>
            </i18n-slot>
            <div class="feedback-card__content_item">
                {{ i18n.global.t('meos_control_web.auto_open')
                }}<span class="feedback-card__content_item_right"
                    >{{ i18n.global.t('meos_control_web.illuminance_below') }}<span class="grey">{{ item.underOutdoorIlluminance }}</span
                    >{{ i18n.global.t('meos_control_web.lx_duration') }}<span class="grey">{{ item.underDuration }}</span
                    >{{ i18n.global.t('meos_control_web.minute') }}</span
                >
            </div>
            <div class="feedback-card__content_item">
                {{ i18n.global.t('meos_control_web.auto_close')
                }}<span class="feedback-card__content_item_right"
                    >{{ i18n.global.t('meos_control_web.illuminance_above') }}<span class="grey">{{ item.overtopOutdoorIlluminance }}</span
                    >{{ i18n.global.t('meos_control_web.lx_duration') }}<span class="grey">{{ item.overtopDuration }}</span
                    >{{ i18n.global.t('meos_control_web.minute') }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    }
});
</script>

<style lang="less" scoped>
.feedback-card {
    padding: 8px;
    border-radius: 8px;
    background: #f1f4f6;
    &__header {
        color: #1b2129;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        padding: 9px 8px 9px 12px;
    }
    &__content {
        padding: 4px;
        border-radius: 4px;
        background: #fff;
        &_title {
            padding: 0 8px;
            font-size: 12px;
            line-height: 20px;
            color: #626c78;
            &_num {
                font-weight: 700;
                color: #1b2129;
            }
        }
        &_item {
            font-size: 14px;
            line-height: 22px;
            padding: 9px 8px;
            color: #1b2129;
            &_right {
                font-size: 12px;
                margin-left: 12px;
                color: #626c78;
                .grey {
                    color: #1b2129;
                    margin: 0 4px;
                }
            }
        }
    }
}
</style>
