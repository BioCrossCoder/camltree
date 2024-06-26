import React,{ ReactElement } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

interface Props{
    title:string,
    content:ReactElement
}

// 顶部行容器组件
const HeaderLine=(props:Props)=>{
    // 带布局样式的头部容器
    const Header=styled.header`
        height:max(32px,8vh);
        width:max(500px,95vw);
        display:flex;
        align-items:center;
    `;
    // 带样式的标题文本段落元素
    const Title=styled.p`
        color:white;
        font-weight:bold;
        font-size:max(20px,5vh);
        margin-right:2vw;
    `;
    return (
        <Header>
            <Title>
                {/* 从属性接收的标题文本 */}
                {props.title}
            </Title>
            {/* 从属性接收渲染内容的插槽 */}
            {props.content}
        </Header>
    );
}

export default HeaderLine;
