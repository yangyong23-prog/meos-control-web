import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { GRAPH_HSEC_MODEL_OPTIONS, HALF_SECTION_QUERY_SCENE_NAME, showAndHideOptions } from '@/views/xshellConfiguration/constants/constant';
import { formatConfigData, parseValue } from '@/views/xshellConfiguration/utils/tools';

// 空间设备关系配置
// "{\"1\":\"点击空间直接打开空间设备关系拓扑图\",\"2\":\"从空间详情打开空间设备关系拓扑图\"}"
export const SPACE_EQUIP_RELATION_CONFIG = {
    DIRECT: '1',
    FROM_DETAIL: '2'
};

// 模块级共享 ref：同一页面内多个 hook 实例共享同一份配置数据，避免重复请求
const halfSectionConfig = ref({});
// 模块级 Promise 缓存：并发调用 getHalfSectionConfig 时复用同一个请求
let halfSectionConfigPromise = null;

// 重置配置函数
export const resetHalfSectionConfig = () => {
    halfSectionConfig.value = {};
    halfSectionConfigPromise = null;
};

function useHalfSectionConfigHooks() {
    // 半剖图入口配置
    const isFromInstanceDetail = computed(() => {
        const model = String(halfSectionConfig.value?.graph_hsec_model);
        // console.log(model, GRAPH_HSEC_MODEL_OPTIONS.formDetail.id);
        return model === GRAPH_HSEC_MODEL_OPTIONS.formDetail.id;
    });
    const isFromDevice = computed(() => {
        const model = String(halfSectionConfig.value?.graph_hsec_model);
        // console.log(model, GRAPH_HSEC_MODEL_OPTIONS.formDevice.id);
        return model === GRAPH_HSEC_MODEL_OPTIONS.formDevice.id;
    });

    // 空调机组控制组ACAHG显示配置
    const ACAHGShow = computed(() => halfSectionConfig.value?.graph_hsec_acahg === showAndHideOptions.show.value);
    // ACATAH显示配置
    const ACATAHShow = computed(() => halfSectionConfig.value?.graph_hsec_acatah === showAndHideOptions.show.value);
    // ACATFU显示配置
    const ACATFUShow = computed(() => halfSectionConfig.value?.graph_hsec_acatfu === showAndHideOptions.show.value);

    const ACAHGList = computed(() => halfSectionConfig.value?.graph_hsec_acahg_list || []);
    const ACATAHList = computed(() => halfSectionConfig.value?.graph_hsec_acatah_list || []);
    const ACATFUList = computed(() => halfSectionConfig.value?.graph_hsec_acatfu_list || []);

    // 空间设备关系配置
    const spaceEquipRelationConfig = computed(() => halfSectionConfig.value?.space_device_entry_mode?.toString());
    const isDirectRelation = computed(() => spaceEquipRelationConfig.value === SPACE_EQUIP_RELATION_CONFIG.DIRECT);
    const isFromDetailRelation = computed(() => spaceEquipRelationConfig.value === SPACE_EQUIP_RELATION_CONFIG.FROM_DETAIL);

    const formatHalfSectionConfig = data => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return {};
        }
        const configMap = {};
        formatConfigData(data, itemObj => {
            const usedValue = itemObj.value ? parseValue(itemObj.value) : parseValue(itemObj.defaultValues);
            configMap[itemObj.code] = usedValue;
        });
        return configMap;
    };

    // 需要主动调用，否则无法获取配置
    const getHalfSectionConfig = async () => {
        // 复用模块级 Promise，避免并发调用时重复请求
        if (!halfSectionConfigPromise) {
            halfSectionConfigPromise = shellConfigQuery({ scene: HALF_SECTION_QUERY_SCENE_NAME })
                .then(res => {
                    if (res.code === SUCCESSCODE && res.data) {
                        const formattedData = formatHalfSectionConfig(res.data);
                        halfSectionConfig.value = formattedData;
                        return formattedData;
                    }
                    return {};
                })
                .finally(() => {
                    halfSectionConfigPromise = null;
                });
        }
        return halfSectionConfigPromise;
    };

    return {
        halfSectionConfig,
        getHalfSectionConfig,
        isFromInstanceDetail,
        isFromDevice,
        ACAHGShow,
        ACATAHShow,
        ACATFUShow,
        ACAHGList,
        ACATAHList,
        ACATFUList,
        spaceEquipRelationConfig,
        isDirectRelation,
        isFromDetailRelation
    };
}

export default useHalfSectionConfigHooks;
