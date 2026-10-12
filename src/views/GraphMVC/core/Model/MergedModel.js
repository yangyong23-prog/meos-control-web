import BaseModel from './BaseModel';

// 合并的宿主
export default class MergedModel extends BaseModel {
    constructor() {
        super();
        this._parasites = [];
        this._idMapParasites = new Map();
        this.isMergedModel = true;
    }

    hasParasite(parasite) {
        return !!this._parasites.find(p => p === parasite || p.data.key === parasite.data.key);
    }

    // overwrite
    addChild(child) {
        if (child.isParasite) {
            // 不能重复添加
            if (this.hasParasite(child)) {
                console.warn('重复添加到宿主，添加失败');
                return false;
            }
            child._host = this;
            child.getIds().forEach(id => {
                if (!this._idMapParasites.has(id)) {
                    this._idMapParasites.set(id, []);
                }
                this._idMapParasites.get(id).push(child);
            });
            this._parasites.push(child);
        }
        super.addChild(child);
    }

    // 片段更新
    updateFragment(ids) {
        this.emit('updateFragment', { ids });
    }
}
