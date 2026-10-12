import { RISK_EVENT_TAG_MAP, RISK_EVENT_STATUS_ORDER } from './variable';
export const convertEquipsToTree = data => {
    const typeMap = data.reduce((map, item) => {
        const { majorCode, majorName, classCode, classCodeName, ...rest } = item;

        if (!map.has(majorCode)) {
            map.set(majorCode, { id: majorCode, name: majorName, children: new Map() });
        }

        const typeNode = map.get(majorCode);

        if (!typeNode.children.has(classCode)) {
            typeNode.children.set(classCode, { id: classCode, name: classCodeName, children: [] });
        }

        typeNode.children.get(classCode).children.push({ ...item, name: item.localName });

        return map;
    }, new Map());

    return Array.from(typeMap.values()).map(typeNode => ({
        ...typeNode,
        children: Array.from(typeNode.children.values())
    }));
};

const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });

export const sortDangerEventByStatus = (a, b) => {
    const { equipCriticalLevel: aEquipCriticalLevel, status: aStatus, equipLocalName: aEquipName } = a || {};
    const { equipCriticalLevel: bEquipCriticalLevel, status: bStatus, equipLocalName: bEquipName } = b || {};
    const aIndex = RISK_EVENT_STATUS_ORDER.indexOf(aStatus);
    const aOrder = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const bIndex = RISK_EVENT_STATUS_ORDER.indexOf(bStatus);
    const bOrder = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    if (aOrder === bOrder) {
        const aSort = aEquipCriticalLevel ?? Number.MAX_SAFE_INTEGER;
        const bSort = bEquipCriticalLevel ?? Number.MAX_SAFE_INTEGER;
        if (aSort === bSort) {
            return collator.compare(aEquipName, bEquipName);
        }
        return aSort - bSort;
    }
    return aOrder - bOrder;
};

const checkOrder = (aCode, bCode) => {
    const aSort = aCode ? RISK_EVENT_TAG_MAP[aCode]?.SORT : Number.MAX_SAFE_INTEGER;
    const bSort = bCode ? RISK_EVENT_TAG_MAP[bCode]?.SORT : Number.MAX_SAFE_INTEGER;
    return { aSort, bSort };
};

export const sortDangerEventByTagAndName = (a, b) => {
    const { exceptionValueLevel: aOneLevel, symptomaticValueLevel: aTwoLevel } = a || {};
    const { exceptionValueLevel: bOneLevel, symptomaticValueLevel: bTwoLevel } = b || {};
    const { aSort: aOneCode, bSort: bOneCode } = checkOrder(aOneLevel?.code, bOneLevel?.code);
    const { aSort: aTwoCode, bSort: bTwoCode } = checkOrder(aTwoLevel?.code, bTwoLevel?.code);
    if (aOneLevel || bOneLevel) {
        if (aOneCode === bOneCode) {
            return collator.compare(a.name, b.name);
        }
        return aOneCode - bOneCode;
    } else if (aTwoLevel || bTwoLevel) {
        if (aTwoCode === bTwoCode) {
            return collator.compare(a.name, b.name);
        }
        return aTwoCode - bTwoCode;
    } else {
        return collator.compare(a.name, b.name);
    }
};

export const sortEquipByLevelAndName = (a, b) => {
    const { equipCriticalLevel: aEquipCriticalLevel, localName: aLocalName } = a || {};
    const { equipCriticalLevel: bEquipCriticalLevel, localName: bLocalName } = b || {};
    const aOrder = aEquipCriticalLevel ?? Number.MAX_SAFE_INTEGER;
    const bOrder = bEquipCriticalLevel ?? Number.MAX_SAFE_INTEGER;

    if (aOrder === bOrder) {
        return collator.compare(aLocalName, bLocalName);
    }
    return aOrder - bOrder;
};
