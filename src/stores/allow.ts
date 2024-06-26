import {atom} from 'recoil';

// 定义页面状态-交互组件可用性
export const PageAllowState=atom({
    key:'allow',
    default:true
});
