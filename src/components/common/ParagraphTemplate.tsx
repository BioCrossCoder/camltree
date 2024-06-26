import React, { LegacyRef } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

interface Props{
    className:string,
    content:string
}

// 文本段落模板组件
const ParagraphTemplate=React.forwardRef((props:Props,ref)=>{
    // 文本样式
    const textClass=css`
        color:white;
        font-weight:bold;
        text-align:justify;
        font-size:max(18px,2vw);
    `;
    return (
        <p
            className={[textClass,props.className].join(' ')}// 继承属性传入的CSS类名
            ref={ref as LegacyRef<HTMLParagraphElement>}// 向外部转发此元素
        >
            {/* 从属性接收内容 */}
            {props.content}
        </p>
    );
});

export default ParagraphTemplate;
