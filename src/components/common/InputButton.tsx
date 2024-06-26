import React, { Ref, RefObject } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './ButtonTemplate';
// 导入全局状态，页面状态-可用性状态
import { useSetRecoilState } from 'recoil';
import { States } from '../../stores';
import { PageAllowState } from '../../stores/allow';

interface Props{
    className:string,
    onClick:Function,
    action:string,
    target:Ref<HTMLElement>,
    title:string,
    state:string,
    allow:boolean
}

// 输入按钮组件
const InputButton=(props:Props)=>{
    // 根据接收属性使用不同的全局状态
    const setValue=useSetRecoilState(States[props.state]);
    // 使用页面状态-可用性状态
    const setAllow=useSetRecoilState(PageAllowState);
    // 点击事件回调函数
    function handleClick(){
        if(props.action === 'MODIFY'){
            setAllow(false);
        }else{
            // 用目标文本块的内容更新全局状态
            const textContent:string=((props.target as RefObject<HTMLElement>).current as HTMLTextAreaElement).value;
            const newState=(props.state === 'INPUT')?(textContent.split('\n')):textContent;
            setValue(newState);
            setAllow(true);
        }
        // 修改目标文本区域使用状态
        props.onClick();
    }
    return (
        <ButtonTemplate
            className={props.className}// 从属性接收CSS类名
            onClick={handleClick}
            allow={props.allow}// 从属性接收按钮可用性状态
            value={props.action}// 根据动作属性动态渲染按钮文本内容
        />
    );
}

export default InputButton;
