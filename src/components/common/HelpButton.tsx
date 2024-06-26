import React, { MouseEventHandler } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './ButtonTemplate';

interface Props{
    onClick:MouseEventHandler
}

// 帮助按钮组件
const HelpButton=(props:Props)=>{
    // 按钮样式
    const buttonClass=css`
        height:max(16px,4vh);
        width:max(50px,15vh);
        font-size:max(14.4px,3.6vh);
        border-radius:max(3.2px,0.8vh);
    `;
    return (
        <ButtonTemplate
            className={buttonClass}
            onClick={props.onClick}// 从属性接收点击事件回调
            allow={true}// 该按钮总是可用
            value='HELP'// 按钮文本内容
        />
    );
}

export default HelpButton;
