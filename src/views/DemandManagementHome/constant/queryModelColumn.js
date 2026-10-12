import i18n from '@/localization';
// 剔除了 instanceType

export const buildingColumns = ['buildDirectAngle', 'classCode', 'id', 'localId', 'localName', 'name', 'objType', 'valid'];

export const floorColumns = ['buildingId', 'classCode', 'floorElevation', 'floorMap', 'floorSequenceID', 'floorType', 'height', 'id', 'localId', 'localName', 'objType', 'valid'];

export const spaceColumns = ['bimId', 'bimLocation', 'buildingId', 'classCode', 'floorId', 'id', 'localId', 'localName', 'objType', 'name', 'outline', 'roomFuncType', 'valid'];

export const spaceSimpleColumns = ['id', 'localId', 'localName', 'name', 'buildingId', 'floorId', 'objType', 'roomFuncType'];
