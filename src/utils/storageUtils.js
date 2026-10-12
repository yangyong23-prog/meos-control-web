/**
 * localStorage 存储工具
 * 支持添加项目前缀，避免不同项目间的 key 冲突
 */

import baseStore from '@/store/baseStore';

/**
 * 获取存储前缀（从 store 中的 productType 获取）
 * @returns {string} - 存储前缀
 */
const getStoragePrefix = () => {
    const base = baseStore();
    return base.productType || 'meos';
};

/**
 * 获取存储的完整 key
 * @param {string} key - 原始 key
 * @param {boolean} usePrefix - 是否使用前缀
 * @returns {string} - 完整 key
 */
const getFullKey = (key, usePrefix) => {
    if (!usePrefix) return key;
    const prefix = getStoragePrefix();
    return `${prefix}:${key}`;
};

/**
 * 获取 localStorage 中的值
 * @param {string} key - 存储的 key
 * @param {boolean} usePrefix - 是否使用项目前缀，默认 true
 * @returns {string | null} - 存储的值，如果不存在则返回 null
 */
const getItem = (key, usePrefix = true) => {
    const fullKey = getFullKey(key, usePrefix);
    return localStorage.getItem(fullKey);
};

/**
 * 设置 localStorage 中的值
 * @param {string} key - 存储的 key
 * @param {string} value - 存储的值
 * @param {boolean} usePrefix - 是否使用项目前缀，默认 true
 */
const setItem = (key, value, usePrefix = true) => {
    const fullKey = getFullKey(key, usePrefix);
    localStorage.setItem(fullKey, value);
};

/**
 * 移除 localStorage 中的值
 * @param {string} key - 存储的 key
 * @param {boolean} usePrefix - 是否使用项目前缀，默认 true
 */
const removeItem = (key, usePrefix = true) => {
    const fullKey = getFullKey(key, usePrefix);
    localStorage.removeItem(fullKey);
};

/**
 * 获取 localStorage 中的 JSON 对象
 * @param {string} key - 存储的 key
 * @param {boolean} usePrefix - 是否使用项目前缀，默认 true
 * @returns {any | null} - 解析后的对象，如果不存在或解析失败则返回 null
 */
const getJSON = (key, usePrefix = true) => {
    const value = getItem(key, usePrefix);
    if (value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error(`Failed to parse JSON from localStorage key: ${key}`, e);
            return null;
        }
    }
    return null;
};

/**
 * 设置 localStorage 中的 JSON 对象
 * @param {string} key - 存储的 key
 * @param {any} value - 要存储的对象
 * @param {boolean} usePrefix - 是否使用项目前缀，默认 true
 */
const setJSON = (key, value, usePrefix = true) => {
    const fullKey = getFullKey(key, usePrefix);
    localStorage.setItem(fullKey, JSON.stringify(value));
};

export { getItem, setItem, removeItem, getJSON, setJSON, getStoragePrefix };
