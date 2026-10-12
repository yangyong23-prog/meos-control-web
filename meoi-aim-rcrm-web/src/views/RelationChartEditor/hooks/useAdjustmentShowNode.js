import { ref, watchEffect } from 'vue';
import { DATA_TYPE } from '@yushu/relation-chart';

export default currentChooseModles => {
    const isShowEquipName = ref(false); // 设备名称（EquipName） 只有一个equip
    const isShowGroupName = ref(false); // 组合命名（GroupName） 只有equip 且 equip >= 2
    const isShowInfoPointList = ref(false); // 信息点列表（InfoPointList） 只有equip || passBy 且（equip || passBy）>=1
    const isShowPassByScaleAndPos = ref(false); // 小附件大小调整（PassByScaleAndPos） 只有passBy 且 passBy >= 1
    const isShowInfoPointFontSize = ref(false); // 信息点字号（InfoPointFontSize） 只有 tag || card 且 （tag || card）>=1
    const isShowInfoPointWidth = ref(false); // 信息点宽度（InfoPointWidth） 只有card 且 card >=1
    const isShowAlignment = ref(false); // 对齐方式（Alignment） 存在 tag card, 且选中节点数量 >=2
    const isShowLine = ref(false); // 信息点的线条

    // nodeClass
    function determineNodeClass(data, type) {
        const viewType = type === 'type' ? data.type : data.getViewType();
        if (['equipmentNode', 'Rect'].includes(viewType)) return 'equip';
        if (viewType === 'passBy') return 'passBy';
        if (['singleInfoCode', 'tabGroup', 'tab', 'groupName'].includes(viewType)) return 'tag';
        if (['equipToInfoCodes', 'infoCodeToEquips'].includes(viewType)) return 'card';
        return '';
    }
    // 判断是否包含指定类型
    function containsTypes(types, currentTypes) {
        return types.every(type => currentTypes.includes(type));
    }
    // 检查数组是否包含指定类型的任意一种，并且不包含指定类型外的类型
    function isAllOfTypeAndNot(types, array) {
        const containsAnyType = types.some(type => array.includes(type));
        const containsOnlyTheseTypes = array.every(type => types.includes(type));
        return containsAnyType && containsOnlyTheseTypes;
    }
    // 判断是否包含指定类型
    function currentTypess(types, currentTypes) {
        return types.some(type => currentTypes.includes(type));
    }
    watchEffect(() => {
        if (currentChooseModles?.value) {
            const currentTypes = currentChooseModles.value.map(model => {
                // 根据 _dataType 设置 nodeClass
                return model._dataType === DATA_TYPE.DOM_DATA_TYPE
                    ? determineNodeClass(model, 'type')
                    : model._dataType === DATA_TYPE.CANVAS_DATA_TYPE
                    ? determineNodeClass(model, 'viewType')
                    : null; // 处理其他情况
            });

            const { length } = currentTypes;
            console.log(currentTypes, '-----');
            // 设备名称
            isShowEquipName.value = length === 1 && currentTypes[0] === 'equip';
            // 组合名称
            isShowGroupName.value = length >= 2 && isAllOfTypeAndNot(['equip'], currentTypes);
            // 信息点列表
            isShowInfoPointList.value = isAllOfTypeAndNot(['equip', 'passBy'], currentTypes) && length >= 1;
            // 小部件
            isShowPassByScaleAndPos.value = isAllOfTypeAndNot(['passBy'], currentTypes) && length === 1;
            // 信息点字号
            isShowInfoPointFontSize.value = isAllOfTypeAndNot(['tag', 'card'], currentTypes);
            // 信息宽度
            isShowInfoPointWidth.value = isAllOfTypeAndNot(['card'], currentTypes);
            // 对齐方式
            isShowAlignment.value = currentTypess(['tag', 'card'], currentTypes) && length >= 2;
            // 信息点顶部线条
            isShowLine.value = containsTypes(['equip', 'passBy'], currentTypes) && length >= 2;
        }
    });

    return {
        isShowEquipName,
        isShowGroupName,
        isShowInfoPointList,
        isShowPassByScaleAndPos,
        isShowInfoPointFontSize,
        isShowInfoPointWidth,
        isShowAlignment,
        isShowLine
    };
};
