import { app,BrowserWindow,ipcMain,dialog,utilityProcess,shell,Tray,Menu, FileFilter } from 'electron';
import path from 'node:path';
import child_process from 'node:child_process';
import fs from 'node:fs';

// 定义窗口尺寸类型
interface WindowSize{
    width:number,
    height:number
}

// 创建新窗口方法
function createWindow(icon:string,size:WindowSize):BrowserWindow{
    // 创建新窗口
    const newWindow=new BrowserWindow({
        ...size,
        backgroundColor:'#023950',
        icon,// 针对windows设置
        webPreferences:{
            preload:path.join(__dirname,'preload.js')// 加载预处理器脚本
        }
    });
    // 配置窗口最小化事件回调
    newWindow.on('minimize',()=>newWindow.hide());
    return newWindow;
}

// 初始化系统托盘图标方法
function initTray(icon:string,taskWindow:BrowserWindow):Tray{
    // 创建系统托盘图标
    const tray=new Tray(icon);
    // 配置系统托盘图标点击事件回调
    tray.on('click',()=>BrowserWindow.getAllWindows().map(window=>window.show()));
    // 配置系统托盘图标右键菜单
    const contextMenu=Menu.buildFromTemplate([
        {label:'Check task progress',click:()=>taskWindow.show()},// 查看任务进度按钮
        {label:'Exit',click:app.quit}// 退出按钮
    ]);
    tray.setContextMenu(contextMenu);
    // 配置系统托盘图标悬浮提示文本
    tray.setToolTip('Free');
    return tray;
}

// 定义工具路径配置类型
interface ToolPathConfig{
    [index:string]:string
}

// 加载第三方工具方法
function loadTools():ToolPathConfig{
    // 内置第三方工具路径配置
    const toolPaths:ToolPathConfig={
        mafftPath:'tools/mafft/mafft.bat',
        figtreePath:'tools/figtree.jar',
        macsePath:'tools/macse_v2.07.jar',
        alterPath:'tools/ALTER-1.3.4-jar-with-dependencies.jar'
    };
    if(process.platform === 'win32'){
        // 运行平台为windows系统时
        Object.assign(toolPaths,{
            trimalPath:'tools/trimal.exe',
            iqtreePath:'tools/iqtree2.exe',
            mrbayesPath:'tools/mb.3.2.7-win32.exe',
            astralPath:'tools/astral-hybrid.exe'
        });
    }else{
        // 运行平台为mac系统时
        Object.assign(toolPaths,{
            trimalPath:'tools/trimal',
            iqtreePath:'tools/iqtree2',
            mrbayesPath:'tools/mb',
            astralPath:'tools/astral-hybrid'
        });
    }
    // 应用打包时，工具被存放在上一级目录
    if(app.isPackaged){
        for(const key in toolPaths){
            const toolPath:string=toolPaths[key];
            toolPaths[key]=path.join('../',toolPath);
        }
    }
    // 根据应用运行目录生成工具绝对路径
    for(const key in toolPaths){
        const relativePath:string=toolPaths[key];
        const absolutePath:string=path.join(__dirname,relativePath);
        toolPaths[key]=absolutePath;
    }
    return toolPaths;
}

// 枚举组合方法
function enumerateCombinations(source:string):string[]{
    const results:string[]=[source];
    for(let i=1;i<source.length-1;i++){
        const characters:string[]=[source[0]];
        characters.push(source[i]);
        for(let j=i+1;j<source.length;j++){
            const character:string=source[j];
            if(character === characters[characters.length-1]){
                const result:string=characters.join('');
                if(!results.includes(result)){
                    results.push(result);
                }
            }
            characters.push(character);
            const result:string=characters.join('');
            if(!results.includes(result)){
                results.push(result);
            }
            characters.pop();
        }
    }
    return results;
}

