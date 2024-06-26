import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入全局状态-任务进度、各类任务记录、任务计数、列表展开项、输出目录列表
import { useRecoilState, useRecoilValue } from 'recoil';
import { TaskProgress, TaskProgressState } from '../stores/progress';
import { TaskRecord, ActiveTaskState, SuccessTaskState, FailureTaskState, TaskCount } from '../stores/task';
import { UnfoldItemState } from '../stores/unfold';
// 导入任务进度列表组件
import TaskProgressList from '../components/TaskProgressList';
import { OutputDirList, OutputDirState } from '../stores/directory';

// 进度页面
export const Page=()=>{
    // 带布局的容器
    const Container=styled.div`
        min-width:450px;
    `;
    // 标题组件
    const Title=styled.header`
        height:30px;
        line-height:30px;
        background-color:rgba(255,255,255,0.8);
        font-size:25px;
        font-weight:bold;
        padding-left:2vw;
        padding-top:1vh;
        padding-bottom:1vh;
        margin-bottom:max(10px,2vh);
    `;
    // 活跃任务文本样式
    const activeTaskFont=css`
        color:blue;
    `;
    // 成功任务文本样式
    const successTaskFont=css`
        color:green;
    `;
    // 失败任务文本样式
    const failureTaskFont=css`
        color:red;
    `;
    // 使用全局状态-任务进度、各类任务记录、任务计数、列表展开项、输出目录列表
    const [taskProgress,setProgress]=useRecoilState(TaskProgressState);
    const [activeTasks,setActive]=useRecoilState(ActiveTaskState);
    const [successTasks,setComplete]=useRecoilState(SuccessTaskState);
    const [failureTasks,setError]=useRecoilState(FailureTaskState);
    const taskCount=useRecoilValue(TaskCount);
    const [unfoldItems,setUnfold]=useRecoilState(UnfoldItemState);
    const [outputDirList,setOutputDirList]=useRecoilState(OutputDirState);
    // 接收到任务提交时更新全局状态
    window.electronAPI.onTaskSubmit((_event:Event,taskInfo:[string,string])=>{
        const [taskID,taskOutput]=taskInfo;
        setOutputDirList({...outputDirList,[taskID]:taskOutput} as OutputDirList);
        setActive([...activeTasks,taskID]);
        setUnfold([...unfoldItems,taskID]);
    });
    // 将主进程转发的任务进度更新同步到界面
    window.electronAPI.onTaskUpdate((_event:Event,value:TaskProgress)=>{
        setProgress({...taskProgress,...value} as TaskProgress);
    });
    // 接收到任务出错报告时更新全局状态并反馈到界面
    window.electronAPI.onTaskError((_event:Event,value:TaskRecord)=>{
        setActive(activeTasks.filter((item:string)=>item !== Object.keys(value)[0]));
        setError({...failureTasks,...value} as TaskRecord);
    });
    // 接收到任务完成时更新全局状态
    window.electronAPI.onTaskComplete((_event:Event,taskID:string)=>{
        setActive(activeTasks.filter((item:string)=>item !== taskID));
        setComplete([...successTasks,taskID]);
        setUnfold(unfoldItems.filter((item:string)=>item !== taskID));
    });
    return (
        <Container>
            {/* 任务进度提示标题栏 */}
            <Title>
                {/* 任务总数 */}
                {taskCount.total} tasks:
                {/* 活跃任务计数 */}
                <span className={activeTaskFont}> {taskCount.active} active</span>
                {/* 成功任务计数 */}
                <span className={successTaskFont}> {taskCount.success} success</span>
                {/* 失败任务计数 */}
                <span className={failureTaskFont}> {taskCount.failure} failure</span>
            </Title>
            {/* 任务进度列表 */}
            <TaskProgressList/>
        </Container>
    );
}
