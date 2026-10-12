import { isIotInfoType } from '@/utils/infoTemplate';
const hasVisiableIotRole = relInfoCodeConfigs => {
    return relInfoCodeConfigs?.some(item => {
        const showStyle = item.showStyle ?? {};
        if (isIotInfoType(item.infoCodeType) && showStyle.visibleCondition) {
            return true;
        }
    });
};
// 判断部件是否可见
export const judgePartVisible = (showRules, partInfos) => {
    return showRules?.some(rule => {
        const { type, field, value } = rule;
        switch (type) {
            case 'existsIotRule':
                return hasVisiableIotRole(partInfos?.flatConfigs);
            case 'equals':
                return partInfos?.flatConfigs?.some(item => {
                    if (item?.infoCode === field) {
                        let val = item.dataValue;

                        return val === value;
                    }
                    return false;
                });
            case 'contain':
                return partInfos?.flatConfigs?.some(item => {
                    if (item?.infoCode === field) {
                        let val = item.dataValue;

                        return val?.includes && val.includes(value);
                    }
                    return false;
                });
            case 'range':
                return partInfos?.flatConfigs?.some(item => {
                    if (item?.infoCode === field) {
                        let val = item.dataValue;

                        if (val === null || val === undefined) return false;
                        val = Number(val);
                        return val >= value[0] && val <= value[1];
                    }
                    return false;
                });
            default:
                return false;
        }
    });
};

/**
 * 计算部件名称最大宽度
 * @param {*} config 配置
 * @param {*} partRect
 * @returns
 */
export const calcNameMaxWidth = (config, partRect) => {
    if (config) {
        if (config.type === 'partWidthMultiple') {
            return partRect.width * config.value;
        } else if (config.type === 'fixed') {
            return config.value;
        }
    }
    return partRect.width;
};

export const genPartId = (partInfo, eqId = '') => {
    return `part_${eqId}_${partInfo.code}_${partInfo.index ?? '1'}`;
};
export const genPartNameId = (partInfo, eqId = '') => {
    return `part_name_${eqId}_${partInfo.code}_${partInfo.index ?? '1'}`;
};

export const itemValueText = info => {
    let val = info?.dataValue;

    if (info.dataSources) {
        const item = info.dataSources.find(obj => obj.code === val);
        if (item) {
            val = item.name;
        }
    }
    const isValEmpty = val === null || val === undefined || val === '';
    return `${val || '--'}${isValEmpty ? '' : info.unit ?? ''}`;
};

export const getJSONObj = str => {
    if (str) {
        try {
            const val = str
                .replace(/\n/g, '') // 去掉换行
                .replace(/\s+/g, ' '); // 把所有空白变成普通空格;

            return JSON.parse(val);
        } catch (e) {
            console.log('e: ', e);
        }
    }
    return null;
};
// 拉平组配置
export const flatGroupConfigItem = group => {
    const arr = [];

    // flat
    group.relInfoCodeConfigs?.forEach(config => {
        if (config.showStyle) {
            config.showStyle = config.showStyle ? getJSONObj(config.showStyle) ?? {} : {};
        }
        arr.push(config);
        config.relInfoCodeConfigs?.forEach(subItem => {
            subItem.showStyle = subItem.showStyle ? getJSONObj(subItem.showStyle) ?? {} : {};
            arr.push(subItem);
        });
    });
    return arr;
};

