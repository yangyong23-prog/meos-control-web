import Observable from '../Base/Observable';
import { mergeUnionFun } from '../utils';
import * as _ from 'lodash';

export default class BaseMapModel extends Observable {
    constructor() {
        super();
        this.parent = null;
        this.childModels = new Set();
        this.rootModel = null;
        // 用户允许交互
        this.userinteractionEnable = true;
        this.state = 0;
        this._state = {};
        this.defineStyles = {
            normal: {
                color: '#000000'
            }
        };
        this.finalStyles = null;
        this.styles = new Set();
        this._show = false;
    }

    set show(value) {
        if (this._show === value) {
            return;
        }
        this._show = value;
        this.emit(value ? 'showObject3D' : 'hideObject3D', {});
    }

    get show() {
        return this._show;
    }

    isRemoved() {
        return !this.parent;
    }

    add(childModel) {
        if (this.rootModel) {
            childModel.rootModel = this.rootModel;
        } else {
            childModel.rootModel = this;
        }
        childModel.parent = this;
        // 添加的子级与父级的状态一致
        if (Object.keys(this._state).length !== 0) {
            Object.keys(this._state).forEach(name => {
                if (childModel.defineStyles[name]) {
                    childModel._state[name] = this._state[name];
                    if (this._state[name]) {
                        childModel.styles.add(childModel.defineStyles[name]);
                    } else {
                        childModel.styles.delete(childModel.defineStyles[name]);
                    }
                }
            });
        }
        this.childModels.add(childModel);
    }

    // eslint-disable-next-line class-methods-use-this
    remove(childModel) {
        if (childModel) {
            childModel.parent = null;
            childModel.rootModel = null;
            childModel._state = {};
            childModel.styles.clear();
            this.childModels.delete(childModel);
        }
    }

    addChild(childModel) {
        if (!childModel) return;
        const pName = `创建${childModel.name.toString()}`;
        performance.marks(pName);
        this.add(childModel);
        this.emit('addChild', childModel);
        childModel.childModels.forEach(c => {
            childModel.addChild(c);
        });
        performance.marke(pName);
        performance.measurem(pName);
    }

    removeChild(childModel) {
        // 若是无效的子model，或childModel不是当前子
        if (!childModel || !childModel.parent || childModel.parent !== this) return;
        this.remove(childModel);
        childModel.removeChildren();
        this.emit('removeChild', childModel);

        childModel.clearEvents();
        childModel.clearListeners();
    }

    removeChildren() {
        const childrenArr = [...this.childModels];
        childrenArr.forEach(child => {
            this.removeChild(child);
        });
    }

    hadAdded() {
        return this.parent !== null;
    }

    hasChild(model) {
        return this.childModels.has(model);
    }

    getChildByIndex(idx) {
        if (idx < this.childModels.size) {
            return Array.from(this.childModels)[idx];
        }
    }

    getChildrenByName(modelName) {
        return Array.from(this.childModels)?.filter(m => m?.name === modelName);
    }

    findChildByName(modelName) {
        return Array.from(this.childModels)?.find(m => m?.name === modelName);
    }

    // 计算对象叠加后的样式
    caclCurrentStyle() {
        if (this.finalStyles) {
            return this.finalStyles;
        }
        // 对样式排序，无优先级属性(priority)则默认为0，进行排序
        const arr = _.sortBy([...this.styles], obj => (obj?.priority ? obj.priority : 0));
        const style = _.mergeWith({}, ...arr, mergeUnionFun);
        this.finalStyles = style;
        return style;
    }

    // 获取当前所有样式中某一属性的所有不重复值
    getCurrentStyleValues(styleKey) {
        const vals = new Set();
        this.styles.forEach(style => {
            if (style[styleKey]) {
                vals.add(style[styleKey]);
            }
        });
        return [...vals];
    }

    setStyle(name, value) {
        this._state[name] = value;
        if (this.defineStyles[name]) {
            if (value) {
                this.styles.add(this.defineStyles[name]);
            } else {
                this.styles.delete(this.defineStyles[name]);
            }
        }

        this.finalStyles = null;
    }

    setState(name, value) {
        if (this._state[name] === value) {
            return;
        }
        this.setStyle(name, value);
        // 触发media
        this.emit('ChangeState', { name, value });
        // 子级与父级的状态相同
        this.childModels.forEach(model => {
            model.setState(name, value);
        });
    }

    setAsyncState(name, value) {
        if (this._state[name] === value) {
            return;
        }
        this.setStyle(name, value);
        // 触发media
        this.asyncEmit('ChangeState', { [name]: value });
        // 子级与父级的状态相同
        this.childModels.forEach(model => {
            model.setAsyncState(name, value);
        });
    }

    getState(name) {
        return this._state[name];
    }

    removeState(name) {
        delete this._state[name];
        if (this.defineStyles[name]) {
            this.styles.delete(this.defineStyles[name]);
        }
        this.childModels.forEach(model => {
            model.removeState(name);
        });
    }

    clearStates(stateNames) {
        const _stateNames = stateNames ? stateNames : Object.keys(this._state);
        _stateNames.forEach(key => {
            this.removeState(key);
        });
    }

    clearStatesAsync(stateNames) {
        const _stateNames = stateNames ? stateNames : Object.keys(this._state);
        _stateNames.forEach(key => {
            this.setStyle(key, false);
            // 触发media
            this.asyncEmit('ChangeState', { [key]: false });
            delete this._state[name];
            // 子级与父级的状态相同
            this.childModels.forEach(model => {
                model.setAsyncState(key, false);
            });
        });
    }

    setStateStyles(styles) {
        this.defineStyles = _.assign({}, this.defineStyles, styles);
        this.normalStyle = this.defineStyles.normal;
        this.styles.clear();
        this.styles.add(this.normalStyle);
    }

    // 获取对象定义样式
    getDefineStyles() {
        return this.defineStyles;
    }

    // 往父亲节点找是否show的
    getParentsShow() {
        let p = this.parent;
        while (p && p.parent) {
            const s = p.caclCurrentStyle();
            if (!s?.show) {
                return false;
            }
            p = p.parent;
        }
        return true;
    }

    dispose() {
        // eslint-disable-next-line no-restricted-syntax
        for (const childModel of this.childModels.values()) {
            childModel.dispose();
        }
        this.childModels.clear();
        this.clearEvents();
        this.clearListeners();
        this.rootModel = null;
        this.parent = null;
    }
}
