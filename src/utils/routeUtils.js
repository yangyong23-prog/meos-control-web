/**
 * 判断当前路由是否是 空间安防
 * @param {Object} route 当前路由快照
 * @returns
 */
const isSpaceSecuritySystem = (route = null) => {
    if (route?.name === 'space-security-control') {
        return true;
    }
    const path = route?.fullPath || location.pathname || '';
    const pathParts = path.split('/');
    return pathParts.includes('space-security-control');
};

export default {
    isSpaceSecuritySystem
};