// 计算动态布局元素布局
export const calcDyncPartsLayout = (templateData, dynamicElements) => {
    const layoutGroups = dynamicElements.reduce((acc, cur) => {
        if (cur.layout === 'flex') {
            if (!acc[cur.layoutContainer]) {
                acc[cur.layoutContainer] = [];
            }
            acc[cur.layoutContainer].push(cur);
        }

        return acc;
    }, {});

    if (templateData.layoutContainers) {
        Object.keys(layoutGroups)?.forEach(key => {
            const layoutContainer = templateData.layoutContainers[key];
            const eles = layoutGroups[key];
            if (layoutContainer && eles?.length > 0) {
                const { width: containerWidth, locationCenter = {}, gap = 0 } = layoutContainer;
                const { x = 0, y = 0 } = locationCenter;
                const isBaseContainer = !!containerWidth;
                // 如果指定了容器宽度，则使用指定宽度，否则使用元素宽度之和 + 间隔宽度
                const width = isBaseContainer ? containerWidth : eles.reduce((acc, cur) => acc + cur.size?.width ?? 0, 0) + gap * (eles.length - 1);

                let lastX = x - width / 2,
                    lastInfoCardPlacement = null;
                eles.forEach((ele, index) => {
                    const halfEleWidth = isBaseContainer ? containerWidth / eles.length / 2 : ele.size?.width / 2;
                    const curX = lastX + halfEleWidth;
                    ele.locationCenter = { x: curX, y };
                    // console.log('ele: ', ele.code, curX, y);
                    // const originInfoCardPlacement = ele.infoCard.placement;
                    // console.log('lastInfoCardPlacement: ', ele, originInfoCardPlacement, lastInfoCardPlacement);
                    if (lastInfoCardPlacement) {
                        ele.infoCard =
                            lastInfoCardPlacement === 'top'
                                ? {
                                      placement: 'bottom',
                                      offset: {
                                          // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                                          type: 'relParentName',
                                          value: 10
                                      }
                                  }
                                : {
                                      placement: 'top',
                                      offset: {
                                          // 偏移类型：relParentName 相对于父级名称/ fixed 囸定
                                          type: 'fixed',
                                          value: 16
                                      }
                                  };
                    }
                    if (ele.infoCard) {
                        lastInfoCardPlacement = ele.infoCard.placement;
                    }
                    // 未指定容器宽度，以元素自身宽度+gap排布，否则均分指定容器宽度放置各部件
                    lastX = curX + halfEleWidth + (!isBaseContainer && index < eles.length - 1 ? gap : 0);
                });
            }
        });
    }
};

/**
 * 转换处理部件信息
 * @param {*} partInfos 部件信息的数据
 * @param {*} partsDefine 前端部件定义
 * @param {*} templateData 前端模版配置数据
 * @returns
 */
export const transformPartsInfos = (partsDefine, partInfos, templateData) => {
    const partCodeMapInfos = partInfos.reduce((acc, item) => {
        acc[item.groupCode] = item;
        return acc;
    }, {});

    let _parts = partsDefine
        ?.filter(part => {
            return judgePartVisible(part.showRules, partCodeMapInfos[part.code]);
        })
        .map(part => {
            // TODO 计算位置等
            return {
                ...part,
                order: partCodeMapInfos[part.code]?.groupOrder,
                // 部件上展示信息点
                cardInfoList: partCodeMapInfos[part.code]?.flatConfigs?.filter(config => config.showStyle?.show)
            };
        })
        .sort((a, b) => a.groupOrder - b.groupOrder);
    const dynamicElements = [];
    // eslint-disable-next-line one-var
    let dyncEleCount = 0;
    const cutRecord = {};
    const { cutConfig = {} } = templateData ?? {};

    _parts = _parts.filter(part => {
        const isDynamicLayout = part.locationType === 'dynamic';
        const { cutCode } = part;
        let isRetain = false;
        if (cutCode) {
            if (!cutRecord[cutCode]) {
                cutRecord[cutCode] = 0;
            }
            if (cutRecord[cutCode] < cutConfig[cutCode]) {
                isRetain = true;
            }
            cutRecord[cutCode] += 1;
        } else {
            isRetain = true;
        }
        if (isRetain && isDynamicLayout) {
            dynamicElements.push(part);
        }
        // console.log('cutCode: ', part.code, cutCode, cutConfig[cutCode], isRetain, cutRecord[cutCode]);

        return isRetain;
    });
    calcDyncPartsLayout(templateData, dynamicElements);
    return _parts;
};

/**
 * 获取两个二维 AABB 的合并包围盒（Union）
 * @param {Object} aabb1 - 第一个二维包围盒 { min: {x,y}, max: {x,y} }
 * @param {Object} aabb2 - 第二个二维包围盒
 * @returns {Object} 合并后的新 AABB
 */
