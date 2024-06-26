import {atom} from 'recoil';

// 定义步骤进度类型
export interface StepProgress{
    (index:string):[number,number]
}
// 定义任务进度类型
export interface TaskProgress{
    (index:string):StepProgress
}
// 定义全局状态-任务进度
export const TaskProgressState=atom({
    key:'progress',
    default:{} as TaskProgress
});
