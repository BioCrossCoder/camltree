import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入工具参数块组件
import ToolArgv from '../components/ToolArgv';
// 导入配置选择器组件
import ConfigSelector from '../components/ConfigSelector';
// 导入导航按钮组件
import LinkButton from '../components/common/LinkButton';
// 导入返回按钮组件
import ReturnButton from '../components/common/ReturnButton';

// 设置页面
export const Page=()=>{
    // 命令行工具项
    const tools:string[]=['MAFFT','trimAl','IQ-TREE','MACSE'];
    // 带布局的容器
    const Container=styled.div`
        display:flex;
        flex-direction:column;
        align-items:center;
    `;
    // 带布局的底部容器
    const Footer=styled.footer`
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        height:max(48px,12vh);
    `;
    // 带布局的底部导航栏组件
    const Bar=styled.footer`
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:max(200px,50vh);
    `;
    // 按钮样式
    const buttonClass=css`
        height:max(20px,5vh);
        width:max(90px,22vh);
        font-size:max(18px,4.5vh);
        border-radius:max(4px,1vh);
    `;
    // 选择器字体大小
    const selectClass=css`
        font-size:max(18px,4.5vh);
        margin-left:1vw;
        margin-right:1vw;
    `;
    return (
        <Container>
            {/* 根据工具项列表渲染工具项参数修改区块 */}
            {tools.map(tool=>{
                return (
                    <ToolArgv
                        title={tool}// 标题文本内容
                        help={`Click [MODIFY] to input ${tool} arguments`}// 帮助文本内容
                        buttonClass={buttonClass}// 按钮样式
                        key={tool}
                    />
                )
            })}
            <Footer>
                {/* 配置选择器组件 */}
                <ConfigSelector
                    buttonClass={buttonClass}// 按钮样式
                    selectClass={selectClass}// 选择器样式
                />
                <Bar>
                    {/* 运行页面跳转按钮 */}
                    <LinkButton
                        value='NEXT'// 按钮文本
                        path='/start'// 跳转路径
                        className={buttonClass}// 按钮样式
                    />
                    {/* 返回按钮组件 */}
                    <ReturnButton
                        className={buttonClass}// 按钮样式
                    />
                </Bar>
            </Footer>
        </Container>
    );
}
