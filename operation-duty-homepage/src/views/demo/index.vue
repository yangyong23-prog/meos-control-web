<template>
    <div class="demo">
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_hide_the_component') }}</h1>
        <div id="hidden" class="hidden fs16">
            <IntersectionObserverBox style="border: 1px solid; width: 1280px" target="#hidden"> 1231254897132568689846531 </IntersectionObserverBox>
        </div>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_fence_layout') }}</h1>
        <GridLayout class="row" :gutter="8">
            <GridLayoutItem class="col" style="background-color: #3fbe72" :span="2"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #3fbe72" :span="2"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #3fbe72" :span="2"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #3fbe72" :span="2"> </GridLayoutItem>
        </GridLayout>
        <br />
        <GridLayout class="row" :gutter="12">
            <GridLayoutItem class="col" style="background-color: #6a9107" :span="3"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #6a9107" :span="3"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #6a9107" :span="6"> </GridLayoutItem>
        </GridLayout>
        <br />
        <GridLayout class="row" :gutter="12">
            <GridLayoutItem class="col" style="background-color: #13753f" :span="6"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #13753f" :span="6"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #13753f" :span="12"> </GridLayoutItem>
        </GridLayout>
        <br />
        <GridLayout class="row" :gutter="12">
            <GridLayoutItem class="col" style="background-color: #215dd9" :span="12"> </GridLayoutItem>
            <GridLayoutItem class="col" style="background-color: #215dd9" :span="12"> </GridLayoutItem>
        </GridLayout>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_box_container') }}</h1>
        <div class="bc" style="height: 60px"></div>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_title') }}</h1>
        <div class="bc" style="min-height: 60px">
            <Title size="L" path="/AC">{{ i18n.global.t('common.meos_home_ventilation') }}</Title>
            <Title size="L">{{ i18n.global.t('common.heating_cooling_source_system') }}</Title>
            <Title>{{ i18n.global.t('operation_duty_homepage.meos_home_computer_room_logistics') }}</Title>
            <Title path="/ac-operation-control">{{ i18n.global.t('operation_duty_homepage.meos_home_the_bathroom') }}</Title>
        </div>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_pie_chart') }}</h1>
        <div class="bc fc" style="min-height: 60px">
            <div style="width: 40px; height: 40px">
                <Pie :data="{ value: 20, total: 80 }" />
            </div>
            <div style="width: 40px; height: 40px">
                <Pie color="red" :data="{ value: 40, total: 80 }" />
            </div>
            <div style="width: 40px; height: 40px">
                <Pie :data="{ value: 0, total: 80 }" />
            </div>
            <div style="width: 40px; height: 40px">
                <Pie />
            </div>
        </div>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_pie_chart') }}</h1>
        <div class="bc fc" style="min-height: 60px">
            <StateTag state="error" :number="8" />
            <StateTag state="warn" :number="8" />
            <StateTag state="offline" :number="8" />
        </div>
        <h1>{{ i18n.global.t('operation_duty_homepage.meos_home_number_of_runs') }}</h1>
        <div class="bc fc" style="min-height: 60px">
            <RunNumber :value="38" :total="100" />&nbsp;&nbsp;&nbsp; <RunNumber :value="0" :total="100" />&nbsp;&nbsp;&nbsp;
            <RunNumber />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';
import Title from '@/components/Title.vue';
import Pie from '@/components/echarts/Pie.vue';
import StateTag from '@/components/StateTag.vue';
import RunNumber from '@/components/RunNumber.vue';
</script>
<style lang="less" scoped>
.demo {
    padding: 10px;
}
:deep(.col) {
    height: 30px;
}
.hidden {
    height: 60px;
    padding: 20px;
    padding-left: 200px;
    overflow: hidden;
}
</style>
