<template>
    <ModalContent v-if="modalVisible" v-model="modalVisible"></ModalContent>
    <div class="manual-intervention">
        <div class="header fcb">
            <div>{{ i18n.global.t('meos_control_web.manual_intervention1') }}</div>
            <m-button type="link" size="small" @click="modalVisible = true">{{ i18n.global.t('meos_control_web.add_intervention') }}</m-button>
        </div>
        <div v-if="arrList?.length">
            <div v-for="(item, index) in arrList" :key="index">
                <div :class="['manual-intervention-item', 'mt16', 'name' + index]">
                    <div class="fb">
                        <div class="fc">
                            <div>
                                <div class="fb7 f16">17:00</div>
                                <div class="ft1 fbold mt4">2024.03.22</div>
                            </div>
                            <div class="ml16 mr16 transverse-line">
                                <span></span>
                            </div>
                            <div>
                                <div class="fb7 f16">17:00</div>
                                <div class="ft1 fbold mt4">2024.03.22</div>
                            </div>
                        </div>
                        <div class="fc f14" style="height: 32px">
                            <m-button type="link" size="small">{{ i18n.global.t('common.edit') }}</m-button>
                            <div class="get-line ml4 mr4"></div>
                            <m-button type="link" size="small">{{ i18n.global.t('meos_control_web.release_intervention') }}</m-button>
                        </div>
                    </div>
                    <div class="mt8">
                        <m-tag color="#1B2129" bg-color="#E8ECF0" size="small"> {{ i18n.global.t('meos_control_web.accord_name_interrupt', { name: '禹数大楼' }) }} </m-tag>
                    </div>
                    <div>
                        <div class="fc numerical-value mt8">
                            <div class="numerical-value-item">
                                <div class="ft1 fbold">{{ i18n.global.t('meos_control_web.turn_on_ac_or_not') }}</div>
                                <div class="fb7 f16 mt8">{{ i18n.global.t('meos_control_web.yes') }}</div>
                            </div>
                            <div class="numerical-value-item">
                                <div class="ft1 fbold">{{ i18n.global.t('meos_control_web.hvac_temperature_setpoint') }}</div>
                                <div class="fb7 f16 mt8">22℃</div>
                            </div>
                            <div class="numerical-value-item">
                                <div class="ft1 fbold">{{ i18n.global.t('meos_control_web.co2_concentration_setpoint') }}</div>
                                <div class="fb7 f16 mt8">30ppm</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt8 f14">
                        <span :class="[item.reasonShow ? 'ellipsis' : '', 'ft1', 'reason']">{{
                            i18n.global.t('meos_control_web.reason_intervention_due_to_ambient_temperature_and_weather_changes')
                        }}</span>
                        <m-button type="link" size="small" @click="reasonBtn(item)">{{
                            item.reasonShow ? i18n.global.t('meos_control_web.expand') : i18n.global.t('meos_control_web.collapse')
                        }}</m-button>
                    </div>
                </div>
                <m-button v-if="index == 0 && state.arr.length > 1" type="link" size="small" :class="[!state.show ? 'mb4' : '', 'mt4']" @click="unpack">{{
                    state.show ? i18n.global.t('meos_control_web.expand_other_interventions') : i18n.global.t('meos_control_web.collapse_other_interventions')
                }}</m-button>
            </div>
        </div>
        <div v-else class="empty ft1 fcc mt12">{{ i18n.global.t('meos_control_web.no_manual_intervention') }}</div>
    </div>
</template>
<script lang="ts" setup>
import ModalContent from './modalContent/index.vue';

const modalVisible = ref(false);

const state = reactive({
    show: true,
    reasonShow: true,
    arr: [{ name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }, { name: '5' }]
});
const unpack = () => {
    state.show = !state.show;
};
const reasonBtn = (item: any) => {
    item.reasonShow = !item.reasonShow;
};
const arrList = computed(() => {
    if (state.show === true && state.arr?.length) {
        state.arr.map((item: any) => {
            item.reasonShow = true;
        });
        let showList: any = [];
        showList.push(state.arr[0]);
        return showList;
    } else {
        return state.arr || [];
    }
});
console.log(arrList, 'arrList');
</script>
<style lang="less" scoped>
.manual-intervention {
    padding-right: 20px;
    .header {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
    }
    &-item {
        padding: 12px;
        border-radius: 4px;
        border: 1px solid var(--yellow-100, #fcf8b8);
        background: var(--orange-50, #fffbe6);
    }
    .numerical-value {
        width: 100%;
        &-item {
            width: 33%;
        }
    }
    .get-line {
        width: 1px;
        height: 17px;
        background: #d9d9d9;
    }
    .transverse-line {
        span {
            display: inline-block;
            width: 10px;
            height: 1px;
            background-color: #000;
        }
    }
    .reason {
        line-height: 25px;
    }
    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
}
.name1 {
    margin-top: 0;
}
.empty {
    width: 100%;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    height: 66px;
}
</style>
