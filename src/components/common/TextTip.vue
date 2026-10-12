<template>
    <m-tips :content="props.text" trigger="hover" :disabled="disabled" theme="dark">
        <div ref="textRef" class="text">{{ props.text }}</div>
    </m-tips>
</template>
<script setup>
const props = defineProps({
    text: {
        type: String,
        default: ''
    }
});

const textRef = ref(null);
const disabled = ref(false);

onMounted(() => {
    const element = textRef.value;
    const isTextOverflown = element.scrollWidth > element.clientWidth;
    if (isTextOverflown) {
        disabled.value = false;
    } else {
        disabled.value = true;
    }
});
</script>
<style lang="less" scoped>
.text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
