import React from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入分析步骤选项栏组件
import StepOptions from './StepOptions';
// 导入全局状态-分析策略、序列对齐方法、对齐优化方法、建树方法，页面状态-可用性状态
import { useRecoilState, useRecoilValue } from 'recoil';
import { AnalysisStrategyState } from '../stores/strategy';
import { SequenceAlignmentState } from '../stores/alignment';
import { AlignmentOptimizationState } from '../stores/optimize';
import { TreeConstructionState } from '../stores/tree';
import { PageAllowState } from '../stores/allow';

// 工作流组件
const WorkFlow=()=>{
    // 带布局样式的容器
    const Container=styled.div`
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        flex-shrink:0;
        height:max(150px,30vh);
        width:max(520px,85vh);
        padding-left:1vw;
        padding-right:1vw;
        padding-top:1vh;
        padding-bottom:1vh;
        background-color:rgba(255,255,255,0.3);
        border-radius:1.5vw;
    `;
    // 标题组件
    const Title=styled.header`
        height:max(25px,5vh);
        color:yellow;
        font-weight:bold;
        font-size:max(20px,4vh);
        line-height:max(25px,5vh);
    `;
    // 带样式布局的主体容器
    const Content=styled.main`
        height:max(120px,24vh);
        width:max(520px,85vh);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:left;
    `;
    // 使用全局状态-分析策略、序列对齐方法、对齐优化方法、建树方法
    const [strategy,setStrategy]=useRecoilState(AnalysisStrategyState);
    const [alignment,setAlignment]=useRecoilState(SequenceAlignmentState);
    const [optimize,setOptimize]=useRecoilState(AlignmentOptimizationState);
    const [tree,setTree]=useRecoilState(TreeConstructionState);
    // 使用页面状态-可用性状态
    const allow=useRecoilValue(PageAllowState);
    return (
        <Container>
            <Title>Select analyses to workflow</Title>
            <Content>
                {/* 分析策略选项组 */}
                <StepOptions
                    title='Analysis Strategy'// 选项组标题
                    options={['Concatenation','Coalescence','Seperation']}// 选项列表
                    option={strategy}// 将选项绑定到全局状态
                    choose={setStrategy}// 传入修改全局状态方法
                    allow={allow}// 传入页面可用性状态
                />
                {/* 序列对齐方法选项组 */}
                <StepOptions
                    title='Sequence Alignment'// 选项组标题
                    options={['MAFFT','MACSE','Skip']}// 选项列表
                    option={alignment}// 将选项绑定到全局状态
                    choose={setAlignment}// 传入修改全局状态方法
                    allow={allow}// 传入页面可用性状态
                />
                {/* 对齐优化方法选项组 */}
                <StepOptions
                    title='Alignment Optimization'// 选项组标题
                    options={['trimAl','Skip']}// 选项列表
                    option={optimize}// 将选项绑定到全局状态
                    choose={setOptimize}// 传入修改全局状态方法
                    allow={allow}// 传入页面可用性状态
                />
                {/* 建树方法选项组 */}
                <StepOptions
                    title='Tree Construction'// 选项组标题
                    options={['IQ-TREE','MrBayes','Skip']}// 选项列表
                    option={tree}// 将选项绑定到全局状态
                    choose={setTree}// 传入修改全局状态方法
                    allow={allow}// 传入页面可用性状态
                />
            </Content>
        </Container>
    );
}

export default WorkFlow;