// 处理输入方法
function handleInput():string[]|undefined{
    // 序列文件后缀列表
    const sequenceExtensions:string[]=enumerateCombinations('fasta');
    // 对齐文件后缀列表
    const extraExtensions:string[]=['mega','nexus','phylip'].flatMap(item=>enumerateCombinations(item));
    const alignmentExtensions:string[]=[...sequenceExtensions,'aln',...extraExtensions];
    // 进化树文件后缀列表
    const phylotreeExtensions:string[]=['newick','nwk','treefile','tree','tre'];
    return dialog.showOpenDialogSync({
        title:'Open',
        filters:[
            {name:'Biological Sequences',extensions:sequenceExtensions},// 生物学序列文件
            {name:'Sequence Alignments',extensions:alignmentExtensions},// 多序列对齐文件
            {name:'Phylogeny Tree',extensions:phylotreeExtensions},// 进化树文件
            {name:'All Files',extensions:['*']}// 用户自选的任意文件
        ],
        properties:['openFile','multiSelections']
    });
}

// 处理输出方法
function handleOutput():string|undefined{
    return dialog.showSaveDialogSync({
        title:'Save',
        filters:[{name:'Analysis Results'} as FileFilter]
    });
}

// 定义CamlTree配置类型
export interface CamlTreeConfig{
    mafftArguments:string,
    iqtreeArguments:string,
    trimalArguments:string,
    macseArguments:string
}

// 定义运行配置类型
export interface RunningConfig extends CamlTreeConfig{
    workflow:string,
    input:string|string[],
    output:string
}

// 确认配置方法
function confirmConfig(value:CamlTreeConfig|RunningConfig):boolean{
    // 确认配置时不检查输入输出
    const info={...value} as RunningConfig;
    ['input','output'].map(item=>delete info[item]);
    if('workflow' in info){
        // 当工作流属性为空时弹窗报错
        if(info.workflow === ''){
            dialog.showMessageBoxSync({
                title:'ERROR',
                type:'error',
                message:'Workflow is empty!'
            });
            return false;
        }
        // 当工作流属性不为空时删除无关属性
        const tasks:string[]=info.workflow.split('->');
        const tools:string[]=['MAFFT','MACSE','IQ-TREE','trimAl'];
        for(const tool of tools){
            if(!tasks.includes(tool)){
                const item:string=tool.replace('-','').toLowerCase()+'Arguments';
                delete info[item];
            }
        };
    }
    // 弹窗显示即将提交的配置
    const result:number=dialog.showMessageBoxSync({
        title:'CHECK',
        type:'info',
        message:Object.entries(info).map(item=>`${item[0]}: "${item[1]}"`).join('\n'),
        buttons:['OK','CANCEL']
    });
    return result === 0;
}

