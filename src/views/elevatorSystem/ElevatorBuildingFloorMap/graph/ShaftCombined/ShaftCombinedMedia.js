// @ts-ignore
import i18n from '@/localization';
import { baseUtils } from '@yushu/three-base';
import * as THREE from '@yushu/three-base';
import { mergeGeometries } from '@yushu/three-base/three-extends/jsm/utils/BufferGeometryUtils';
import BaseMedia from '@/views/GraphMVC/core/View/BaseMedia';

const { setMeshUpToY, outlineParseToMesh, M2FOOT } = baseUtils;

export default class ShaftCombinedMedia extends BaseMedia {
    constructor(shaft, rootMedia) {
        super(shaft, rootMedia);
        this.floorIdMapMat = {};
        this.init();

        this.model.addObserver('ChangeState', e => this.stateChanged(e));
        this.model.addObserver('SetDockableFloors', e => this.changeFloorStyle(e));
    }

    // 重写父类方法，生成模型
    makeObject3D() {
        const { shaftData } = this.model;
        const { shaftSpaceList } = shaftData;
        const geometryArr = [];
        this.matArr = [];
        const colorHex = this.model.normalStyle?.color || '#F2F2F2';
        const color = new THREE.Color(colorHex).convertSRGBToLinear();
        shaftSpaceList.forEach(space => {
            const { floorElevation, height, floorId, outline } = space;
            // console.log('floorElevation: ', floorElevation, space.localName, shaftData.localName);
            let _outline = outline;
            if (typeof outline === 'string') {
                _outline = JSON.parse(outline);
            }
            // if (!_outline) {
            //     console.log('_outline---space: ', space);
            // }

            // const spaceMesh = outlineParseToMesh(JSON.parse(space.outline), Number(height) * M2FOOT);
            const spaceMesh = outlineParseToMesh(_outline, Number(height) * M2FOOT);
            spaceMesh.position.z = Number(floorElevation) * M2FOOT;
            setMeshUpToY(spaceMesh);
            const matrixWorldGeometry = spaceMesh.geometry.clone().applyMatrix4(spaceMesh.matrix);
            geometryArr.push(matrixWorldGeometry);
            const material = new THREE.MeshStandardMaterial({
                transparent: true,
                opacity: 0.5,
                depthWrite: false,
                depthTest: false,
                color,
                side: THREE.FrontSide
            });
            this.matArr.push(material);
            this.floorIdMapMat[floorId] = material;
        });
        try {
            const shaftGeometry = mergeGeometries(geometryArr, true);

            const shaftMesh = new THREE.Mesh(shaftGeometry, this.matArr);
            shaftMesh.renderOrder = 10;
            return shaftMesh;
        } catch (e) {
            console.log('geometryArr: ', this, shaftSpaceList, geometryArr);
        }
    }

    parseStyle() {
        const curStyle = this.model.caclCurrentStyle();
        const { show, color, alpha = 1 } = curStyle;
        this.model.show = show;
        if (!show) {
            return;
        }
        const { dockableFloorIdMap = {} } = this.model;
        const dockableStyle = this.model.defineStyles.dockable || {};
        const lockedStyle = this.model.defineStyles.locked || {};
        const isLocked = this.model.getState('locked');
        const isHover = this.model.getState('hover');
        Object.keys(this.floorIdMapMat).forEach(floorId => {
            const mat = this.floorIdMapMat[floorId];
            if (mat) {
                const dockable = dockableFloorIdMap[floorId];
                let style = isLocked ? lockedStyle : dockable ? dockableStyle : curStyle;
                const _alpha = isHover && dockable ? alpha : style.alpha;
                mat.color = new THREE.Color(style.color || '#F2F2F2');
                mat.opacity = _alpha;
            }
        });
    }

    stateChanged() {
        this.parseStyle();
    }

    changeFloorStyle(d) {
        // console.log('changeFloorStyle: ', d);
        this.parseStyle();
    }

    onObject3DMounted() {
        this.parseStyle();
        this.object3D.updateMatrixWorld(true, true);
    }
}
