import React,{ useState,useRef,useEffect } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入顶部行容器组件
import HeaderLine from './common/HeaderLine';
// 导入帮助按钮组件
import HelpButton from './common/HelpButton';
// 导入帮助文本组件
import HelpText from './common/HelpText';
// 导入文本区域模板组件
import TextareaTemplate from './common/TextareaTemplate';
// 导入输入按钮组件
import InputButton from './common/InputButton';
// 导入全局状态，页面状态-可用性状态
import { useRecoilValue } from 'recoil';
import { States } from '../stores';
import { PageAllowState } from '../stores/allow';

interface Props{
    title:string,
    help:string,
    buttonClass:string
}

// 工具参数块组件
const ToolArgv=(props:Props)=>{
    // 带布局样式的容器
    const Container=styled.div`
        height:max(125px,20vh);
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
    `;
    // 按钮样式
    const buttonClass=css`
        align-self:flex-end;
        margin-right:1vw;
        margin-top:max(6px,1.5vh);
    `;
    // 初始化帮助文本显示状态
    const [showHelp,setShow]=useState(false);
    // 根据标题属性使用不同的参数状态
    const argvState=useRecoilValue(States[props.title]);
    // 注册参数文本块元素引用
    const argvRef=useRef(null);
    // 初始化参数文本块使用状态
    const [input,setInput]=useState(false);
    const allow=useRecoilValue(PageAllowState);
    const using:boolean=allow||input;
    // 根据参数文本块使用状态动态生成输入按钮动作属性
    const inputButtonAction:string=input?'OK':'MODIFY';
    // 当参数文本块使用状态改变时
    useEffect(()=>{
        if(input){
            // 当状态变为使用中时自动聚焦
            (argvRef.current as unknown as HTMLTextAreaElement).focus();
            // 自动聚焦时光标移动到文本框内容末尾
            (argvRef.current as unknown as HTMLTextAreaElement).selectionStart=-1;
        }
    },[input]);
    return (
        <Container>
            {/* 顶部行容器组件 */}
            <HeaderLine
                title={props.title}// 从属性接收标题内容
                content={
                    <>
                        {/* 帮助按钮组件 */}
                        <HelpButton
                            onClick={()=>setShow(!showHelp)}// 点击事件回调设置为修改帮助文本显示状态
                        />
                        {/* 帮助文本组件 */}
                        <HelpText
                            content={props.help}// 从属性接收帮助文本内容
                            show={showHelp}// 帮助文本显示状态
                        />
                    </>
                }
            />
            {/* 参数文本块 */}
            <TextareaTemplate
                allow={using}// 可用性状态
                work={input}// 传入使用状态决定是否只读
                ref={argvRef}// 绑定转发元素引用
                value={argvState as string}// 文本块内容
                hint='Line breaks are not allowed'// 提示文本内容
            />
            {/* 输入按钮组件 */}
            <InputButton
                className={[buttonClass,props.buttonClass].join(' ')}// 继承属性传入的CSS类名
                onClick={()=>setInput(!input)}// 点击事件回调设置为修改参数文本块使用状态
                allow={using}// 可用性状态
                action={inputButtonAction}
                target={argvRef}// 访问的元素引用
                title={props.title}// 从属性接收标题属性
                state={props.title}// 标题属性作为按钮访问的全局状态标识
            />
        </Container>
    );
}

export default ToolArgv;
