<template>
    <div class="wh100 homepage">
        <GridLayout :gutter="4">
            <template v-for="item in routes" :key="item.path">
                <GridLayoutItem v-if="item.meta.show" :span="item.meta.span">
                    <div class="view-box">
                        <component :is="item.meta.component" />
                    </div>
                </GridLayoutItem>
            </template>
        </GridLayout>
    </div>
</template>

<script setup>
import GridLayout from '@/components/grid/GridLayout.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
const route = useRouter();
const routes = computed(() => route.getRoutes());
useHomeDataHook();
console.log(routes);
</script>
<style lang="less" scoped>
.view-box {
    height: 300px;
    background: #ffffff;
    box-shadow: 0 0px 10px #ccc;
    border-radius: 12px;
    overflow: hidden;
}
.homepage {
    padding: 20px;
}
.operating-monitori-page-wrap {
    padding: 28px;
    width: 100%;
    background-image: url('../../assets/imgs/operatemonitorbg.png');
    background-size: cover;
    box-sizing: border-box;
    background-position: top center;
    width: 100%;
    height: 100%;
}
.operating-monitori-page {
    box-sizing: border-box;
    width: 100%;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(auto-fill, 300px);
}
</style>
