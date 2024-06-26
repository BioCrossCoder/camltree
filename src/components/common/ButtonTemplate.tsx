import React, { MouseEventHandler } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

interface Props{
    className:string,
    onClick:MouseEventHandler,
    value:string,
    allow:boolean
}

// 按钮模板组件
const ButtonTemplate=(props:Props)=>{
    // 按钮模板样式
    const buttonClass=css`
        color:black;
        background-color:white;
        border:transparent;
        font-weight:bold;
        /* 鼠标悬浮样式 */
        :hover{
            color:white;
            background-color:skyblue;
            cursor:pointer;
        }
        /* 按钮禁用样式 */
        :disabled{
            color:white;
            background-color:rgb(180,180,180);
        }
    `;
    return (
        <button
            type='button'
            className={[buttonClass,props.className].join(' ')}// 继承属性传入的CSS类名
            onClick={props.onClick}// 从属性接收点击事件回调函数
            disabled={!props.allow}// 从属性接收按钮可用性
        >
            {/* 按钮文本内容 */}
            {props.value}
        </button>
    );
}

export default ButtonTemplate;
