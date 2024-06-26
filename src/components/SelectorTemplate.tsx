import React, { ChangeEventHandler, LegacyRef } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

interface Props{
    title:string,
    value:string,
    onChange?:ChangeEventHandler,
    className:string,
    options:string[],
    allow:boolean
}

// 选择器模板组件
const SelectorTemplate=React.forwardRef((props:Props,ref)=>{
    return (
        <>
            <select
                defaultValue={props.value}// 从属性接收选中项状态
                title={props.title}// 选择器悬浮提示文本
                onChange={props.onChange}// 从属性接收列表选项变动事件回调函数
                className={props.className}// 从属性接收CSS类名
                ref={ref as LegacyRef<HTMLSelectElement>}// 向外部转发此元素
                disabled={!props.allow}// 从属性接收可用性状态
            >
                {/* 根据传入属性渲染选项列表 */}
                {props.options.map((option:string)=>{
                    return (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
        </>
    );
});

export default SelectorTemplate;
