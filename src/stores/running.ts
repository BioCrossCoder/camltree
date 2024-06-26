import { selector } from 'recoil';
// 导入引用的全局状态
import { ConfigState } from './config';
import { InputState } from './input';
import { WorkFlowState } from './workflow';
import { OutputState } from './output';

// 定义衍生全局状态-运行参数
export const RunningState=selector({
    key:'run',
    get:({get})=>{
        return {
            workflow:get(WorkFlowState).join('->'),
            input:get(InputState),
            output:get(OutputState),
            ...get(ConfigState)
        };
    }
});