// 处理任务提交方法
function handleSubmit(_event:Event,settings:RunningConfig,processWindow:BrowserWindow):any{
    // 解析工作流字段
    const workflow:string[]=settings.workflow.split('->');
    // 检查是否设置输入和输出
    let items:string[]=[];
    if(settings.input.length === 0){
        items.push('INPUT');
    }
    if(settings.output.length === 0){
        items.push('OUTPUT');
    }
    if(items.length > 0){
        return dialog.showMessageBoxSync({
            title:'ERROR',
            type:'error',
            message:`No ${items.join('/')} file specified!`
        });
    }
    // 更新系统托盘图标悬浮提示信息方法
    function updateTip(action:string):string{
        let tip:string='';
        if(action === 'start'){
            global.runningTasks++;
        }else{
            global.runningTasks--;
        }
        switch(global.runningTasks){
            case 0:
                tip='Free';
                break;
            case 1:
                tip='1 task running...';
                break;
            default:
                tip=`${global.runningTasks} tasks running...`;
                break;
        }
        global.tray.setToolTip(tip);
        return tip;
    }
    // 提交任务前跳出最终确认
    if(!confirmConfig(settings)){
        return;
    }else{
        // 当确定提交时更新系统托盘图标悬浮提示信息
        const tip:string=updateTip('start');
        // 生成任务编号
        var taskOrder:number=Date.now();
        // 弹窗提示任务提交成功
        var outputPath:string=settings.output;
        dialog.showMessageBox({
            title:'NOTICE',
            type:'info',
            message:`Task ${taskOrder} start\n${tip}`
        });
    }
    // 创建子进程在后台运行任务
    const task=utilityProcess.fork(
        path.join(__dirname,'scripts/worker.js'),
        [JSON.stringify({
            ...global.toolPaths,
            ...settings,
            fastaSuffix:enumerateCombinations('fasta')
        })],
    );
    // 向进度显示窗口报告提交新任务并发送任务编号和结果输出目录路径
    processWindow.webContents.send('task',[String(taskOrder),outputPath]);
    // 定义任务进度类型
    interface Progress{
        (index:string):[number,number]
    }
    // 定义接收消息类型
    interface Signal{
        finish:boolean,
        success?:boolean,
        error?:string,
        log?:string,
        progress?:Progress,
        (index:string):string
    }
    // 接收到后台任务发送的消息时进行处理
    task.on('message',(signal:Signal)=>{
        // 任务结束时
        if(signal.finish){
            // 更新系统托盘图标悬浮提示信息
            updateTip('end');
            let message:string='';
            let presentWork:Function;
            let buttons:string[]=['Exit','Go to the directory'];
            if(signal.success){
                // 任务成功结束时
                message=`Task ${taskOrder} finish, results path:\n${outputPath}`;
                // 当工作流会输出树时提供一键打开FigTree查看建树结果功能
                if(['IQ-TREE','MrBayes','wASTRAL'].includes(workflow[workflow.length-1])){
                    buttons.push('View in FigTree');
                }
                presentWork=()=>{
                    utilityProcess.fork(
                        path.join(__dirname,'scripts/view.js'),
                        [JSON.stringify(signal)]
                    );
                }
                // 报告任务完成给进度显示窗口
                processWindow.webContents.send('complete',String(taskOrder));
            }else{
                // 任务异常中止时
                message=`${signal.error} error in task ${taskOrder}:\ncheck logs at ${signal.log}`;
                buttons.push('Show the logs');
                presentWork=()=>child_process.exec(`notepad ${signal.log}`);
                // 报告任务出错给进度显示窗口
                processWindow.webContents.send('error',{
                    [String(taskOrder)]:signal.error
                });
            }
            // 根据任务结束状态生成不同弹窗
            dialog.showMessageBox({
                title:signal.success?'SUCCESS':'FAILURE',
                type:signal.success?'info':'error',
                buttons,
                message
            }).then(result=>{
                switch(result.response){
                    case 1:
                        shell.showItemInFolder(outputPath);
                        break;
                    case 2:
                        presentWork();
                        break;
                    default:
                        break;
                }
            });
        }else{
            // 任务进度更新时转发给进度显示窗口
            processWindow.webContents.send('progress',{
                [String(taskOrder)]:signal.progress
            });
        }
    });
}

// 加载配置方法
function loadConfig():string[]{
    const defaultConfigPath:string=path.join(global.configDir,'default');
    const defaultConfigs:string[]=fs.readdirSync(defaultConfigPath).map(item=>`*${item}`);
    const customConfigs:string[]=fs.readdirSync(global.configDir)
        .filter(item=>!(fs.lstatSync(path.join(global.configDir,item)).isDirectory()));
    const configList:string[]=defaultConfigs.concat(customConfigs)
        .map(item=>item.replace(path.extname(item),''));
    return [...configList,'...'];
}

// 导出配置方法
function outputConfig(_event:Event,value:CamlTreeConfig):string[]{
    if(confirmConfig(value)){
        const outputPath=dialog.showSaveDialogSync({
            title:'Save',
            defaultPath:global.configDir,
            filters:[{name:'CamlTree Config',extensions:['json']}]// CamlTree运行配置文件
        });
        if(outputPath !== undefined){
            fs.writeFileSync(outputPath,JSON.stringify(value));
        }
    }
    return loadConfig();
}