export const getAabbUnion = (aabb1, aabb2) => {
    // 合并规则：取最小的 min，取最大的 max
    return {
        min: {
            x: Math.min(aabb1.min.x, aabb2.min.x),
            y: Math.min(aabb1.min.y, aabb2.min.y)
        },
        max: {
            x: Math.max(aabb1.max.x, aabb2.max.x),
            y: Math.max(aabb1.max.y, aabb2.max.y)
        }
    };
};
/**
 * 获取元素相对于父容器的真实视觉偏移（px）
 * @param {HTMLElement} el 目标元素
 * @param {HTMLElement} parentEl 父容器（需是 el 的直接/间接父级）
 * @returns { {left: number, top: number} } 相对偏移（px）
 */
export const getRealOffsetRelativeToParent = (el, parentEl) => {
    // 校验元素合法性
    if (!el || !parentEl || !parentEl.contains(el)) {
        throw new Error('parentEl 必须是 el 的父级元素');
    }

    // 获取元素和父容器的视觉边界（受 transform 影响）
    const elRect = el.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();

    // 计算相对偏移：元素视觉坐标 - 父容器视觉坐标
    const relativeLeft = elRect.left - parentRect.left;
    const relativeTop = elRect.top - parentRect.top;
    const { width } = elRect;
    const { height } = elRect;

    return {
        left: Math.round(relativeLeft), // 四舍五入到整数 px（可选）
        top: Math.round(relativeTop),
        width: Math.round(width),
        height: Math.round(height)
    };
};

/**
 * 获取子元素的包围盒
 * @param {*} pEle 父元素
 * @param {*} relEle 相对元素
 * @returns
 */
export const getChildrenBound = (pEle, relEle) => {
    // pEle.children
    const _relElm = relEle || pEle;
    const relRect = _relElm.getBoundingClientRect();
    // console.log('parentRect: ', _relElm, relRect);
    let aabb = {
        min: {
            x: Infinity,
            y: Infinity
        },
        max: {
            x: -Infinity,
            y: -Infinity
        }
    };
    pEle.children?.forEach(child => {
        const elRect = child.getBoundingClientRect();
        const relativeLeft = elRect.left - relRect.left;
        const relativeRight = elRect.right - relRect.left;
        const relativeTop = elRect.top - relRect.top;
        const relativeBottom = elRect.bottom - relRect.top;
        // if (relativeTop === -87) {
        //     console.log('child.className: ', child.className, relativeTop, child);
        // }
        // if (child.classList.contains('info-card')) {
        //     console.log('elRect: ', child, elRect);
        // }
        aabb = getAabbUnion(aabb, { min: { x: relativeLeft, y: relativeTop }, max: { x: relativeRight, y: relativeBottom } });
    });

    return aabb;
};

export const genAnchorStyle = (targetRect, config, fontSize = 12) => {
    const { placement, offset, id, code } = config;
    // ... existing code ...
    const posRect = targetRect ?? {};
    let left = posRect.left + offset.x,
        top = posRect.top + offset.y,
        transform;
    switch (placement) {
        case 'top':
            transform = 'translate(-50%, -100%)'; // 水平居中，垂直向上对齐
            break;
        case 'topRight':
            transform = 'translate(0, -100%)'; // 水平居中，垂直向上对齐
            break;
        case 'bottom':
            // 定位到目标元素下方中心位置

            transform = 'translate(-50%, 0)'; // 水平居中，垂直向下对齐
            break;
        case 'left':
            // 定位到目标元素左侧中心位置

            transform = 'translate(-100%, -50%)'; // 水平向左对齐，垂直居中
            break;
        case 'right':
            transform = 'translate(0, -50%)'; // 水平向右对齐，垂直居中
            break;
        default:
            // 默认定位到右侧

            transform = 'translate(0, -50%)';
    }

    return {
        id: id ?? code,
        left: `${left}px`,
        top: `${top}px`,
        transform: transform,
        fontSize: `${fontSize}px`
    };
};
