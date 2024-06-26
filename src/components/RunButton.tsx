import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './common/ButtonTemplate';
// 导入全局状态-运行状态，页面状态-可用性状态
import { useRecoilState, useRecoilValue } from 'recoil';
import { RunningState } from '../stores/running';
import { PageAllowState } from '../stores/allow';

interface Props{
    className:string
}

// 运行按钮组件
const RunButton=(props:Props)=>{
    // 获取运行参数
    const runningArgv=useRecoilValue(RunningState);
    // 使用页面状态-可用性状态
    const [allow,setAllow]=useRecoilState(PageAllowState);
    // 点击事件回调函数
    function handleClick(){
        setAllow(false);
        window.electronAPI.submitTask(runningArgv).then(()=>setAllow(true));
    }
    return (
        <ButtonTemplate
            value='RUN'// 按钮文本内容
            className={props.className}// 从属性接收CSS类名
            onClick={handleClick}
            allow={allow}// 按钮可用性与页面状态同步
        />
    );
}

export default RunButton;
