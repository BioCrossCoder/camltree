import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入标题图片组件
import TitlePicture from '../components/TitlePictrue';
// 导入程序简介文本块组件
import Introduce from '../components/Introduce';
// 导入导航按钮组件
import LinkButton from '../components/common/LinkButton';

// 主页面
export const Page=()=>{
    // 带布局的容器
    const Container=styled.div`
        display:flex;
        flex-direction:column;
        justify-content:space-between;
    `;
    // 带布局的头部容器
    const Header=styled.header`
        display:flex;
        @media screen and (max-width:1200px) {
            flex-direction:column;
        }
        justify-content:space-between;
        align-items:center;
        margin-bottom:5vh;
    `;
    // 带布局样式的按钮容器
    const Menu=styled.div`
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        min-height:max(200px,40vh);
    `;
    // 按钮样式
    const buttonClass=css`
        width:max(50vw,200px);
        height:max(10vh,50px);
        font-weight:bold;
        font-size:max(5vh,30px);
        border-radius:max(2vh,10px);
    `;
    return (
        <Container>
            <Header>
                {/* 标题图片组件 */}
                <TitlePicture/>
                {/* 程序简介文本块组件 */}
                <Introduce/>
            </Header>
            <Menu>
                {/* 运行页面跳转按钮 */}
                <LinkButton
                    value='Start'// 按钮文本
                    path='/start'// 跳转路径
                    className={buttonClass}// 按钮样式
                />
                {/* 设置页面跳转按钮 */}
                <LinkButton
                    value='Customize'// 按钮文本
                    path='/set'// 跳转路径
                    className={buttonClass}// 按钮样式
                />
                {/* 指南页面跳转按钮 */}
                <LinkButton
                    value='Guidance'// 按钮文本
                    path='/guide'// 跳转路径
                    className={buttonClass}// 按钮样式
                />
            </Menu>
        </Container>
    );
}
