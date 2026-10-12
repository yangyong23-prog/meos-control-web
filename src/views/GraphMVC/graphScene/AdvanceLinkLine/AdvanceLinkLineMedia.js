import { baseUtils } from '@yushu/three-base';
import BaseMedia from '../../core/View/BaseMedia';

const { getD3PosByBimLocation } = baseUtils;

export default class AdvanceLinkLineMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.init();

        this.model.addObserver('ChangeState', e => this.equipStateChanged(e));

        this.originalMaterial = this.object3D.material;
        this.identityMaterial = this.originalMaterial;
        this.lastStyle = {};
    }

    makeObject3D() {
        const { linkData, normalStyle } = this.model;

        const { effectLoader } = this.rootMedia.renderContext;
        const { color, outColor, duration, lineSpeed } = normalStyle;
        const { startObj, endObj, useCustomHeight, useArrow = false, height = 0, keySign = '', num = 0, id } = linkData;
        // console.log('linkData: ', color, linkData, duration, normalStyle);

        const lineParams = {
            color: color || '#ffffff',
            outColor: outColor || '#246FE5',
            width: 2,
            speed: lineSpeed >= 0 ? lineSpeed : 4,
            duration: duration || 1.5,
            useArrow
        };
        // 是否使用自定义高度
        if (useCustomHeight) {
            const startBim = getD3PosByBimLocation(startObj.bimLocation);
            const endBim = getD3PosByBimLocation(endObj.bimLocation);
            startBim.y = height;
            endBim.y = height;
            startObj.location = startBim;
            endObj.location = endBim;
        }
        const baseKey = id || `${startObj.id}-${endObj.id}`;
        const _key = `${keySign ? `${keySign}-` : ''}-${baseKey}`;

        const lineObj = effectLoader.createLinkLine(startObj, endObj, lineParams, num, duration, 2, 1, _key);
        const { group, middlePoint, key } = lineObj;
        group.modelKey = _key;
        this.model.linkLineObj = { mesh: group, center: middlePoint };
        // effectLoader.pauseLinkLine(key);
        // console.log('duration', duration, group, middlePoint, key);
        this.key = key;

        return group;
    }

    parseStyle() {
        const { effectLoader } = this.rootMedia.renderContext;
        const { isDirection } = this.model.linkData;
        const style = this.model.caclCurrentStyle();
        // console.log('parseStyle: ', this.key, { ...this.model._state }, { ...style });

        const parentShow = this.model.getParentsShow();

        const { show, flow, color, outColor, opacity = 1, width } = style;
        this.model.show = parentShow && show;

        if (parentShow && show) {
            if (flow && isDirection) {
                // effectLoader.activeLinkLine(this.key);
                effectLoader.setLineSpeed(this.key, 4);
                effectLoader.setLineDashOpacity(this.key, 1);
            } else {
                // effectLoader.pauseLinkLine(this.key);
                effectLoader.setLineSpeed(this.key, 0);
                effectLoader.setLineDashOpacity(this.key, 0);
            }
            effectLoader.changeLinkLineColor(this.key, color, outColor);

            effectLoader.setLineOpacity(this.key, opacity);
            if (width) {
                effectLoader.setLineWidth(this.key, width);
            }
            // if (this.object3D?.children) {
            //     this.object3D.children.forEach(mesh => {
            //         if (mesh.material) {
            //             mesh.material.opacity = opacity;
            //         }
            //     });
            // }
        }

        this.lastStyle = style;
    }

    equipStateChanged() {
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
    }

    afterRemoved() {
        const { effectLoader } = this.rootMedia.renderContext;
        effectLoader.removeLinkLine(this.key);
    }
}
