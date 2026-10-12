import { setRouteEmitter } from '@/utils/route-listener';

function setupPageGuard(router) {
    router.beforeEach(async to => {
        // emit route change
        setRouteEmitter(to);
    });
}

export default function createRouteGuard(router) {
    setupPageGuard(router);
}
