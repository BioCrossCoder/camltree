import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入文本段落模板组件
import ParagraphTemplate from './ParagraphTemplate';

interface Props{
    content:string,
    show:boolean,
    width?:number|string
}

// 帮助文本组件
const HelpText=React.forwardRef((props:Props,ref)=>{
    // 文本样式
    const textClass=css`
        border:white 1px solid;
        padding-left:1vw;
        padding-right:1vw;
        margin:0;
    `;
    // 根据传入属性动态切换元素可见性样式类
    const showContent=(props.show)?'':css`display:none;`;
    return (
        <ParagraphTemplate
            className={[textClass,showContent,props.width].join(' ')}// 继承属性传入的CSS类名以设置宽度
            content={props.content}// 从属性接收文本内容
            ref={ref}// 向外部转发此元素
        />
    );
});

export default HelpText;
