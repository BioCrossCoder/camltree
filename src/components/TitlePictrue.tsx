import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入标题图片资源路径
import TitleImage from '../static/title.png';

// 标题图片组件
const TitlePicture=()=>{
    // 图片宽度设置
    const titleClass=css`
        width:98vw;
        min-width:500px;
        max-width:1000px;
    `;
    return (
        <img
            alt='title'
            src={TitleImage}// 引用导入资源路径
            className={titleClass}
        />
    );
};

export default TitlePicture;
