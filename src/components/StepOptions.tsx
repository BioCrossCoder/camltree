import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入antd组件-单选列表、布局
import { Radio, RadioChangeEvent, Typography } from 'antd';
// 导入全局状态-分析策略、序列对齐方法、对齐优化方法、建树方法
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AnalysisStrategyState } from '../stores/strategy';
import { SequenceAlignmentState } from '../stores/alignment';
import { AlignmentOptimizationState } from '../stores/optimize';
import { TreeConstructionState } from '../stores/tree';

interface Props{
    options:string[],
    title:string,
    option:string,
    choose:Function,
    allow:boolean
}

// 分析步骤选项栏组件
const StepOptions=(props:Props)=>{
    // 带布局的容器
    const Container=styled.div`
        display:flex;
        justify-content:space-between;
    `;
    // 标题文本样式
    const titleFontStyle=css`
        color:yellow;
        font-size:max(18px,3vh);
    `;
    // 按钮文本样式
    const buttonFontStyle=css`
        font-weight:bold;
        font-size:max(15px,2.5vh);
    `;
    // 使用全局状态-分析策略、序列对齐方法、对齐优化方法、建树方法
    const strategy=useRecoilValue(AnalysisStrategyState);
    const [tree,setTree]=useRecoilState(TreeConstructionState);
    const setAln=useSetRecoilState(SequenceAlignmentState);
    const setOpt=useSetRecoilState(AlignmentOptimizationState);
    // 生成按钮可用性状态方法
    function buttonAllow(option:string):boolean{
        if(option === 'MrBayes'){
            // 贝叶斯建树在并联建树法中不可用
            return strategy !== 'Coalescence';
        }else if(['MAFFT','MACSE','trimAl'].includes(option)){
            // 并联建树中选择不建树时不允许做序列对齐和对齐优化
            return (strategy !== 'Coalescence') || (tree !== 'Skip');
        }else{
            return true;
        }
    }
    // 修改选项方法
    function handleChange(event:RadioChangeEvent):void{
        props.choose(event.target.value);
        // 分析策略选择并联建树时重置建树方法
        if(event.target.value === 'Coalescence'){
            setTree('IQ-TREE');
        }
        // 分析策略为并联建树且建树方法为空时将序列对齐和对齐优化方法置空
        if(
            (strategy ==='Coalescence') 
            &&
            (event.target.value === 'Skip')
            &&
            (props.title === 'Tree Construction')
        ){
            setAln('Skip');
            setOpt('Skip');
        }
    }
    return (
        <Container>
            {/* 选项列表标题 */}
            <Typography.Text strong className={titleFontStyle}>
                {props.title}
            </Typography.Text>
            {/* 单选列表组 */}
            <Radio.Group
                value={props.option}// 列表值绑定为当前选项
                onChange={handleChange}
                buttonStyle='solid'
                optionType='button'
            >
                {/* 根据选项属性列表渲染选项按钮 */}
                {props.options.map((item:string)=>{
                    return (
                        <Radio.Button
                            value={item}// 列表文本为选项字符串
                            className={buttonFontStyle}// 按钮文本样式
                            disabled={(!buttonAllow(item)) || (!props.allow)}// 计算单个按钮可用性状态
                            key={item}
                        >
                            {item}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        </Container>
    );
}

export default StepOptions;
