/**
 * opt W3：简单的请求结果缓存（按 key 共享同一个 Promise，带过期时间）。
 * 失败或返回码不是成功时不缓存，下次重新请求。
 */
import { SUCCESSCODE } from '@/utils/globalVariables';

export const createPromiseCache = ({ ttlMs = 5 * 60 * 1000, max = 500 } = {}) => {
    const store = new Map();
    const get = (key, loader) => {
        const now = Date.now();
        const hit = store.get(key);
        if (hit && hit.expireAt > now) return hit.promise;
        if (store.size >= max) store.delete(store.keys().next().value);
        const promise = Promise.resolve()
            .then(loader)
            .then(res => {
                if (res?.code !== SUCCESSCODE) store.delete(key);
                return res;
            })
            .catch(err => {
                store.delete(key);
                throw err;
            });
        store.set(key, { promise, expireAt: now + ttlMs });
        return promise;
    };
    return { get, clear: () => store.clear() };
};
