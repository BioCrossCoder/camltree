import React,{ useState, useRef, useEffect } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入帮助按钮组件
import HelpButton from './common/HelpButton';
// 导入帮助文本组件
import HelpText from './common/HelpText';
// 导入打开文件路径按钮组件
import FileButton from './FileButton';
// 导入文本区域模板组件
import TextareaTemplate from './common/TextareaTemplate';
// 导入输入按钮组件
import InputButton from './common/InputButton';
// 导入顶部行容器组件
import HeaderLine from './common/HeaderLine';
// 导入全局状态-输入状态、输出状态，页面状态-可用性状态
import { useRecoilValue } from 'recoil';
import { InputState } from '../stores/input';
import { OutputState } from '../stores/output';
import { PageAllowState } from '../stores/allow';

interface Props{
    title:string,
    help:string,
    buttonClass:string
}

// 文件路径块组件
const FilePath=(props:Props)=>{
    // 带布局样式的容器
    const Container=styled.div`
        height:max(180px,27vh);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
    `;
    // 带布局样式的底部容器
    const Footer=styled.footer`
        height:max(32px,8vh);
        width:max(185px,45vh);
        display:flex;
        align-items:center;
        justify-content:space-between;
        align-self:flex-end;
        margin-right:1vw;
    `;
    // 帮助文本宽度
    const helpWidth=css`
        width:93vw;
    `;
    // 初始化帮助文本显示状态
    const [showHelp,setShow]=useState(false);
    // 注册帮助文本组件转发元素引用
    const helpRef=useRef(null);
    // 初始化路径文本块高度状态
    const [pathHeight,setHeight]=useState(window.innerHeight*0.14);
    // 当帮助文本显示状态改变时
    useEffect(()=>{
        // 调整路径文本块高度
        setHeight(window.innerHeight*0.14 - (helpRef.current as unknown as HTMLParagraphElement).offsetHeight);
    },[showHelp]);
    // 根据全局状态生成路径文本块内容
    let pathState;
    if(props.title.startsWith('INPUT')){
        pathState=useRecoilValue(InputState);
    }else{
        pathState=useRecoilValue(OutputState);
    }
    let pathItems:string='';
    if(Array.isArray(pathState)){
        pathItems=pathState.join('\n');
    }else{
        pathItems=pathState;
    }
    // 注册路径文本块元素引用
    const pathRef=useRef(null);
    // 初始化路径文本块使用状态
    const [input,setInput]=useState(false);
    // 当路径文本块使用状态改变时
    useEffect(()=>{
        if(input){
            // 当状态变为使用中时自动聚焦
            (pathRef.current as unknown as HTMLTextAreaElement).focus();
            // 自动聚焦时光标移动到文本框内容末尾
            (pathRef.current as unknown as HTMLTextAreaElement).selectionStart=-1;
        }
    },[input]);
    // 根据路径文本块使用状态动态生成输入按钮动作属性
    const inputButtonAction:string=input?'OK':'MODIFY';
    // 根据页面状态和路径文本块使用状态衍生输入按钮和路径文本块可用性状态
    const allow=useRecoilValue(PageAllowState);
    const using:boolean=allow||input;
    return (
        <Container>
            {/* 顶部行容器组件 */}
            <HeaderLine
                title={props.title}// 从属性接收标题内容
                content={
                    // 帮助按钮组件
                    <HelpButton
                        onClick={()=>setShow(!showHelp)}// 点击事件回调设置为修改帮助文本显示状态
                    />
                }
            />
            {/* 帮助文本组件 */}
            <HelpText
                content={props.help}// 从属性接收帮助文本内容
                show={showHelp}// 帮助文本显示状态
                ref={helpRef}// 绑定转发元素引用
                width={helpWidth}// 宽度随视窗宽度响应式改变
            />
            {/* 路径文本块 */}
            <TextareaTemplate
                allow={using}// 可用性状态
                work={input}// 传入使用状态决定是否只读
                ref={pathRef}// 绑定转发元素引用
                style={{height:pathHeight}}// 动态生成文本块高度
                value={pathItems}// 文本块内容
                hint={'Blanks are not allowed in the paths, for example:\nD:\\test-data\\seq.fa is legal\nD:\\test data\\seq.fa is illegal'}// 提示文本内容
            />
            <Footer>
                {/* 打开文件路径按钮组件 */}
                <FileButton
                    className={props.buttonClass}// 从属性接收按钮样式
                    action={props.title.startsWith('INPUT')?'OPEN':'SAVE'}// 根据标题属性决定按钮动作
                />
                {/* 输入按钮组件 */}
                <InputButton
                    className={props.buttonClass}// 从属性接收按钮样式
                    onClick={()=>setInput(!input)}// 点击事件回调设置为修改路径文本块使用状态
                    action={inputButtonAction}
                    target={pathRef}// 访问的元素引用
                    title={props.title}// 从属性接收标题属性
                    state={props.title.split(' ')[0]}//从标题属性截取按钮访问的全局状态标识
                    allow={using}// 可用性状态
                />
            </Footer>
        </Container>
    );
}

export default FilePath;
