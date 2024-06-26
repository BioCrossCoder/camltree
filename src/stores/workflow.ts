import { selector } from 'recoil';
// 导入引用的全局状态
import { AnalysisStrategyState } from './strategy';
import { SequenceAlignmentState } from './alignment';
import { AlignmentOptimizationState } from './optimize';
import { TreeConstructionState } from './tree';

// 定义检查步骤是否跳过方法
const ignore=(item:string)=>item!=='Skip';

// 定义全局状态-工作流
export const WorkFlowState=selector({
    key:'flow',
    get:({get})=>{
        // 从其它全局状态提取工作流中分析步骤选项
        const methods:string[]=[
            SequenceAlignmentState,
            AlignmentOptimizationState,
            TreeConstructionState
        ].map(item=>get(item));
        const [align,optimize,tree]=methods;
        // 根据分析策略生成不同工作流
        switch(get(AnalysisStrategyState)){
            case 'Concatenation':
                return [align,optimize,'Concatenation',tree].filter(ignore);
            case 'Coalescence':
                return [align,optimize,tree,'wASTRAL'].filter(ignore);
            default:
                return methods.filter(ignore);
        }
    }
});
