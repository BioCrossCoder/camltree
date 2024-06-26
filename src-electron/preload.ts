import { contextBridge,ipcRenderer } from 'electron';
import { CamlTreeConfig, RunningConfig } from './main';

// 向渲染器进程暴露接口
contextBridge.exposeInMainWorld('electronAPI',{
    inputFile:()=>ipcRenderer.invoke('input'),
    outputFile:()=>ipcRenderer.invoke('output'),
	submitTask:(settings:RunningConfig)=>ipcRenderer.invoke('run',settings),
	saveConfig:(value:CamlTreeConfig)=>ipcRenderer.invoke('save',value),
	loadConfig:(name:string)=>ipcRenderer.invoke('load',name),
	getConfigs:()=>ipcRenderer.invoke('config'),
	autoConfig:()=>ipcRenderer.invoke('auto'),
	openURL:(url:string)=>ipcRenderer.send('web',url),
	callGUItool:(toolName:string)=>ipcRenderer.send('call',toolName),
	onTaskUpdate:(callback)=>ipcRenderer.on('progress',callback),
	onTaskError:(callback)=>ipcRenderer.on('error',callback),
	onTaskComplete:(callback)=>ipcRenderer.on('complete',callback),
	onTaskSubmit:(callback)=>ipcRenderer.on('task',callback),
	openDirectory:(path:string)=>ipcRenderer.send('show',path)
});
