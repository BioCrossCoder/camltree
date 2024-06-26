import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入antd组件-进度条
import { Progress } from 'antd';
// 导入全局状态-失败任务记录
import { useRecoilValue } from 'recoil';
import { FailureTaskState } from '../stores/task';

interface Props{
    name:string,
    id:string
    value:[number,number]
}

// 任务步骤进度组件
const TaskStepProgress=(props:Props)=>{
    // 使用全局状态-失败任务记录
    const failureTasks=useRecoilValue(FailureTaskState);
    // 根据传入属性获取当前步骤进度
    const [finished,total]=props.value;
    return (
        <div>
            {/* 任务步骤名称 */}
            {props.name}
            {/* 该步骤子任务完成进度 */}
            ({finished}/{total})
            {/* 该步骤进度 */}
            <Progress 
                percent={Number((finished/total*100).toFixed(2))}// 步骤进度百分比
                status={(()=>{
                    // 定义任务状态类型
                    type Status='active'|'success'|'normal'|'exception';
                    // 根据子任务完成数计算当前步骤状态
                    let status:Status=(finished === total)?'success':'active';
                    // 根据全局状态修正当前步骤状态
                    if(props.id in failureTasks){
                        if((failureTasks as any)[props.id] === props.name){
                            status='exception';
                        }else if(status === 'active'){
                            status='normal';
                        }
                    }
                    return status;
                })()}
            />
        </div>
    );
}

export default TaskStepProgress;
