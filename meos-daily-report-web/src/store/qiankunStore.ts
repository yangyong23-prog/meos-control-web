/**
 * 乾坤微前端 Props Store
 * 用于保存主应用传入的 props
 */

interface QiankunProps {
    container?: HTMLElement;
    microBasePath?: string;
    setGlobalState?: (state: any) => void;
    onGlobalStateChange?: (callback: (state: any, prev: any) => void) => void;
    [key: string]: any;
}

class QiankunStore {
    private props: QiankunProps | null = null;

    /**
     * 设置 props
     */
    setProps(props: QiankunProps) {
        this.props = props;
    }

    /**
     * 获取 props
     */
    getProps(): QiankunProps | null {
        return this.props;
    }

    /**
     * 调用主应用的 setGlobalState
     */
    setGlobalState(state: any) {
        if (this.props?.setGlobalState) {
            this.props.setGlobalState(state);
        } else {
            console.warn('setGlobalState is not available');
        }
    }

    /**
     * 监听全局状态变化
     */
    onGlobalStateChange(callback: (state: any, prev: any) => void) {
        if (this.props?.onGlobalStateChange) {
            this.props.onGlobalStateChange(callback);
        }
    }

    /**
     * 清空 props
     */
    clear() {
        this.props = null;
    }
}

export const qiankunStore = new QiankunStore();
