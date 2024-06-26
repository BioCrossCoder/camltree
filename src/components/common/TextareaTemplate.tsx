import React, { LegacyRef } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

interface Props{
    allow:boolean,
    work:boolean,
    style?:object,
    value:string,
    hint:string
}

// 文本区域模板组件
const TextareaTemplate=React.forwardRef((props:Props,ref)=>{
    // 文本区域样式
    const textareaClass=css`
        width:95vw;
        font-size:max(18px,2vw);
        font-weight:bold;
        resize:none;
    `;
    return (
        <textarea
            ref={ref as LegacyRef<HTMLTextAreaElement>}// 向外部转发此元素
            defaultValue={props.value}// 从属性接收文本内容
            className={textareaClass}
            style={props.style}// 从属性接收内联样式
            readOnly={!props.work}// 从属性接收读写状态
            disabled={!props.allow}// 从属性接收可用性状态
            spellCheck={false}// 禁用拼写检查
            placeholder={props.hint}// 从属性接收的占位内容
        />
    );
});

export default TextareaTemplate;
