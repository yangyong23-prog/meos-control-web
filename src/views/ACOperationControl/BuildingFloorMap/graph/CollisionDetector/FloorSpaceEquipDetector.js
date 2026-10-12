import { baseUtils } from '@yushu/three-base';
import Observable from '@/views/GraphMVC/core/Base/Observable';

const { Quadtree, rectCollisionCheck } = baseUtils;

const ICON_BOUND_OFFSET_V = 2.5; // icon 垂直方向偏移量
const ICON_BOUND_OFFSET_H = 2.5; // icon 水平方向偏移量
const TEXT_BOUND_OFFSET_V = 4; // text 垂直方向偏移量
const TEXT_BOUND_OFFSET_H = 2.5; // text 水平方向偏移量

export default class FloorSpaceEquipDetector extends Observable {
    constructor(renderingContext) {
        // 调用父类的构造函数
        super();
        // 初始化 renderingContext 属性
        this.renderingContext = renderingContext;
        // 设备图元映射(key -> model)
        this.equipCollisionMap = new Map();
        // 空间图元集合(model)
        this.spaceCollisionSet = new Set();
    }
    // 添加设备图元
    addEquipElement(element) {
        this.equipCollisionMap.set(element.key, element);
    }
    // 移除设备图元
    removeEquipElement(element) {
        this.equipCollisionMap.delete(element.key);
    }
    // 添加空间图元
    addSpaceElement(element) {
        this.spaceCollisionSet.add(element);
    }
    // 移除空间图元
    removeSpaceElement(element) {
        this.spaceCollisionSet.delete(element);
    }
    clearElements() {
        Array.from(this.equipCollisionMap.values()).forEach(obj => {
            obj.disabledCollision = false;
        });
        Array.from(this.spaceCollisionSet.values()).forEach(obj => {
            obj.disabledCollision = false;
        });
        this.equipCollisionMap.clear(); // 清空 equipCollisionMap
        this.spaceCollisionSet.clear(); // 清空 spaceCollisionSet
    }

    // ! 碰撞方法 -> 需要再业务层调用; priority: 显示优先级 'equip'设备优先 / 'space'空间优先
    collision(priority = 'equip') {
        this.priority = priority;
        const { canvasWidth, canvasHeight } = this.renderingContext;
        const myTree = new Quadtree({
            bounds: {
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight
            },
            maxObjects: 30,
            maxLevels: 10,
            getQuadrantIndex: FloorSpaceEquipDetector.getQuadrantIndex
        });
        // 1, 遍历刷树(设备图元)
        Array.from(this.equipCollisionMap.values()).forEach(Model => {
            if (!Model) return;
            Model.setAsyncState('collided', false);
            Model.setAsyncState('textCollided', false);

            const rectDetail = FloorSpaceEquipDetector.getEquipDetailRect(Model);
            const collisionObject = this.getAABBRect(Model, rectDetail);
            if (collisionObject) {
                myTree.insert(collisionObject);
            }
        });
        // 1, 遍历刷树(空间图元)
        Array.from(this.spaceCollisionSet.values()).forEach(Model => {
            if (!Model) return;
            Model.setAsyncState('collided', false);
            const rectDetail = FloorSpaceEquipDetector.getSpaceDetailRect(Model);
            const collisionObject = this.getAABBRect(Model, rectDetail);
            if (collisionObject) {
                myTree.insert(collisionObject);
            }
        });

        // 2, 树内防碰撞
        const treeLeafs = myTree.getTreeLeafs();
        treeLeafs.forEach(tree => {
            const { objects } = tree;
            FloorSpaceEquipDetector.doCollision(objects, priority);
        });
    }

    // 用于防碰撞计算 设备icon+text合并成一个整体AABB, 空间名称+环境参数(文字)作为一个整体AABB
    getAABBRect(Model, rectDetail, domScale) {
        const { bimLocation: _bim, infoLocation } = Model;
        const bimLocation = infoLocation ? infoLocation : _bim;
        const { iconRect, textRect } = rectDetail;
        if (!bimLocation) return null;
        const { canvasWidth, canvasHeight, camera } = this.renderingContext;
        const domHalfWidth = canvasWidth >>> 1;
        const domHalfHeight = canvasHeight >>> 1;

        // text 是定位上去的 所以需要有一个相对于icon的偏移
        let textOffset = 0;
        const pos = bimLocation.clone();
        pos.project(camera);
        const d2Pos = {
            x: Math.round(pos.x * domHalfWidth + domHalfWidth),
            y: Math.round(-pos.y * domHalfHeight + domHalfHeight)
        };

        // 收集icon与text各自的包围盒后合并成整体的AABB
        const emptyBound = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity
        };
        const bounds = [];

