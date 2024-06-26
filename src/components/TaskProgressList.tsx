import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入antd组件-折叠面板、插入符号图标
import { Collapse } from 'antd';
import { CaretRightFilled } from '@ant-design/icons';
// 导入全局状态-任务进度、各类任务记录、列表展开项、输出目录列表
import { useRecoilState, useRecoilValue } from 'recoil';
import { TaskProgressState, StepProgress } from '../stores/progress';
import { ActiveTaskState, SuccessTaskState } from '../stores/task';
import { UnfoldItemState } from '../stores/unfold';
import { OutputDirState } from '../stores/directory';
// 导入任务步骤进度组件
import TaskStepProgress from './TaskStepProgress';

// 任务进度列表组件
const TaskProgressList=()=>{
    // 列表样式
    const listStyle=css`
        background-color:white;
        font-size:20px;
    `;
    // 标签样式
    const labelStyle=css`
        font-weight:bold;
        :hover{
            color:blue;
            cursor:pointer;
        }
    `;
    // 步骤栏组件
    const Steps=styled.ul`
        font-size:20px;
        line-height:20px;
        padding:0;
        margin:0;
        margin-left:2vw;
        margin-right:calc(10px + 1vw);
    `;
    // 使用全局状态-任务进度、各类任务记录、列表展开项、输出目录列表
    const taskProgress=useRecoilValue(TaskProgressState);
    const activeTasks=useRecoilValue(ActiveTaskState);
    const successTasks=useRecoilValue(SuccessTaskState);
    const [unfoldItems,setUnfold]=useRecoilState(UnfoldItemState);
    const outputDirList=useRecoilValue(OutputDirState);
    // 修改列表项折叠状态方法
    function changeFold(taskID:string):void{
        if(unfoldItems.includes(taskID)){
            setUnfold(unfoldItems.filter((item:string)=>item !== taskID));
        }else{
            setUnfold([...unfoldItems,taskID]);
        }
    }
    // 打开任务输出目录方法
    function openOutputDir(taskID:string):void{
        const path:string=(outputDirList as any)[taskID];
        window.electronAPI.openDirectory(path);
    }
    return (
        <Collapse
            className={listStyle}// 列表样式
            collapsible='icon'// 点击箭头按钮可展开或折叠列表项
            activeKey={unfoldItems}// 展开项与全局状态绑定
            expandIcon={(panelProps)=>{
                return (
                    <CaretRightFilled
                        onClick={()=>changeFold((panelProps as any).panelKey)}// 点击箭头展开或折叠列表项
                        rotate={panelProps.isActive?-90:90}// 根据展开状态旋转箭头
                        style={{fontSize:20}}// 设置箭头尺寸
                    />
                );
            }}
            expandIconPosition='end'// 设置展开箭头位置在行末
            // 根据任务进度状态渲染任务列表
            items={Object.entries(taskProgress).map((value:[string,StepProgress])=>{
                // 提取任务编号和任务进度
                const taskID:string=value[0];
                const taskProgress:StepProgress=value[1];
                // 从全局状态中获取当前任务状态
                let taskStatus:string;
                if(activeTasks.includes(taskID)){
                    taskStatus='active';
                }else{
                    taskStatus=successTasks.includes(taskID)?'success':'failure';
                }
                return {
                    key:taskID,// 任务编号作为键
                    label:<span 
                        onClick={()=>openOutputDir(taskID)}// 点击标签打开任务输出目录
                        className={labelStyle}// 设置鼠标悬浮和文本样式
                        title='Open the output directory'// 鼠标悬浮提示文本
                    >
                        {/* 标签文本展示任务编号和任务状态 */}
                        Task {taskID} ({taskStatus})
                    </span>,
                    children:<Steps>
                        {/* 列表渲染任务各步骤进度项 */}
                        {Object.entries(taskProgress).map((item:[string,[number,number]])=>{
                            // 从列表项中提取步骤名称和进度
                            const [step,progress]=item;
                            return (
                                <TaskStepProgress
                                    name={step}// 任务步骤名称
                                    id={taskID}// 任务编号
                                    value={progress}// 任务步骤进度
                                    key={step}
                                />
                            );
                        })}
                    </Steps>
                };
            })}
        />
    );
}

export default TaskProgressList;
