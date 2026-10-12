import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import routes from './routes';

import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

let router;

const getRouter = base => {
    if (router) return router;
    router = createRouter({
        history: createWebHistory(base),
        routes: [
            {
                path: '/',
                redirect: routes[0].path
            },
            ...routes
        ],
        scrollBehavior() {
            return { top: 0 };
        }
    });

    // 路由拦截
    createRouteGuard(router);
    return router;
};

export default getRouter;
