<template>
    <div v-if="allInstances?.length" class="content-wrap">
        <div v-if="allInstances?.length === 1" class="single-title">{{ allInstances?.[0]?.name }}</div>
        <div v-else class="multi-tabs">
            <m-tabs v-model="configData.selected" type="border" size="medium" :data="allInstances" />
        </div>
        <div class="form-item">
            <span class="form-label">{{ allInstances?.[0]?.mpc_app_mode?.label }}</span>
            <div class="form-val">
                <m-select
                    v-model="getCusInstance(configData.selected).mpc_app_mode.value"
                    :value-key="'code'"
                    :options="getCusInstance(configData.selected).mpc_app_mode.options"
                />
            </div>
        </div>
        <div v-if="getCusInstance(configData.selected).mpc_app_mode.value === 'responsive'" class="card-wrap">
            <m-checkbox-group v-model="getCusInstance(configData.selected).mpc_calc_policy.value">
                <div class="checkbox-list">
                    <m-checkbox v-for="item in getCusInstance(configData.selected).mpc_calc_policy.options" :key="item.code" :label="item.code">
                        {{ item.name }}
                    </m-checkbox>
                </div>
            </m-checkbox-group>
        </div>
        <div v-else-if="getCusInstance(configData.selected).mpc_app_mode.value === 'all'" class="card-wrap-extra">
            <div v-for="stage in ['mpc_stage_up', 'mpc_stage_day', 'mpc_stage_down', 'mpc_stage_night']" :key="stage" class="stage-row-wrap">
                <div class="stage-row">
                    <span class="stage-label">{{ getCusInstance(configData.selected)[stage].levelOne.label }}</span>
                    <m-checkbox-group v-model="getCusInstance(configData.selected)[stage].levelOne.value">
                        <div class="checkbox-gap">
                            <m-checkbox v-for="item in getCusInstance(configData.selected)[stage].levelOne.options" :key="item.code" :label="item.code">
                                {{ item.name }}
                            </m-checkbox>
                        </div>
                    </m-checkbox-group>
                </div>
                <template v-if="getCusInstance(configData.selected)[stage].levelOne.value.includes('host')">
                    <div v-if="getCusInstance(configData.selected)[stage].levelTwo.options?.length" class="stage-level-two">
                        <div class="sub-label">{{ getCusInstance(configData.selected)[stage].levelTwo.label }}</div>
                        <m-checkbox-group v-model="getCusInstance(configData.selected)[stage].levelTwo.value">
                            <div class="checkbox-gap">
                                <m-checkbox v-for="item in getCusInstance(configData.selected)[stage].levelTwo.options" :key="item.objectId" :label="item.objectId">
                                    {{ item.objectName }}
                                </m-checkbox>
                            </div>
                        </m-checkbox-group>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
const configData = defineModel({ type: Object, default: () => ({}) });

const allInstances = computed(() => configData.value?.instances || []);
const getCusInstance = id => {
    return configData.value?.instances?.find(item => item.id === id);
};
</script>

<style lang="less" scoped>
.content-wrap {
    padding-left: 30px;
}
.single-title {
    color: #2e3742;

    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 12px;
}
.multi-tabs {
    margin-bottom: 12px;
}

.margin-bottom-16 {
    margin-bottom: 16px;
}

.form-item {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 16px;
}
.form-label {
    color: #000;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    position: relative;
    &::after {
        display: inline-block;
        position: absolute;
        width: 8px;
        right: -12px;
        content: '*';
        color: #f55047;
        font-size: 10px;
    }
}

.checkbox-list {
    display: flex;
    align-items: center;
    gap: 20px;
}

.checkbox-gap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.card-wrap {
    width: fit-content;
    display: flex;
    padding: 8px 16px;
    border-radius: 4px;
    background: #f6f8f9;
    margin-bottom: 16px;
}
.card-wrap-extra {
    display: flex;
    padding: 16px 12px;
    width: 1064px;
    flex-direction: column;
    gap: 12px;

    border-radius: 4px;
    background: #f6f8f9;
    margin-bottom: 16px;

    color: #1a2028;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.stage-row-wrap {
    display: flex;
    flex-direction: column;
}
.stage-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.stage-label {
    width: 220px;
}
.stage-level-two {
    margin-left: 232px;
    display: flex;
    flex-direction: column;
    margin-top: 12px;

    padding: 8px 16px;
    gap: 8px;

    border-radius: 4px;
    background: #eff3f5;
}
.sub-label {
    color: #636d79;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
</style>
