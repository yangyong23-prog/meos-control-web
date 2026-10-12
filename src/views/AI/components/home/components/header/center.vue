<template>
    <div class="AI-header-center">
        <div v-if="state == 0" class="header-center-next">
            <DoubleStartSvg></DoubleStartSvg>
            <span class="header-start-text">
                {{ i18n.global.t('meos_control_web.next_compute_start_time', { nextStartTime: nextStartTime }) }}
                <span class="header-pot">{{ pot }}</span>
            </span>
        </div>
        <div v-if="state == 1" class="header-center-top">{{ i18n.global.t('meos_control_web.fetching') }}{{ data.doing }}</div>
        <div v-if="state == 1" class="header-center-center">
            <DoubleStartSvg></DoubleStartSvg>
            <AiTypingEffect style="width: 480px" class="header-start-text"></AiTypingEffect>
        </div>
        <div v-if="state == 1" class="header-center-bottom">
            {{
                data.next
                    ? i18n.global.t('meos_control_web.about_to_acquire_item', {
                          item: data.next
                      })
                    : i18n.global.t('meos_control_web.strategy_calculation_imminent')
            }}
        </div>
        <div v-if="state == 2" class="header-center-next">
            <DoubleStartSvg></DoubleStartSvg>
            <span class="header-start-text">
                {{ i18n.global.t('meos_control_web.strategy_calculation_imminent') }}
                <span class="header-pot">{{ pot }}</span>
            </span>
        </div>
        <div v-if="state == 3" class="header-center-next">
            <DoubleStartSvg></DoubleStartSvg>
            <span class="header-start-text"
                >{{ i18n.global.t('meos_control_web.strategy_calculation_in_progress') }}
                <span class="header-pot">{{ pot }}</span>
            </span>
        </div>
        <div v-if="state == 0 || state == 2 || state == 3" class="english-txt">Powered&nbsp;by&nbsp;HGTFT</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DoubleStartSvg from './doubleStar.vue';
import AiTypingEffect from './AiTypingEffect.vue';
import { headerCenterStateKey } from '../../../../injectionKey';
import { strategyOverviewKey, nextStartTimeKey } from '../../../../hooks/useStaticData';
import dayjs from 'dayjs';

const strategy = inject(strategyOverviewKey);
const state = inject(headerCenterStateKey);
const data = inject('headerCenterData');
const systemNextStartTime = inject(nextStartTimeKey);
const pot = ref('');

const nextStartTime = computed(() => {
    if (!systemNextStartTime?.value) {
        return '--';
    }
    const time = dayjs(systemNextStartTime.value, 'YYYY-MM-DD HH:mm:ss', true);
    return time.format('HH:mm');
});

let timer = null;

onMounted(() => {
    timer = setInterval(() => {
        if (pot.value.length < 3) {
            pot.value += '.';
        } else {
            pot.value = '';
        }
    }, 800);
});

onUnmounted(() => {
    clearInterval(timer);
    timer = null;
});
</script>

<style lang="less" scoped>
.AI-header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    .header-center-top {
        color: var(--Grey-Grey-0, #fff);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
    }
    .header-center-center {
        display: flex;
        align-items: center;
        color: #3ef;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
        margin: 5px 0px;
    }
    .header-center-bottom {
        color: var(--Grey-Grey-0, #fff);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
    }
    .header-center-next {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 137.5% */
    }
    .header-start-text {
        margin-left: 4px;
        position: relative;
        .header-pot {
            position: absolute;
        }
    }
    .english-txt {
        opacity: 0.8;
        position: absolute;
        top: 76px;
        height: 24px;
        color: #fff;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 171.429% */
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
