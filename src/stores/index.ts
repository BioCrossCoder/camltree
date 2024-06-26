// 导入引用的全局状态
import { RecoilState } from "recoil";
import { InputState } from "./input";
import { IqtreeState } from "./iqtree";
import { MafftState } from "./mafft";
import { OutputState } from "./output";
import { TrimalState } from "./trimal";
import { MacseState } from "./macse";

export interface StatesSet{
    [index:string]:RecoilState<any>
}

// 集中导出会显示在文本块内容的全局状态
export const States:StatesSet={
    'INPUT':InputState,
    'OUTPUT':OutputState,
    'MAFFT':MafftState,
    'trimAl':TrimalState,
    'IQ-TREE':IqtreeState,
    'MACSE':MacseState
}
