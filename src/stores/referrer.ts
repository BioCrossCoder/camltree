import { atom } from "recoil";

// 定义全局状态-页面来源
export const PreviousPageState=atom({
    key:'referrer',
    default:''
});
