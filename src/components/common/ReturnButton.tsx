import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './ButtonTemplate';
// 导入页面状态-可用性状态
import { useRecoilValue } from 'recoil';
import { PageAllowState } from '../../stores/allow';

interface Props{
    className:string
}

// 返回按钮组件
const ReturnButton=(props:Props)=>{
    // 使用页面状态-可用性状态
    const allow=useRecoilValue(PageAllowState);
    // 点击事件回调函数
    function handleClick(){
        // 浏览器历史记录回退
        history.back();
    }
    return (
        <ButtonTemplate
            className={props.className}// 从属性接收CSS类名
            onClick={handleClick}
            value='RETURN'// 按钮文本内容
            allow={allow}// 按钮可用性与页面状态同步
        />
    );
}

export default ReturnButton;
