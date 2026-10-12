import { createBrowserRouter, Navigate, useLocation, useMatches, Outlet } from 'react-router-dom';
import App from '@/app/App';
import TestPage from '@/app/test';
import { useEffect } from 'react';

/**
 * 路由标题守卫组件
 * 监听路由变化，设置浏览器 tab 标题
 */
const RouteTitleGuard = () => {
    const location = useLocation();
    const matches = useMatches();

    useEffect(() => {
        // 从匹配的路由中获取 title
        let title = '运行复盘报告'; // 默认标题

        // 遍历匹配的路由，找到最近的 title
        for (let i = matches.length - 1; i >= 0; i--) {
            const match = matches[i];
            const handle = match.handle as { title?: string } | undefined;
            if (handle?.title) {
                title = handle.title;
                break;
            }
        }

        document.title = title;
    }, [location, matches]);

    return <Outlet />;
};

/**
 * 路由配置
 */
export const createRouter = (basename?: string) => {
    const router = createBrowserRouter(
        [
            {
                element: <RouteTitleGuard />,
                children: [
                    {
                        path: '/',
                        element: <Navigate to="/info" replace />
                    },
                    {
                        path: '/info',
                        element: <App />,
                        handle: {
                            title: '运行复盘报告'
                        }
                    },
                    {
                        path: '/test',
                        element: <TestPage />,
                        handle: {
                            title: '测试页面'
                        }
                    }
                ]
            }
        ],
        {
            basename: basename || '/'
        }
    );

    return router;
};
