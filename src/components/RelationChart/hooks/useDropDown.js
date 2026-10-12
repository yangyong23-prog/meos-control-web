// @ts-ignore
import i18n from '@/localization';
import { queryRelationChartList } from '@/apis/relationChart';
import { useRoute } from 'vue-router';
export default (loadChart, graphDataloading) => {
    const route = useRoute();
    // 获取路由参数graphTypeCode
    const routeGraphTypeCode = route.query.graphTypeCode;
    // #下拉菜单的一些配置项
    const dropDownMeta = reactive({
        iconRotate: false,
        value: '',
        option: []
    });
    // &下拉框选中的值
    const dropDownIndex = computed(() => {
        return dropDownMeta.option.findIndex(res => res.key === dropDownMeta.value) + 1;
    });
    // &下拉框选中的标签
    const dropDownCurrentLabe = computed(() => {
        return dropDownMeta.option.find(res => res.key === dropDownMeta.value)?.label || '--';
    });
    // > 下拉框切换逻辑 -> 重请求关系图
    const dropDownChange = (id, obj) => {
        loadChart(id, obj.systemGraphDuplicateId);
    };

    let abortController = null;

    //  系统图实例查询
    const getInstanceSelect = async chartAttr => {
        abortController?.abort();
        try {
            graphDataloading.value = true;
            abortController = new AbortController();
            let data = await queryRelationChartList(chartAttr, abortController.signal);
            if (data.code === '00000') {
                const obj = data?.data || {};

                if (obj.id) {
                    dropDownMeta.option = [
                        {
                            key: obj.id,
                            label: obj.graphTypeCode,
                            ...obj
                        }
                    ];
                } else {
                    dropDownMeta.option = [];
                }

                if (dropDownMeta.option.length) {
                    let curMeta = dropDownMeta.option.find(code => routeGraphTypeCode === code.label);
                    if (!curMeta) {
                        curMeta = dropDownMeta.option[0];
                    }
                    dropDownMeta.value = curMeta.id;
                    dropDownChange(dropDownMeta.value, curMeta);
                } else {
                    dropDownMeta.value = '';
                }
                return dropDownMeta.option || [];
            } else {
                return [];
            }
        } catch (e) {
            console.error('加载系统图列表失败', e);
        }
    };

    return {
        dropDownMeta,
        dropDownIndex,
        dropDownCurrentLabe,
        dropDownChange,
        getInstanceSelect
    };
};
