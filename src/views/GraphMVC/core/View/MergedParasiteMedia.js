import BaseMedia from './BaseMedia';

export default class MergedParasiteMedia extends BaseMedia {
    constructor(model) {
        super(model);
    }

    // 子类实现生成模型
    // eslint-disable-next-line class-methods-use-this
    makeObject3D() {
        return {};
    }
}