        // 获取icon的包围盒
        if (iconRect) {
            let { height, width } = iconRect;
            if (domScale) {
                height *= domScale;
                width *= domScale;
            }

            const halfW = width >>> 1,
                halfH = height >>> 1;

            textOffset = halfH; // 设备文字铺在icon下方 所以整体AABB向下延伸
            bounds.push({
                maxX: d2Pos.x + halfW + ICON_BOUND_OFFSET_H,
                minX: d2Pos.x - halfW - ICON_BOUND_OFFSET_H,
                maxY: d2Pos.y + halfH + ICON_BOUND_OFFSET_V,
                minY: d2Pos.y - halfH - ICON_BOUND_OFFSET_V
            });
        }

        // 获取文字的包围盒
        if (textRect) {
            let { height, width } = textRect;
            if (domScale) {
                height *= domScale;
                width *= domScale;
            }

            const halfW = width >>> 1;
            const halfH = height >>> 1;
            if (iconRect) {
                bounds.push({
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + textOffset + height + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y + textOffset + TEXT_BOUND_OFFSET_V
                });
            } else {
                textOffset = 4;
                bounds.push({
                    maxX: d2Pos.x + halfW + TEXT_BOUND_OFFSET_H,
                    minX: d2Pos.x - halfW - TEXT_BOUND_OFFSET_H,
                    maxY: d2Pos.y + textOffset + halfH + TEXT_BOUND_OFFSET_V,
                    minY: d2Pos.y + textOffset - halfH + TEXT_BOUND_OFFSET_V
                });
            }
        }

        // 合并成一个整体AABB
        const flatBound = bounds.reduce((acc, bound) => {
            return {
                minX: Math.min(acc.minX, bound.minX),
                maxX: Math.max(acc.maxX, bound.maxX),
                minY: Math.min(acc.minY, bound.minY),
                maxY: Math.max(acc.maxY, bound.maxY)
            };
        }, emptyBound);

        // 超出画布不参与碰撞
        // if (flatBound.maxX < 0 || flatBound.minX > domHalfWidth << 1 || flatBound.maxY < 0 || flatBound.minY > domHalfHeight << 1) {
        //     Model.setAsyncState('hide', true); // 超出画布 隐藏处理
        //     return null;
        // }

        return {
            maxX: flatBound.maxX,
            minX: flatBound.minX,
            maxY: flatBound.maxY,
            minY: flatBound.minY,
            model: Model,
            modelType: iconRect ? 'equip' : 'space'
        };
    }

    /**
     * 四叉树防碰撞 判断元素在四叉树的哪个象限 (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     * @param {*} pRect 带有坐标信息的元素
     * @param {*} quadrantMiddlePoint 当前四叉树的中心点
     * @returns {Set<Number>} (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
     */
    static getQuadrantIndex(pRect, quadrantMiddlePoint) {
        const indexes = new Set(),
            verticalMidpoint = quadrantMiddlePoint.y,
            horizontalMidpoint = quadrantMiddlePoint.x;

        const startIsNorth = pRect.minX < horizontalMidpoint,
            startIsWest = pRect.minY < verticalMidpoint,
            endIsSouth = pRect.maxX > horizontalMidpoint,
            endIsEast = pRect.maxY > verticalMidpoint;

        // top-right quad
        if (startIsNorth && endIsEast) {
            indexes.add(0);
        }
        // top-left quad
        if (startIsWest && startIsNorth) {
            indexes.add(1);
        }
        // bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.add(2);
        }
        // bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.add(3);
        }

        return indexes;
    }

    // 把对象整个碰掉
    static lose(obj) {
        obj.hidden = true;
        obj.model.setAsyncState('collided', true);
    }

    // ! 自定义的碰撞业务规则
    // 1. 设备与空间碰撞: 不优先的一方被碰掉
    // 2. 同类型碰撞: 第二个对象被碰掉
    static doCollision = (objects, priority) => {
        for (let i = 0; i < objects.length; i++) {
            const objA = objects[i];
            // eslint-disable-next-line no-continue
            if (objA.hidden) continue;
            for (let j = i + 1; j < objects.length; j++) {
                if (objA.hidden) continue;
                const objB = objects[j];
                if (objB.hidden) continue;
                // 检查两个整体AABB盒子是否碰撞
                if (rectCollisionCheck(objA, objB)) {
                    if (objA.modelType === objB.modelType) {
                        // 同类型碰撞 -> 第二个对象被碰掉
                        FloorSpaceEquipDetector.lose(objB);
                    } else if (priority === 'space') {
                        // 空间优先 -> 设备被碰掉
                        const equipObj = objA.modelType === 'equip' ? objA : objB;
                        FloorSpaceEquipDetector.lose(equipObj);
                    } else {
                        // 设备优先 -> 空间被碰掉
                        const spaceObj = objA.modelType === 'space' ? objA : objB;
                        FloorSpaceEquipDetector.lose(spaceObj);
                    }
                }
            }
        }
    };

    // 拆分设备图元的icon与文字宽高
    static getEquipDetailRect(equipIconInfo) {
        return {
            iconRect: equipIconInfo.getIconRect(),
            textRect: equipIconInfo.getTextRect()
        };
    }

    // 拆分空间图元的文字宽高
    static getSpaceDetailRect(spaceInfo) {
        return {
            textRect: spaceInfo.getTextRect()
        };
    }
}
