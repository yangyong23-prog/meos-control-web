// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import { listSpaceWithStatus } from '@/apis/lightingControl';
import { showAbnormalStateKey, loadingSpaceDataKey, currentSpaceDataKey, templateTypeKey, templateNameKey } from '../constant/symbols';
import { MBadge } from 'meri-plus';
import { h } from 'vue';

const defaultStateTabItems = [
    {
        id: 'runStatus',
        name: i18n.global.t('common.operation')
    },
    {
        id: 'abnormalStatus',
        name: i18n.global.t('meos_control_web.abnormal')
    }
];

const defaultViewTabItems = [
    {
        id: 'model',
        name: i18n.global.t('meos_control_web.model')
    },
    {
        id: 'list',
        name: i18n.global.t('meos_control_web.list')
    }
];

export default function () {
    // 切换左侧 menu tab的信息
    const templateType = inject('templateType');
    const templateName = inject('templateName');

    // 当前 menu tab 加载的模型数据
    const currentSpaceData = inject(currentSpaceDataKey);
    const loadingSpaceData = inject(loadingSpaceDataKey);

    // 切换顶部 tab 的信息
    const stateList = ref(defaultStateTabItems);
    const viewList = ref(defaultViewTabItems);
    const currentState = ref('runStatus');
    const currentView = ref('model');

    // 是否展示异常 badge 小红点
    const showAbnormalState = inject(showAbnormalStateKey);
    // provide(showAbnormalStateKey, showAbnormalState);

    const getListSpaceWithStatus = () => {
        if (loadingSpaceData) {
            loadingSpaceData.value = true;
        }
        listSpaceWithStatus({
            projectId: baseStore().projectId,
            templateType: templateType?.value,
            instanceType: 'PROJECT',
            instanceId: baseStore().projectId
        })
            .then(res => {
                const { result, data } = res || {};
                if (result !== 'success') return;
                if (currentSpaceData) {
                    currentSpaceData.value = [...(data || [])];
                }
            })
            .finally(() => {
                if (loadingSpaceData) {
                    loadingSpaceData.value = false;
                }
            });
    };

    // XXX:测试异常展示
    onMounted(() => {
        // setTimeout(() => {
        //     showAbnormalState.value = true;
        // }, 500);
    });

    watch(showAbnormalState, showBadge => {
        if (showBadge) {
            stateList.value = defaultStateTabItems.map(v => {
                if (v.id === 'abnormalStatus') {
                    return {
                        ...v,
                        renderSlot: {
                            component: h(MBadge, { type: 'dot', show: true }),
                            style: {
                                position: 'absolute',
                                top: '-0.369px',
                                right: '-7.632px'
                            }
                        }
                    };
                }
                return v;
            });
        } else {
            stateList.value = defaultStateTabItems;
        }
    });

    watch(
        () => templateType?.value,
        cur => {
            if (cur) {
                // TODO：待接口更改调整
                if (['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(cur)) {
                    getListSpaceWithStatus();
                }
            }
        },
        {
            immediate: true
        }
    );

    return {
        templateName,
        stateList,
        viewList,
        currentState,
        currentView
    };
}
