class Log {
    private static console = true;
    log(title: string, text: string) {
        if (!Log.console) return;
        if (import.meta.env.MODE === 'production') return;
        const color = '#ff4d4f';
        console.log(
            `%c ${title} %c ${text} %c`,
            `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
            `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
            'background:transparent'
        );
    }
    closeConsole() {
        Log.console = false;
    }
}
export class EventDispatcher extends Log {
    private listeners: { [type: string]: Function[] } = {};

    addEventListener(type: string, listener: Function) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        if (this.listeners[type].indexOf(listener) === -1) {
            this.listeners[type].push(listener);
        }
    }

    removeEventListener(type: string, listener?: Function) {
        if (listener) {
            const index = this.listeners[type]?.indexOf(listener);
            if (index >= 0) {
                this.listeners[type].splice(index, 1);
            }
        } else {
            this.listeners[type] = [];
        }
    }

    dispatchEvent(type: string, data: any) {
        const listenerArray = this.listeners[type] || [];
        if (listenerArray.length === 0) return;
        listenerArray.forEach(listener => {
            listener.call(this, data);
        });
    }
}

export class DataObserve extends Log {
    private listeners: Function[] = [];
    response(listener: (data: any, instance: DataObserve) => void) {
        if (listener instanceof Function) {
            this.listeners.push(listener);
        }
    }
    dispatch(data: any, instance: any) {
        if (this.listeners.length === 0) return;
        // Make a copy, in case listeners are removed while iterating.
        const array = this.listeners.slice(0);
        for (let i = 0, l = array.length; i < l; i++) {
            array[i].call(this, data, instance);
        }
    }
    dispose() {
        this.listeners = [];
    }
}
