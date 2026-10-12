import { createPinia } from 'pinia';
import useMainStore from './modules/main';

const pinia = createPinia();

export { useMainStore };

export default pinia;
