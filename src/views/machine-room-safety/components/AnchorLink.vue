<template>
    <nav class="anchor-link-nav">
        <slot name="links">
            <!-- 使用v-for循环生成锚点链接 -->
            <div>
                <a v-for="(link, index) in links" :key="index" :href="link.href" :class="['anchor-item']">
                    <span>{{ link.text }}</span>
                </a>
            </div>
        </slot>
    </nav>
</template>

<script setup>
import i18n from '@/localization';
const links = ref([{ href: '#default-anchor', text: i18n.global.t('meos_control_web.default_anchor_link') }]);
</script>

<style lang="less" scoped></style>
