import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './common/ButtonTemplate';
// 导入全局状态-输入状态、输出状态，页面状态-可用性状态
import { RecoilState, useRecoilState, useSetRecoilState } from 'recoil';
import { InputState } from '../stores/input';
import { OutputState } from '../stores/output';
import { PageAllowState } from '../stores/allow';
import { StatesSet } from '../stores';

interface Props{
    className:string,
    action:string
}

interface HandlersSet{
    [index:string]:string
}

// 打开文件路径按钮组件
const FileButton=(props:Props)=>{
    // 声明不同按钮访问的全局状态和回调方法
    const states:StatesSet={
        OPEN:InputState,
        SAVE:OutputState
    }
    const handlers:HandlersSet={
        OPEN:'inputFile',
        SAVE:'outputFile'
    }
    // 根据按钮动作属性使用不同的全局状态
    const setPath=useSetRecoilState(states[props.action]);
    // 使用页面状态-可用性状态
    const [allow,setAllow]=useRecoilState(PageAllowState);
    // 点击事件回调函数
    function handleClick(){
        setAllow(false);
        (window.electronAPI)[handlers[props.action]]()
            .then((result:string[]|string)=>{
                setAllow(true);
                if(result !== undefined){
                    setPath(result);
                }
        });
    }
    return (
        <ButtonTemplate
            className={props.className}// 从属性接收CSS类名
            onClick={handleClick}
            allow={allow}// 按钮可用性与页面状态同步
            value={props.action}// 从属性接收动作属性作为按钮文本内容
        />
    );
}

export default FileButton;
