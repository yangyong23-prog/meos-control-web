<template>
    <div
        v-ellipsis
        class="group-name text-hide m-ellipsis"
        :style="{
            fontSize: (data.fontSize || 24) + 'px'
        }"
    >
        {{ data.title }}
    </div>
</template>
<script setup>
defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="scss" scoped>
.group-name {
    line-height: 1;
    margin: 0 2px;
    max-width: 184px;
    padding: 1px 2px;
    border-radius: 1.16px;
    background: #d9ebff;
    user-select: none;
    text-align: center;
    color: '#246fe5';
    font-size: 18px;
}
</style>
