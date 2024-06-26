import { atom } from "recoil";

// 定义全局状态-列表展开项
export const UnfoldItemState=atom({
    key:'unfold',
    default:[] as string[]
});
