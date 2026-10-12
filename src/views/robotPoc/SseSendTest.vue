<template>
    <div class="sse-send-test-warp">
        <m-input v-model="txt" :type="'textarea'" width="300px" :autosize="{ minRows: 5 }" :placeholder="i18n.global.t('common.placeholder_input')"> </m-input>
        <div style="margin: 20px 0">
            <m-button @click="sendMsg">{{ i18n.global.t('meos_control_web.send') }}</m-button>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
const txt = ref('');
const emit = defineEmits(['send']);

const sendMsg = () => {
    emit('send', {
        data: JSON.parse(txt.value)
    });
};
</script>
<style lang="less">
.sse-send-test-warp {
    margin: 20px 0;
    position: fixed;
    top: 50px;
    left: 100px;
    min-height: 50px;
    height: auto;
    background-color: #fff;
    border: 8px;
    padding: 20px;
    z-index: 9999999;
}
</style>
