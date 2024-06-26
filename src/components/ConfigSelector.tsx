import React,{ useRef,useState,useEffect } from 'react';
import { css } from '@emotion/css';
import styled from '@emotion/styled';
// 导入按钮模板组件
import ButtonTemplate from './common/ButtonTemplate';
// 导入选择器模板组件
import SelectorTemplate from './SelectorTemplate';
// 导入全局状态-配置状态，页面状态-可用性状态
import { useRecoilState } from 'recoil';
import { ConfigState } from '../stores/config';
import { PageAllowState } from '../stores/allow';

// 定义CamlTree配置类型
interface CamlTreeConfig{
    mafftArguments:string,
    trimalArguments:string,
    iqtreeArguments:string,
    macseArguments:string
}

interface Props{
    buttonClass:string,
    selectClass:string
}

// 配置选择器组件
const ConfigSelector=(props:Props)=>{
    // 容器布局
    const containerClass=css`
        display:flex;
        align-items:center;
        border:1px solid gold;
        border-radius:1vw;
        padding-left:1vw;
        padding-right:1vw;
    `;
    // 注册配置选择器引用
    const selectRef=useRef(null);
    // 初始化配置选择器列表项状态
    const [configOptions,setOptions]=useState([] as string[]);
    // 使用全局状态-配置状态
    const [configItems,setConfig]=useRecoilState(ConfigState);
    // 使用页面状态-可用性状态
    const [allow,setAllow]=useRecoilState(PageAllowState);
    // 组件每次渲染时
    useEffect(()=>{
        // 从后端加载配置项列表内容
        window.electronAPI.getConfigs().then((result:string[])=>{
            setOptions(result);
        });
    });
    // 保存配置方法
    function saveConfig(){
        setAllow(false);
        // 导出配置文件并更新选择器列表项
        window.electronAPI.saveConfig(configItems).then((result:string[])=>{
            setOptions(result);
            setAllow(true);
        });
    }
    // 加载配置方法
    function loadConfig(){
        setAllow(false);
        // 读取配置文件并导入内容
        window.electronAPI.loadConfig((selectRef.current as unknown as HTMLSelectElement).value).then((result:CamlTreeConfig|null)=>{
            if(result !== null){
                setConfig(result);
            }
            setAllow(true);
        });
    }
    return (
        <div className={containerClass}>
            {/* 保存配置按钮 */}
            <ButtonTemplate
                value='SAVE'// 按钮文本内容
                className={props.buttonClass}// 从属性接收按钮样式
                allow={allow}// 按钮可用性与页面状态同步
                onClick={saveConfig}// 点击事件回调设置为保存配置方法
            />
            {/* 配置选择器 */}
            <SelectorTemplate
                title='config'// 选择器悬浮提示文本
                value='...'// 默认选项
                className={props.selectClass}// 从属性接收CSS类名
                ref={selectRef}// 绑定转发元素引用
                options={configOptions}
                allow={allow}// 选择器可用性与页面状态同步
            />
            {/* 加载配置按钮 */}
            <ButtonTemplate
                value='LOAD'// 按钮文本内容
                className={props.buttonClass}// 从属性接收按钮样式
                allow={allow}// 按钮可用性与页面状态同步
                onClick={loadConfig}// 点击事件回调设置为加载配置方法
            />
        </div>
    );
}

export default ConfigSelector;
