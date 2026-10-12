import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { MMessageBox, $Message } from 'meri-plus';
import { copyCompleteKey, containerBgsPostDataKey } from '@/utils/injectionKey';
import {
    offlineSystemGraph,
    publishSystemGraph,
    editSystemGraph,
    createSystemGraphDuplicate,
    deleteSystemGraphDuplicate
} from '@/api/RelationChartEditor';
// import { LAYOUTSELD_GRAPH_CLASSCODE } from '@/utils/globalVariables';

export default (props, emits) => {
    const copyComplete = inject(copyCompleteKey);
    const showUpdateButton = ref(false);
    const activeTab = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emits('update:modelValue', val);
        }
    });
    const containerBgsPostData = inject(containerBgsPostDataKey);
    const curActiveTabItem = computed(() => props.tabList.find(x => x.id === activeTab.value));
    const scrollPosition = ref('start');

    const publishBtnLoading = ref(false);
    const onChange = val => {
        copyComplete.value = false;
        emits('change', val);
    };

    const offRelationChart = () => {
        MMessageBox({
            title: `确定要下架【${curActiveTabItem.value?.name}】吗？`,
            message: '',
            confirmButtonText: '确定下架',
            cancelButtonText: '取消',
            confirmButtonClass: 'message-box-confirm-button',
            hasLoading: true,
            beforeClose: (action, data, done) => {
                if (action === 'confirm') {
                    offlineSystemGraph(curActiveTabItem.value?.id)
                        .then(() => {
                            $Message.success({ title: '下架成功', showClose: true });
                            curActiveTabItem.value.status = 2;
                        })
                        .finally(() => {
                            done();
                        });
                } else {
                    done();
                }
            }
        });
    };

    const deleteCopyRelationChart = () => {
        MMessageBox({
            type: 'danger',
            title: `确定要删除【${curActiveTabItem.value?.name}】吗？`,
            message: '',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            confirmButtonClass: 'message-box-confirm-button',
            hasLoading: true,
            beforeClose: (action, data, done) => {
                if (action === 'confirm') {
                    deleteSystemGraphDuplicate(curActiveTabItem.value?.id)
                        .then(() => {
                            scrollPosition.value = 'end';
                            $Message.success({ title: '删除成功', showClose: true });

                            setTimeout(() => {
                                const index = props.tabList.findIndex(x => x.id === curActiveTabItem.value?.id);
                                props.tabList.splice(index, 1);
                                const pre = props.tabList[index - 1];
                                activeTab.value = pre?.id;
                                onChange(pre);
                            }, 600);
                        })
                        .finally(() => {
                            done();
                        });
                } else {
                    done();
                }
            }
        });
    };

    const copyLoading = ref(false);

    const createCopyRelationChart = () => {
        if (props.tabList.length > 5) {
            $Message.error({ title: '图纸数量不超过5张，请删减后创建', showClose: true });
            return;
        }
        if (copyLoading.value) return;
        copyLoading.value = true;
        createSystemGraphDuplicate(curActiveTabItem.value?.id)
            .then(res => {
                if (res.result === 'success') {
                    scrollPosition.value = 'end';
                    const { data } = res;
                    data.slotName = 'tabContent';
                    props.tabList.push(data);
                    activeTab.value = data.id;
                    onChange(data);
                } else {
                    scrollPosition.value = 'start';
                    $Message.error({ title: res.message, showClose: true });
                }
            })
            .finally(() => {
                copyLoading.value = false;
            });
    };

    const publishRelationChart = () => {
        try {
            // getChartSizeInfo();

            if (publishBtnLoading.value) return;
            publishBtnLoading.value = true;

            let editedPrams = containerBgsPostData.value ?? [];
            if (props.getChartSizeInfo) {
                console.log('publishRelationChart: ', props.getChartSizeInfo());
                editedPrams = [
                    ...editedPrams,
                    {
                        type: 3,
                        code: 'chartSizeInfo',
                        data: props.getChartSizeInfo()
                    }
                ];
            }
            editSystemGraph(curActiveTabItem.value?.id, editedPrams)
                .then(() => {})
                .finally(() => {
                    publishSystem();
                });
            // if (
            //     curActiveTabItem.value?.graphType === 1 &&
            //     editedPrams?.length > 0 &&
            //     LAYOUTSELD_GRAPH_CLASSCODE.indexOf(curActiveTabItem.value?.classCode) > -1
            // ) {
            // } else {
            //     publishSystem();
            // }
        } catch (err) {
            console.log(err);
            publishBtnLoading.value = false;
        }
    };
    const publishSystem = () => {
        publishSystemGraph(curActiveTabItem.value?.id).then(() => {
            $Message.success({ title: '发布成功', showClose: true });
            props.tabList.forEach(li => {
                // 只会有一个是已发布的
                li.status = 2;
            });
            curActiveTabItem.value.status = 1;
            publishBtnLoading.value = false;
        });
    };
    onMounted(() => {
        // 添加键盘事件监听器
        window.addEventListener('keydown', handleKeyDown);
    });
    onUnmounted(() => {
        // 组件销毁前移除监听器
        window.removeEventListener('keydown', handleKeyDown);
    });

    const handleKeyDown = event => {
        // 检测是否按下了 'g' 键
        if (event.key === 'g') {
            showUpdateButton.value = true; // 显示按钮
            setTimeout(() => {
                showUpdateButton.value = false;
            }, 5000);
        }
    };

    return {
        showUpdateButton,
        activeTab,
        curActiveTabItem,
        publishBtnLoading,
        onChange,
        offRelationChart,
        deleteCopyRelationChart,
        copyLoading,
        scrollPosition,
        createCopyRelationChart,
        publishRelationChart
    };
};
