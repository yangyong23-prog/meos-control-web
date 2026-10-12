// 常用缩放控制逻辑的缩放级别
export const SCALELEVEL = {
    ONE: 1.4, // 0~1.4 => 1级
    TWO: 1.8, // 1.4~1.8 => 2级
    THREE: 2.2,
    FOUR: 2.6,
    FIVE: 3,
    SIX: 3.4,
    SEVEN: 3.8,
    THIRTEEN: 6.6 // 6.6~7 => 14级
};

export const spaceScaleByLevel = (allSpaceMap, scaleLevel) => {
    const curLevel = scaleLevel + 1;
    // let c = 0;
    allSpaceMap.forEach(space => {
        if (space.spaceIconInfo && space.spaceIconInfo.spaceData.newScaleRule) {
            const { levelMax, levelMin } = space.spaceIconInfo.spaceData.newScaleRule;
            if (curLevel >= levelMin && curLevel <= levelMax) {
                space.spaceIconInfo.setState('scaleShow', true);
            } else {
                space.spaceIconInfo.setState('scaleShow', false);
            }
        }
    });
    // console.log('spaceScaleByLevel: ', scaleLevel, c);
};
export default class ScaleLevelDetector {
    constructor() {
        this.scale = 0;
    }

    spaceScale(allSpaceMap) {
        allSpaceMap.forEach(space => {
            if (space.spaceIconInfo && space.spaceIconInfo.spaceData.scaleRule) {
                const { minShowNameLevel, onlyMaxLevelShowName } = space.spaceIconInfo.spaceData.scaleRule;
                if (onlyMaxLevelShowName) {
                    if (this.scale >= SCALELEVEL.THIRTEEN) {
                        space.spaceIconInfo.setState('scaleShow', true);
                        // space.spaceIconInfo.scaleTxtShow = true;
                    } else {
                        space.spaceIconInfo.setState('scaleShow', false);
                        // space.spaceIconInfo.scaleTxtShow = false;
                    }
                } else {
                    if (this.scale >= (minShowNameLevel === 1 ? 0 : 1) + 0.4 * (minShowNameLevel - 1)) {
                        space.spaceIconInfo.setState('scaleShow', true);
                        // space.spaceIconInfo.scaleTxtShow = true;
                    } else {
                        space.spaceIconInfo.setState('scaleShow', false);
                        // space.spaceIconInfo.scaleTxtShow = false;
                    }
                }
                // space.spaceIconInfo.scaleIconShow = true;
            }
        });
    }

    // 普通设备缩放
    equipScale(equipIconInfoMap) {
        // console.log('equipScale 1', [...equipIconInfoMap.keys()]);
        equipIconInfoMap.forEach(equip => {
            if (!equip) return;
            if (this.scale < SCALELEVEL.TWO) {
                // equip.scaleTxtShow = false;
                equip.setState('scaleShow', false);
            } else {
                // equip.scaleTxtShow = true;
                equip.setState('scaleShow', true);
                // console.log('equipScale scaleShow 1');
            }
        });
    }

    // 特殊普通设备缩放（常驻设备）
    specialEquipScale(equipIconInfoMap) {
        equipIconInfoMap.forEach(equip => {
            if (equip && equip.equipData.isSpecialEquipment) {
                if (this.scale < SCALELEVEL.THIRTEEN) {
                    // equip.scaleTxtShow = false;
                    equip.setState('scaleShow', false);
                } else {
                    // equip.scaleTxtShow = true;
                    equip.setState('scaleShow', true);
                }
            }
        });
    }

    get3DOpacity() {
        if (this.scale <= SCALELEVEL.ONE) {
            return 1;
        }
        if (this.scale <= SCALELEVEL.TWO) {
            return 0.8;
        }
        if (this.scale <= SCALELEVEL.THREE) {
            return 0.6;
        }

        return 0.5;
    }
}
