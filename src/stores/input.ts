import {atom} from 'recoil';

// 定义全局状态-输入文件列表
export const InputState=atom({
    key:'input',
    default:[] as string[]
});
