import BaseModel from '../../core/Model/BaseModel';

function _getFullSubState() {
    return true;
}
// 碰撞检测基类
export default class BaseCollisionModel extends BaseModel {
    constructor() {
        super();

        this.key = null;
        this.bimLocation = null;
        this.domRect = null;

        this.lastShow = false;

        this.lastDisabledCollision = false;
        this.disabledCollision = false;

        this.lastDisabledScale = false;
        this.disabledScale = false;

        // 子状态，文字或icon被碰撞，或缩放掉;
        this.subState = null;
        // 暂存子状态
        this.lastSubState = null;
        this.resetSubState();

        // 是否已经记录状态
        this.saveSubStateAlready = false;
        this.collisionCacheData = {}; // 防碰撞时 要记录一下 缓存数据 避免重复计算
    }

    // eslint-disable-next-line class-methods-use-this
    getDomRect() {
        console.log('请实现getDomRect方法');
    }

    /**
     * 复原子状态
     */
    recoverSubState() {
        if (this.saveSubStateAlready === false) {
            return;
        }
        this.saveSubStateAlready = false;
        this.subState = this.lastSubState;
        // this.lastSubState = SubState.unknow;

        this.disabledCollision = this.lastDisabledCollision;
        this.disabledScale = this.lastDisabledScale;

        this.show = this.lastShow;
    }

    /**
     * 移除子状态
     *
     */
    deleteSubState() {
        if (this.saveSubStateAlready) {
            return;
        }
        this.saveSubStateAlready = true;
        this.lastSubState = this.subState;
        this.subState = _getFullSubState();

        this.lastDisabledCollision = this.disabledCollision;
        this.disabledCollision = true;

        this.lastDisabledScale = this.disabledScale;
        this.disabledScale = true;

        this.lastShow = this.show;
        this.show = true;
    }

    /**
     *设置子状态
     * @param {*} subState 状态位
     * @param {*} isAdd 是添加状态还是取消（默认为是）
     */
    setSubState(subState, isAdd = true) {
        if (this.disabledCollision || this.disabledScale) {
            this.lastSubState = isAdd ? this.lastSubState | subState : this.lastSubState & ~subState;
        } else {
            this.subState = isAdd ? this.subState | subState : this.subState & ~subState;
        }
    }

    resetSubState() {
        this.subState = _getFullSubState();
        // this.lastSubState = SubState.unknow;
    }

    // eslint-disable-next-line class-methods-use-this
    clearSubState() {
        // this.subState = SubState.unknow;
    }
}
