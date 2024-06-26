import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './ButtonTemplate';
// 导入页面状态-可用性状态，全局状态-页面来源
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PageAllowState } from '../../stores/allow';
import { PreviousPageState } from '../../stores/referrer';

interface Props{
    value:string,
    path:string,
    className:string
}

// 导航按钮组件
const LinkButton=(props:Props)=>{
    // 使用页面状态-可用性状态
    const allow=useRecoilValue(PageAllowState);
    // 使用全局状态-页面来源
    const setReferrer=useSetRecoilState(PreviousPageState);
    // 点击事件回调
    function handleClick(){
        // 更新全局状态-上一页路径
        setReferrer(location.hash);
        // hash跳转到属性传入的路径
        location.hash=props.path;
    }
    return (
        <ButtonTemplate
            className={props.className}// 从属性接收按钮样式
            onClick={handleClick}
            value={props.value}// 从属性接收按钮文本内容
            allow={allow}// 按钮可用性与页面状态同步
        />
    );
}

export default LinkButton;
