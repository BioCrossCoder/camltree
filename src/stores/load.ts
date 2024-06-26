import {atom} from 'recoil';

// 定义全局状态-应用加载状态
export const LoadState=atom({
    key:'load',
    default:false
});
