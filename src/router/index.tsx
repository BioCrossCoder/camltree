import { Page as MainPage } from '../pages/Main';
import { Page as StartPage } from '../pages/Start';
import { Page as SettingsPage } from '../pages/Settings';
import { Page as GuidePage } from '../pages/Guide';
import { Page as ProgressPage } from '../pages/Progress';
import { useMemo } from 'react';

// 缓存主页面
const MainPageCache=()=>useMemo(()=><MainPage/>,[]);
// 缓存运行页面
const StartPageCache=()=>useMemo(()=><StartPage/>,[]);
// 缓存配置页面
const SettingsPageCache=()=>useMemo(()=><SettingsPage/>,[]);
// 缓存指南页面
const GuidePageCache=()=>useMemo(()=><GuidePage/>,[]);
// 缓存进度页面
const ProgressPageCache=()=>useMemo(()=><ProgressPage/>,[]);

// 路由配置
export const routes=[
    // 主页面
    {
        path:'/',
        element:<MainPageCache/>
    },
    // 运行页面
    {
        path:'/start',
        element:<StartPageCache/>
    },
    // 设置页面
    {
        path:'/set',
        element:<SettingsPageCache/>
    },
    // 指南页面
    {
        path:'/guide',
        element:<GuidePageCache/>
    },
    // 进度页面
    {
        path:'/progress',
        element:<ProgressPageCache/>
    },
];