// 导入配置方法
function importConfig(_event:Event,name:string):CamlTreeConfig|null{
    let configPath:string|undefined;
    if(name === '...'){
        // 解析外部配置路径
        const choice:string[]|undefined=dialog.showOpenDialogSync({
            title:'Open',
            filters:[{name:'CamlTree Config',extensions:['json']}],
            properties:['openFile']
        });
        if(choice !== undefined){
            configPath=choice[0];
        }
    }else{
        // 解析内部配置路径
        let dirPath=global.configDir;
        if(name.startsWith('*')){
            // 解析程序内置配置路径
            configPath=path.join(dirPath,`default/${name.slice(1)}.json`);
        }else{
            // 解析用户自定义配置路径
            configPath=path.join(dirPath,`${name}.json`);
        }
    }
    let result:CamlTreeConfig;
    if(configPath !== undefined){
        // 解析配置路径导入配置信息
        result=JSON.parse(fs.readFileSync(configPath).toString());
        if(name.startsWith('*')){
            for(const [key,value] of Object.entries(result)){
                if((value as string).includes('/')){
                    result[key]=path.join(__dirname,value as string);
                }
            }
        }
        return confirmConfig(result)?result:null;
    }
    return null;
}

// 自动加载默认配置方法
function autoConfig():CamlTreeConfig{
    const configPath:string=path.join(global.configDir,'default/accurate.json');
    const result:CamlTreeConfig=JSON.parse(fs.readFileSync(configPath).toString());
    return result;
}

// 调用系统默认浏览器打开网页方法
function openURL(_event:Event,url:string):void{
    shell.openExternal(url);
}

// 检查本地是否配置JAVA环境方法
function checkJAVA():void{
    const task=child_process.exec('java -h',()=>{});
    task.on('exit',(code:number)=>{
        if(code !== 0){
            dialog.showMessageBox({
                title:'ERROR',
                type:'error',
                message:'JAVA is necessary for some functions, but it is not installed/configured correctly!'
            });
        }
    });
}

// 调用图形界面工具方法
function callGUItool(_event:Event,toolName:string):void{
    const toolPath:string=(global.toolPaths)[toolName.toLowerCase()+'Path'];
    child_process.exec(`java -jar ${toolPath}`);
}

// 打开文件夹方法
function openDirectory(_event:Event,path:string):void{
    shell.openPath(path);
}

// 启动应用
app.whenReady().then(()=>{
    // 拼接图标路径
    const iconPath:string=path.join(__dirname,'icons/icon@2x.png');
    // 创建窗口
    const mainWindow=createWindow(iconPath,{width:900,height:650});
    const subWindow=createWindow(iconPath,{width:500,height:300});
    // 加载页面
    if(app.isPackaged){
        const file:string=path.join(__dirname,'index.html');
        // 生产环境加载文件
        mainWindow.loadFile(file);
        subWindow.loadFile(file);
        // 移除窗口菜单栏
        mainWindow.removeMenu();
        subWindow.removeMenu();
    }else{
        const url:string='http://localhost:5173';
        // 开发环境加载URL
        mainWindow.loadURL(url);
        subWindow.loadURL(url);
        // 打开浏览器开发者工具
        mainWindow.webContents.openDevTools();
        subWindow.webContents.openDevTools();
    }
    // 子窗口跳转到进度页面
    subWindow.webContents.executeJavaScript('location.hash="/progress"');
    // 主窗口被关闭时应用退出
    mainWindow.on('close',app.quit);
    // 子窗口无法关闭只能隐藏
    subWindow.on('close',(event:Event)=>{
        event.preventDefault();
        subWindow.hide();
    });
    // 应用退出前强制关闭子窗口以防其阻碍退出
    app.on('before-quit',()=>{
        subWindow.destroy();
    });
    // 初始化系统托盘图标
    global.tray=initTray(iconPath,subWindow);
    // 加载内置第三方工具
    global.toolPaths=loadTools();
    // 初始化运行中任务个数
    global.runningTasks=0;
    // 加载内置配置存储目录
    global.configDir=path.join(__dirname,app.isPackaged?'../':'','config');
    // 检查JAVA配置
    checkJAVA();
    // 配置事件处理器
    ipcMain.handle('input',handleInput);
    ipcMain.handle('output',handleOutput);
    ipcMain.handle('run',(event,settings)=>handleSubmit(event,settings,subWindow));
    ipcMain.handle('save',outputConfig);
    ipcMain.handle('load',importConfig);
    ipcMain.handle('config',loadConfig);
    ipcMain.handle('auto',autoConfig);
    ipcMain.on('web',openURL);
    ipcMain.on('call',callGUItool);
    ipcMain.on('show',openDirectory);
});
