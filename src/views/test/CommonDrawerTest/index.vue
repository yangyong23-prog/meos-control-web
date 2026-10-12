<template>
    <div style="padding: 50px">
        测试commonDrawer
        <br />
        <m-button @click="openDrawer">打开抽屉</m-button>
        <br />
        <m-button @click="toogleHideTwo">测试隐藏子组件</m-button>
        <CommonDrawer v-model="showDrawer" :select-obj="da" :running-monitor-type="RUNING_MONITOR_TYPEM">
            <DrawerPane><SpaceDetailForSpaceSecurity :select-obj="da" :running-monitor-type="RUNING_MONITOR_TYPEM"></SpaceDetailForSpaceSecurity></DrawerPane>
            <!-- <DrawerPane label="two" name="2">two</DrawerPane>
            <DrawerPane label="three" name="3">three</DrawerPane> -->
        </CommonDrawer>
    </div>
</template>
<script setup>
import CommonDrawer from '@/components/common/CommonDrawer/index.vue';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import SpaceDetailForSpaceSecurity from '@/views/Common/SpaceDetailForSpaceSecurity/index.vue';

import { RUNING_MONITOR_TYPEM } from '../../SpaceSecurityControl/constants/index';

const da = ref({
    id: 'Sp61011220101dd14cd30c4c4c6195ac92ea7a97f615',
    name: 'F1_中庭（北）',
    localId: 'ACATFC-F2-1075',
    localName: 'F1_中庭（北）',
    objType: 'space',
    classCode: '',
    floorId: 'Fl61011220107ca564431e4e4b6c8b1dfb9b2740d88a',
    bimLocation: '62049.53,119527.38500000001,3000.0',
    floorLocalName: 'F1',
    spaceId: 'Sp61011220101dd14cd30c4c4c6195ac92ea7a97f615',
    type: 'space'
});

const showDrawer = ref(true);

const openDrawer = () => {
    console.log('openDrawer');
    showDrawer.value = true;
    // const drawer = ref()
    // drawer.value.open()
};

const hideTwo = ref(false);

const toogleHideTwo = () => {
    hideTwo.value = !hideTwo.value;
};
</script>
