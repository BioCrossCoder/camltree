import { atom, selector } from "recoil";

// 定义任务记录类型
export interface TaskRecord{
    (index:string):string
}
// 定义全局状态-活跃任务记录
export const ActiveTaskState=atom({
    key:'active',
    default:[] as string[]
});
// 定义全局状态-成功任务记录
export const SuccessTaskState=atom({
    key:'success',
    default:[] as string[]
});
// 定义全局状态-失败任务记录
export const FailureTaskState=atom({
    key:'failure',
    default:{} as TaskRecord
});
// 定义全局状态-任务计数
export const TaskCount=selector({
    key:'task',
    get:({get})=>{
        const active:number=get(ActiveTaskState).length;
        const success:number=get(SuccessTaskState).length;
        const failure:number=Object.keys(get(FailureTaskState)).length;
        const total:number=active+success+failure;
        return {
            total,
            active,
            success,
            failure
        };
    }
});
