import React, { MouseEventHandler } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入操作指南内容
import { guide } from '../static/docs.json';
// 导入项目主页地址
import { url } from '../static/homepage.json';
// 导入返回按钮组件
import ReturnButton from '../components/common/ReturnButton';

// 指南页面
export const Page=()=>{
    // 带布局的容器
    const Container=styled.div`
        height:96vh;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
    `;
    // 标题组件
    const Title=styled.header`
        color:white;
        font-weight:bold;
        font-size:max(30px,3vw);
        margin:0;
    `;
    // 列表容器组件
    const ListBlock=styled.ul`
        overflow-y:scroll;
    `;
    // 主列表项样式
    const mainListLineClass=css`
        color:white;
        font-weight:bold;
        font-size:max(20px,2vw);
        margin:0;
    `;
    // 子列表项样式
    const subListLineClass=css`
        color:white;
        font-size:max(18px,1.8vw);
        text-align:justify;
        margin-right:5vw;
    `;
    // 底部导航栏组件
    const Bar=styled.footer`
        display:flex;
        justify-content:space-between;
        width:95vw;
    `;
    // 链接组件
    const ProjectLink=styled.a`
        margin:0;
        color:white;
        border:1px white solid;
        font-size:max(16px,4vh);
        padding-left:2vw;
        padding-right:2vw;
    `;
    // 按钮样式
    const buttonClass=css`
        height:max(20px,5vh);
        width:max(90px,22vh);
        font-size:max(18px,4.5vh);
        border-radius:max(4px,1vh);
    `;
    // 打开项目主页方法
    function openHomePage(event:Event){
        event.preventDefault();
        window.electronAPI.openURL(url);
    }
    return (
        <Container>
            <Title>Guidance</Title>
            {/* 根据指南内容渲染一个无序列表 */}
            <ListBlock>
                {guide.map(item=>{
                    if(typeof item === 'string'){
                        // 当指南内容项为字符串时直接渲染为列表项
                        return (
                            <li
                                className={mainListLineClass}
                                key={guide.indexOf(item)}
                            >
                                {item}
                            </li>
                        );
                    }else{
                        // 当指南内容项为列表时渲染为有序子列表
                        return (
                            <ol key={guide.indexOf(item)}>
                                {item.map(line=>{
                                    return (
                                        <li
                                            className={subListLineClass}
                                            key={`${guide.indexOf(item)}-${item.indexOf(line)}`}
                                        >
                                            {line}
                                        </li>
                                    );
                                })}
                            </ol>
                        );
                    }
                })}
            </ListBlock>
            <Bar>
                {/* 项目主页链接 */}
                <ProjectLink
                    href=''
                    onClick={openHomePage as unknown as  MouseEventHandler<HTMLAnchorElement>}
                >
                    Project Homepage
                </ProjectLink>
                {/* 返回按钮组件 */}
                <ReturnButton
                    className={buttonClass}// 按钮样式
                />
            </Bar>
        </Container>
    );
}
