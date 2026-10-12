// 图形全局接口

const modelMediaTable = new Map();

const DefaultMediaFactory = (MediaClass, args) => {
    const _args = args || [];
    return new MediaClass(..._args);
};

export const registerMedia = (name, mediaClass, factory = DefaultMediaFactory) => {
    if (name === undefined || name === null) return;
    modelMediaTable.set(name, { mediaClass, factory });
};
export const genMediaInstance = (name, args) => {
    if (name === undefined || name === null) return;
    const val = modelMediaTable.get(name);
    if (val) {
        const { mediaClass, factory } = val;
        return factory(mediaClass, args);
    }
};
