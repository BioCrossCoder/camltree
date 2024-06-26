import { atom } from "recoil";

// 定义输出目录列表类型
export interface OutputDirList{
    (index:string):string
}
// 定义全局状态-输出目录列表
export const OutputDirState=atom({
    key:'directory',
    default:{} as OutputDirList
});
