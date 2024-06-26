import { atom } from "recoil";

// 定义全局状态-分析策略
export const AnalysisStrategyState=atom({
    key:'strategy',
    default:'Concatenation'
});
