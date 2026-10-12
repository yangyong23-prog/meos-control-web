import BaseModel from './BaseModel';

export default class MergedParasiteModel extends BaseModel {
    constructor(ids) {
        super();

        this._host = null;
        this.isParasite = true;
        this._show = true;
        this._ids = ids || [];
    }

    // 始终false
    // set show(value) {
    //     this._show = false;
    // }

    // eslint-disable-next-line class-methods-use-this
    addChild() {
        console.error('寄生对象不能添加子对象');
    }

    getIds() {
        return this._ids;
    }

    setState(name, value) {
        super.setState(name, value);
        this._host?.updateFragment(this._ids);
    }
}
