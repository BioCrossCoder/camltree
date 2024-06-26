/// <reference types="vite/client" />

// 为全局对象声明electron框架提供的API接口
declare interface Window{
    electronAPI:{
        [index:string]:Function
    }
}
