import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './common/ButtonTemplate';
// 导入页面状态-可用性状态
import { useRecoilValue } from 'recoil';
import { PageAllowState } from '../stores/allow';

interface Props{
    buttonClass:string
}

// 工具箱组件
const ToolKit=(props:Props)=>{
    // 带样式布局的容器
    const Container=styled.aside`
        height:max(150px,30vh);
        width:max(90px,22vh);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        padding-left:3vw;
        padding-right:3vw;
        padding-top:1vh;
        padding-bottom:1vh;
        background-color:rgba(255,255,255,0.3);
        border-radius:1.5vw;
    `;
    // 标题组件
    const Title=styled.header`
        height:max(25px,5vh);
        font-size:max(20px,4vh);
        line-height:max(50px,10vh);
        color:yellow;
        font-weight:bold;
    `;
    // 带样式布局的主体容器
    const Content=styled.main`
        height:max(100px,20vh);
        display:flex;
        flex-direction:column;
        justify-content:space-around;
    `;
    // 使用页面状态-可用性状态
    const allow=useRecoilValue(PageAllowState);
    // 工具列表
    const tools:string[]=['FigTree','ALTER','MACSE'];
    // 调用工具方法
    function callTool(toolName:string):void{
        window.electronAPI.callGUItool(toolName);
    }
    return (
        <Container>
            <Title>ToolKit</Title>
            <Content>
                {tools.map((tool:string)=>{
                    return (
                        <ButtonTemplate
                            key={tool}
                            value={tool}// 按钮文本内容
                            className={props.buttonClass}// 从属性接收CSS类名
                            onClick={()=>callTool(tool)}
                            allow={allow}// 按钮可用性与页面状态同步
                        />  
                    );
                })}
            </Content>
        </Container>
    );
}

export default ToolKit;
