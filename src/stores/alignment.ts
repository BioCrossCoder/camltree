import { atom } from "recoil";

// 定义全局状态-序列对齐方法
export const SequenceAlignmentState=atom({
    key:'alignment',
    default:'MAFFT'
});
