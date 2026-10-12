import { getMenuConfig } from '@/apis/monitor';
import { MLoading } from 'meri-plus';

export default () => {
    const loading = ref(false);
    const loadingMeta = {
        loadingOptions: {
            target: '.home-content-bg-wrap .card-content-wrap',
            fullscreen: false,
            lottieName: 'ball',
            background: 'rgba(1,1,1,0)',
            duration: 30,
            loadIconStyle: {
                width: '100px',
                height: '100px',
                transform: 'translateY(-100px)'
            },
            loadButton: () => location.reload()
        },
        loadingInstance: {},
        showLoading() {
            loadingMeta.loadingInstance = MLoading.service(this.loadingOptions);
        },
        closeLoading() {
            loadingMeta.loadingInstance.destroy();
        }
    };
    const moduleList = ref([]);

    const queryModuleData = async () => {
        moduleList.value = [];
        loadingMeta.showLoading();
        loading.value = true;
        try {
            let data = await getMenuConfig();
            if (data.code === '00000') {
                data?.data?.forEach(res => {
                    res.label = res.localName ?? '--';
                });
                moduleList.value = data?.data || [];
            }
        } finally {
            loadingMeta.closeLoading();
            loading.value = false;
        }
    };
    return { loading, moduleList, queryModuleData };
};
