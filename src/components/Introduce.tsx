import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入程序简介文本内容
import { abstract } from '../static/docs.json';
// 导入文本段落模板组件
import ParagraphTemplate from './common/ParagraphTemplate';

// 程序简介文本块组件
const Introduce=()=>{
    // 文本宽度
    const textWidth=css`
        @media screen and (max-width:500px){
            width:465px;
        }
        @media screen and (min-width:501px) and (max-width:1000px){
            width:93vw;
        }
        @media screen and (min-width:1001px) and (max-width:1200px){
            width:930px;
        }
        @media screen and (min-width:1201px){
            width:calc(98vw - 1000px);
            margin-right:2vw;
        }
    `;
    return (
        <ParagraphTemplate 
            className={textWidth}
            content={abstract}// 引用导入的文本内容
        />
    );
};

export default Introduce;
