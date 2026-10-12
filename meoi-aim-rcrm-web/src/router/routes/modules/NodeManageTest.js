import TestAnchorOffset from '@/views/test/TestAnchorOffset';
import langTest from '@/views/test/langTest.vue'

const TestRoute = [
    {
        path: '/test/anchor/offset',
        component: TestAnchorOffset,
        children: [] // 可定义子路由
    },
    {
        path: '/test/lang',
        component: langTest,
        children: [] // 可定义子路由
    }
];

export default TestRoute;
