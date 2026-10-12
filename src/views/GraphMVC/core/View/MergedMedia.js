import * as THREE from '@yushu/three-base';
import { mergeUnionFun } from '../utils';
import BaseMedia from './BaseMedia';
import * as _ from 'lodash';

const caclCurrentStyle = models => {
    const styleArr = [];
    models.forEach(m => {
        styleArr.push(...m.styles);
    });
    const arr = _.sortBy([...styleArr], obj => (obj?.priority ? obj.priority : 0));
    // 对样式排序，无优先级属性(priority)则默认为0，进行排序
    const style = _.mergeWith({}, ...arr, mergeUnionFun);

    return style;
};
export default class MergedMedia extends BaseMedia {
    constructor(model, rootMedia) {
        super(model, rootMedia);
        this.model.addObserver('updateFragment', e => this.updateFragment(e));
        this.model.addObserver('ChangeState', e => this.stateChanged(e));
    }

    stateChanged() {
        const style = this.model.caclCurrentStyle();

        const parentShow = this.model.getParentsShow();
        this.model.show = parentShow && style?.show;
        if (this.model.show) {
            const allIds = Object.keys(this.object3D.geometry.cacheGroup);
            this.updateFragment({ ids: allIds });

            this.object3D.geometry.attributes.color.needsUpdate = true;
        }
    }

    onObject3DMounted() {
        this.stateChanged();
    }

    updateFragment({ ids }) {
        ids.forEach(id => {
            const childs = this.model._idMapParasites.get(id);
            // 将寄生model 和自身的状态样式统一计算
            const style = childs?.length > 0 ? caclCurrentStyle([...childs, this.model]) : this.model.caclCurrentStyle();
            this.parseFragmentStyle(id, style);
        });
        this.object3D.geometry.attributes.color.needsUpdate = true;
    }

    // 更新ID对应的段的
    parseFragmentStyle(id, style) {
        // console.log(this.model);
        const { opacity = 1 } = style;
        const col = new THREE.Color(style.color);
        // const col = new THREE.Color('#1b4acc');
        const colorsAttributes = this.object3D.geometry.attributes.color;
        const groups = this.object3D.geometry.cacheGroup[id];
        // console.log('col: ', col, groups);
        if (groups) {
            groups.forEach(({ count, start }) => {
                for (let index = start; index < start + count; index++) {
                    colorsAttributes.setXYZW(index, col.r, col.g, col.b, opacity);
                }
            });
        }
    }
}
