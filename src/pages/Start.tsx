import React, { useState } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入工作流组件
import WorkFlow from '../components/WorkFlow';
// 导入工具箱组件
import ToolKit from '../components/ToolKit';
// 导入文件路径块组件
import FilePath from '../components/FilePath';
// 导入返回按钮组件
import ReturnButton from '../components/common/ReturnButton';
// 导入运行按钮组件
import RunButton from '../components/RunButton';
import LinkButton from '../components/common/LinkButton';
// 导入全局状态-页面来源
import { useRecoilValue } from 'recoil';
import { PreviousPageState } from '../stores/referrer';

// 运行页面
export const Page=()=>{
    // 带布局的容器
    const Container=styled.div`
        display:flex;
        flex-direction:column;
        align-items:center;
    `;
    // 带布局的头部容器
    const Header=styled.header`
        display:flex;
        justify-content:space-around;
        width:93vw;
    `;
    // 带布局的底部容器
    const Footer=styled.footer`
        display:flex;
        justify-content:space-between;
        align-items:center;
    `;
    // 底部容器为两个按钮时的宽度
    const standardFooterWidth=css`
        width:max(200px,50vh);
    `;
    // 底部容器为三个按钮时的宽度
    const extendedFooterWidth=css`
        width:max(300px,75vh);
    `;
    // 使用全局状态-页面来源
    const referrer=useRecoilValue(PreviousPageState);
    // 定义局部状态-底部容器扩展
    const extend=useState(referrer.replace('#','').replace('/','').trim() !== '')[0];
    // 按钮样式
    const buttonClass=css`
        height:max(20px,5vh);
        width:max(90px,22vh);
        font-size:max(18px,4.5vh);
        border-radius:max(4px,1vh);
    `;
    return (
        <Container>
            <Header>
                {/* 工作流组件 */}
                <WorkFlow/>
                {/* 工具箱组件 */}
                <ToolKit
                    buttonClass={buttonClass}// 按钮样式
                />
            </Header>
            {/* 输入文件路径块 */}
            <FilePath
                title='INPUT File(s)'// 标题文本内容
                help='Click [OPEN] to choose input files or click [MODIFY] to input file paths'// 帮助文本内容
                buttonClass={buttonClass}// 按钮样式
            />
            {/* 输出目录路径块 */}
            <FilePath
                title='OUTPUT Path'// 标题文本内容
                help='Click [SAVE] to set the output path or click [MODIFY] to input one'// 帮助文本内容
                buttonClass={buttonClass}// 按钮样式
            />
            {/* 根据状态生成底部容器宽度 */}
            <Footer className={extend?extendedFooterWidth:standardFooterWidth}>
                {/* 运行按钮组件 */}
                <RunButton
                    className={buttonClass}// 按钮样式
                />
                {/* 返回按钮组件 */}
                <ReturnButton
                    className={buttonClass}// 按钮样式
                />
                {/* 主页跳转按钮 */}
                {extend?
                <LinkButton
                    value='HOME'// 按钮文本
                    path='/'// 跳转路径
                    className={buttonClass}// 按钮样式
                />:null
                }
            </Footer>
        </Container>
    );
}
