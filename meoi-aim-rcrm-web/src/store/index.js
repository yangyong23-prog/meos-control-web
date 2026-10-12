import { createPinia } from 'pinia';
import useMainStore from './modules/main';
import chartDataStore from './modules/main/chartDataStore';
import adjustDataStore from './modules/main/adjustDataStore';
const pinia = createPinia();

export { useMainStore, chartDataStore, adjustDataStore };

export default pinia;
