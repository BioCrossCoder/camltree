import { DefaultValue, selector } from "recoil";
// 导入引用的全局状态
import { IqtreeState } from "./iqtree";
import { MafftState } from "./mafft";
import { TrimalState } from "./trimal";
import { MacseState } from "./macse";

// 定义衍生全局状态-配置状态
export const ConfigState=selector({
    key:'config',
    get:({get})=>{
        return {
            mafftArguments:get(MafftState),
            trimalArguments:get(TrimalState),
            iqtreeArguments:get(IqtreeState),
            macseArguments:get(MacseState)
        };
    },
    set:({set},newValue)=>{
        // 如果新值与默认值相同则不进行任何操作
        if(newValue instanceof DefaultValue){
            return;
        }
        set(MafftState,newValue.mafftArguments);
        set(TrimalState,newValue.trimalArguments);
        set(IqtreeState,newValue.iqtreeArguments);
        set(MacseState,newValue.macseArguments);
    }
});
