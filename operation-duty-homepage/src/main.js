import { createApp } from 'vue';
import meri from 'meri-plus';
import 'meri-plus/theme/index.css';

import '@/styles/index.less';
import pinia from './store/index';
import App from './App.vue';
const app = createApp(App);
app.use(pinia);
app.use(meri).mount('#app');
