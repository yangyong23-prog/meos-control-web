import { shallowRef, isVNode } from 'vue';
import type { ComponentInternalInstance, VNode, VNodeChild, VNodeNormalizedChildren } from 'vue';

export type VNodeChildAtom = Exclude<VNodeChild, Array<any>>;
export type RawSlots = Exclude<VNodeNormalizedChildren, Array<any> | null | string>;
export type FlattenVNodes = Array<VNodeChildAtom | RawSlots>;

export const flattedChildren = (children: FlattenVNodes | VNode | VNodeNormalizedChildren, reachTo?: Function | undefined): FlattenVNodes => {
    const vNodes = Array.isArray(children) ? children : [children];
    const result: FlattenVNodes = [];

    if (reachTo && isVNode(children) && reachTo(children)) {
        result.push(children);
        return result;
    }
    // console.log('vNodes: ', vNodes);
    vNodes.forEach(child => {
        if (reachTo && isVNode(child) && reachTo(child)) {
            result.push(child);
            return result;
        }
        if (Array.isArray(child)) {
            result.push(...flattedChildren(child, reachTo));
        } else if (isVNode(child) && Array.isArray(child.children)) {
            // console.log('child: ', child);
            result.push(...flattedChildren(child.children, reachTo));
        } else {
            result.push(child);
            if (isVNode(child) && child.component?.subTree) {
                result.push(...flattedChildren(child.component.subTree, reachTo));
            }
        }
    });
    return result;
};

const getOrderedChildren = <T>(vm: ComponentInternalInstance, childComponentName: string, children: Record<number, T>): T[] => {
    const nodes = flattedChildren(vm.subTree, (n: any) => isVNode(n) && (n.type as any)?.name === childComponentName && !!n.component).filter(
        (n): n is VNode => isVNode(n) && (n.type as any)?.name === childComponentName && !!n.component
    );
    const uids = nodes.map(n => n.component!.uid);
    return uids.map(uid => children[uid]).filter(p => !!p);
};

export const useOrderedChildren = <T extends { uid: number }>(vm: ComponentInternalInstance, childComponentName: string) => {
    const children: Record<number, T> = {};
    const orderedChildren = shallowRef<T[]>([]);

    const addChild = (child: T) => {
        children[child.uid] = child;
        orderedChildren.value = getOrderedChildren(vm, childComponentName, children);
    };
    const removeChild = (uid: number) => {
        delete children[uid];
        orderedChildren.value = orderedChildren.value.filter(children => children.uid !== uid);
    };

    return {
        children: orderedChildren,
        addChild,
        removeChild
    };
};
