import fs from 'node:fs';
import path from 'node:path';
import child_process, { ChildProcess } from 'node:child_process';

// 调用命令行工具方法
function callCMDTool(
    toolName:string,
    toolPath:string,
    toolArgv:string,
    inputPath:string,
    outputPath:string
):[any,string]{
    // 初始化命令行字段
    const commandFragments:string[]=[`${toolPath} ${toolArgv}`];
    let logPath:string='';
    // 根据不同任务类型生成命令行字段
    switch(toolName){
        // 生成MAFFT命令
        case 'MAFFT':
            logPath=outputPath.replace('.fa','.log');
            commandFragments.push(`${inputPath}>${outputPath} 2>${logPath}`);
            break;
        // 生成trimAl命令
        case 'trimAl':
            logPath=outputPath.replace('.fa','.log');
            commandFragments.push(`-in ${inputPath} -out ${outputPath} 2>${logPath}`);
            break;
        // 生成IQ-TREE命令
        case 'IQ-TREE':
            logPath=outputPath+'.log';
            commandFragments.push(`-s ${inputPath} --prefix ${outputPath}`);
            break;
        // 生成MACSE命令
        case 'MACSE':
            logPath=outputPath+'.log';
            commandFragments.push(`-seq ${inputPath} -out_NT ${outputPath.replace('.fa','_NT.fa')} -out_AA ${outputPath.replace('.fa','_AA.fa')} > ${logPath}`);
            break;
        default:
            break;
    }
    // 拼接字段生成命令
    const command:string=commandFragments.join(' ');
    // 将命令写入日志记录
    const cmdLog:string=logPath.replace('.log','_cmd.log');
    fs.writeFileSync(cmdLog,command);
    // 创建子进程后台运行任务
    const task=child_process.exec(command,()=>{});
    return [task,logPath];
}

// 定义序列映射表类型
interface SequenceMap{
    [index:string]:string
}

// 延伸序列方法
function extendSequences(inputFile:string,mappings:SequenceMap):void{
    // 根据字符串特征提取序列名称行
    const content:string[]=fs.readFileSync(inputFile,{encoding:'utf-8'})
        .split('\n').map(line=>line.trim()).filter(line=>line!=='');
    const lines:number[]=content.filter(line=>line.startsWith('>'))
        .map(line=>content.indexOf(line)).concat(content.length);
    for(const [index,line] of Object.entries(lines.slice(0,lines.length-1))){
        // 基于字符识别提取序列名称
        const titleLine:string=content[line];
        const end:number=titleLine.includes(' ')?titleLine.indexOf(' '):titleLine.length;
        const seqName:string=titleLine.slice(1,end);
        // 根据序列名称将序列片段拼接到映射表中对应序列末尾
        const seqFragment:string=content.slice(line+1,lines[Number(index)+1]).join('');
        if(!mappings.hasOwnProperty(seqName)){
            mappings[seqName]='';
        }
        mappings[seqName]+=seqFragment;
    }
}

// 输出拼接序列方法
function outputConcatentaion(mappings:SequenceMap,outputPath:string):void{
    for(const [key,value] of Object.entries(mappings)){
        fs.appendFileSync(outputPath,`>${key}\n${value}\n`);
    }
}

// 拼接序列方法
function linkSequences(inputFiles:string[],outputDir:string,outputName:string):string{
    // 读取输入以拼接序列存入映射表
    let mappings:SequenceMap={};
    for(const inputFile of inputFiles){
        extendSequences(inputFile,mappings);
        // 向主进程反馈进度更新
        reportProgressUpdate(progress,'Concatenation');
    }
    // 将拼接完成的序列从映射表中导出
    const outputPath:string=path.join(outputDir,outputName);
    outputConcatentaion(mappings,outputPath);
    return outputPath;
}

// 定义Electron中的进程对象类型接口
interface ElectronProcess{
    parentPort:MessagePort
}

// 报错回调函数
function reportError(taskName:string,logPath:string):void{
    (process as unknown as ElectronProcess).parentPort.postMessage({
        finish:true,
        success:false,
        error:taskName,
        log:logPath
    });
    process.exit();
}

// 对齐格式转换函数
function convertAlignmentFormat(
    toolPath:string,
    inputPath:string,
    outputPath:string,
    outputFormat:'FASTA'|'NEXUS',
    outputProgram:'MrBayes'|'GENERAL',
):[any,string]{
    // 生成日志路径
    const logPath:string=outputPath.replace((outputProgram === 'MrBayes')?'.nex':'.fa','_convert.log');
    // 生成ALTER命令
    const command:string=`java -jar ${toolPath} -i ${inputPath} -ia -o ${outputPath} -of ${outputFormat} -op ${outputProgram} -oo ${process.platform.startsWith('win')?'Windows':'MacOS'} 2>${logPath}`;
    // 将命令写入日志记录
    const cmdLog:string=logPath.replace('.log','_cmd.log');
    fs.writeFileSync(cmdLog,command);
    // 创建子进程后台执行命令
    const task=child_process.exec(command,()=>{});
    return [task,logPath];
}

// 模型选取方法
function callModelFinder(
    toolPath:string,
    inputPath:string,
    outputDir:string
):[ChildProcess,string]{
    // 生成输出路径
    const outputPath:string=path.join(outputDir,path.basename(inputPath));
    const logPath:string=outputPath+'.log';
    // 生成ModelFinder命令
    const command:string=`${toolPath} -s ${inputPath} --prefix ${outputPath} -m TEST --mset mrbayes`;
    // 将命令写入日志记录
    const cmdLog:string=logPath.replace('.log','_cmd.log');
    fs.writeFileSync(cmdLog,command);
    // 创建子进程后台执行命令
    const task=child_process.exec(command,()=>{});
    return [task,logPath];
}

// 贝叶斯建树方法
function callMrbayes(
    toolPath:string,
    inputPath:string,
    outputPath:string,
    modelArgvs:string[]
):[any,string]{
    // 根据选定模型生成模型参数
    let [nst,freq,rates,Ngammacat]:[number,string,string,number]=[0,'','',0];
    // 生成nst参数
    const modelBase=modelArgvs.shift() as string;
    if(['JC','JC69','F81'].includes(modelBase)){
        nst=1;
    }else if(['HKY','HKY85','K2P','K80'].includes(modelBase)){
        nst=2;
    }else if(!['WAG','JTT','VT','Blosum62','Dayhoff','mtREV','mtMAM','rtREV','cpREV'].includes(modelBase)){
        nst=6;
    }
    // 生成freq参数
    if(['SYM','K2P','K80','JC','JC69'].includes(modelBase)){
        freq='equal';
    }else if(modelArgvs[0].startsWith('F')){
        if(modelArgvs[0] === 'F'){
            freq='empirical';
        }else if(modelArgvs[0] === 'FQ'){
            freq='equal';
        }
        modelArgvs.shift();
    }
    // 生成rates参数
    const restArgv:string=modelArgvs.join('+');
    if(restArgv === 'I'){
        rates='propinv';
    }else if(restArgv.startsWith('G')){
        rates='gamma';
        Ngammacat=Number(restArgv.slice(1));
    }else if(restArgv.startsWith('I+G')){
        rates='invgamma';
        Ngammacat=Number(restArgv.slice(3));
    }
    const modelSettingFields:string[]=['lset'];
    // 当nst不为0时说明为核苷酸取代模型，插入nst参数片段
    if(nst !== 0){
        modelSettingFields.push(`nst=${nst}`);
    }
    // 当rates不为空时插入rates参数片段
    if(rates !== ''){
        modelSettingFields.push(`rates=${rates}`);
    }
    // 当Ngammacat不为0时插入Ngammacat参数片段
    if(Ngammacat !== 0){
        modelSettingFields.push(`Ngammacat=${Ngammacat}`);
    }
    const modelSettingLines:string[]=[modelSettingFields.join(' ')+';'];
    // 当lset参数行为空时舍弃该行
    if(modelSettingLines[0] === 'lset;'){
        modelSettingLines.pop();
    }
    // 当nst为0时说明为氨基酸取代模型，插入相应片段
    if(nst === 0){
        const Aamodelpr:string=(modelBase === 'JTT')?'jones':modelBase.toLowerCase();
        modelSettingLines.push(`prset Aamodelpr=fixed(${Aamodelpr});`);
    }
    // 当freq不为空时插入freq参数行
    if(freq !== ''){
        modelSettingLines.push(`prset statefreqpr = fixed(${freq});`);
    }
    // 拼接根据模型生成的运行参数
    const modelSettings:string=modelSettingLines.join('\n');
    // 生成日志路径
    const logPath:string=path.join(outputPath,'log.txt');
    // 生成运行参数
    const runningArgv:string[]=[
        'begin mrbayes;',
        `log start filename = ${logPath};`,
        modelSettings,
        'mcmcp ngen=2000000 samplefreq=1000 nchains=4 nruns=2 savebrlens=yes checkpoint=yes checkfreq=1000;',
        'mcmc;',
        'sumt conformat=Figtree contype=Allcompat relburnin=yes burninfrac=0.25;',
        'sump relburnin=yes burninfrac=0.25;',
        'end;'
    ];
    // 将输入文件复制到输出目录并追加写入运行参数
    const inputFile:string=path.join(outputPath,path.basename(inputPath));
    fs.copyFileSync(inputPath,inputFile);
    fs.appendFileSync(inputFile,runningArgv.join('\n'));
    // 生成命令并创建子进程后台运行
    const command:string=`${toolPath} ${inputFile}`;
    const task=child_process.exec(command,()=>{});
    return [task,logPath];
}

// 合并进化树方法
function mergeTrees(
    toolPath:string,
    inputPaths:string[],
    outputDir:string,
):[any,string,string]{
    // 创建输入文件
    const inputTrees:string=path.join(outputDir,'input.nwk');
    fs.writeFileSync(inputTrees,'');
    // 将需要合并的进化树合并到输入文件中
    for(const tree of inputPaths){
        fs.appendFileSync(inputTrees,fs.readFileSync(tree));
    }
    // 生成输出路径
    const outputPath:string=path.join(outputDir,'result.nwk');
    // 生成目录路径
    const logPath:string=path.join(outputDir,'log.txt');
    // 生成命令
    const command:string=`${toolPath} -i ${inputTrees} -o ${outputPath} 2>${logPath}`;
    // 将命令写入日志记录
    const cmdLog:string=path.join(outputDir,'cmd.log');
    fs.writeFileSync(cmdLog,command);
    // 创建子进程后台运行任务
    const task=child_process.exec(command,()=>{});
    return [task,logPath,outputPath];
}

// 定义任务进度类型
interface Progress{
    (index:string):[number,number]
}

// 反馈进度更新方法
function reportProgressUpdate(progress:Progress,step:string){
    progress[step][0]++;
    (process as unknown as ElectronProcess).parentPort.postMessage({
        finish:false,
        progress
    });
}

// 处理任务方法
function executeTasks(taskList:string[],order:number){
    // 任务列表为空时通知主进程任务成功并传递figtree运行参数
    if(taskList.length === 0){
        (process as unknown as ElectronProcess).parentPort.postMessage({
            finish:true,
            success:true,
            treeFilePath:(inputPaths as string[]).join(' '),
            figtreePath
        });
        process.exit();
    }
    // 从列表头取出即将执行的任务
    const taskName:string=taskList.shift()!;
    // 防止列表为空时弹出未定义变量创建多余任务目录
    if(taskName === undefined){
        return;
    }
    // 创建任务输出子目录
    const taskDir:string=path.join(outputDirPath,`${order}-${taskName}_results`);
    fs.mkdirSync(taskDir);
    // 根据任务类型执行不同任务
    switch(taskName){
        // 贝叶斯建树
        case 'MrBayes':
            // 创建核苷酸/氨基酸取代模型输出目录
            const modelDir:string=path.join(taskDir,'models');
            fs.mkdirSync(modelDir);
            // 创建格式转换输出目录
            const convertDir:string=path.join(taskDir,'inputs');
            fs.mkdirSync(convertDir);
            // 初始化贝叶斯建树子任务完成状态
            const buildFinish:boolean[]=Array(inputPaths.length).fill(false);
            // 遍历输入创建多进程任务
            for(const [index,entry] of Object.entries(inputPaths)){
                // 初始化状态-贝叶斯建树是否运行、模型搜索是否完成、格式转换是否完成
                let [mrbayesWork,modelArgvs,convertFinish]:[{running:boolean},string[],boolean]=[{running:false},[],false];
                // 为单个输入创建子进程搜索取代模型
                const [modelTask,modelLog]=callModelFinder(iqtreePath,entry as string,modelDir);
                // 对输入对齐作格式转换生成建树输入
                const nexusName:string=path.basename(entry as string).replace(path.extname(entry as string),'.nex');
                const nexusPath:string=path.join(convertDir,nexusName);
                const [convertTask,convertLog]=convertAlignmentFormat(alterPath,entry as string,nexusPath,'NEXUS','MrBayes');
                // 封装贝叶斯建树回调
                function buildBayesTree(taskOrder:string){
                    mrbayesWork.running=true;
                    // 生成下一步输入路径
                    const outputTreePath:string=path.join(taskDir,nexusName)+'.con.tre';
                    inputPaths[taskOrder]=outputTreePath;
                    // 为单个输入创建子进程调用MrBayes进行建树
                    const [treeTask,treeLog]=callMrbayes(mrbayesPath,nexusPath,taskDir,modelArgvs);
                    treeTask.on('exit',(code:number)=>{
                        // 子进程退出返回码不为0时报错
                        if(code !== 0){
                            reportError('MrBayes',treeLog);
                        }
                        buildFinish[index]=true;
                        // 向主进程反馈进度更新
                        reportProgressUpdate(progress,taskName);
                        // 全部建树完成后执行下一步任务
                        if(buildFinish.every(finish=>finish)){
                            executeTasks(taskList,order+1);
                        }
                    });
                }
                convertTask.on('exit',(code:number)=>{
                    // 子进程退出返回码不为0时报错 
                    if(code !== 0){
                        reportError('ALTER',convertLog);
                    }
                    // 当模型搜索完成且未运行建树时执行建树
                    if((modelArgvs.length > 0) && (!mrbayesWork.running)){
                        buildBayesTree(index);
                    }
                    convertFinish=true;
                });
                modelTask.on('exit',(code:number)=>{
                    // 子进程退出返回码不为0时报错
                    if(code !== 0){
                        reportError('ModelFinder',modelLog);
                    }
                    // 子进程顺利完成时从日志文件中提取结果
                    const records:string[]=fs.readFileSync(modelLog).toString().split('\n');
                    for(const line of records){
                        if(line.startsWith('Bayesian Information Criterion:')){
                            modelArgvs=line.split(':')[1].trim().split('+');
                            break;
                        }
                    }
                    // 当序列转换完成且未运行建树时根据得到的模型调用Mrbayes建树
                    if(convertFinish && (!mrbayesWork.running)){
                        buildBayesTree(index);
                    }
                });
            }
            break;
        // 对齐序列拼接
        case 'Concatenation':
            try{
                const outputSeqs:string=linkSequences(inputPaths,taskDir,'concatenated_sequences.fa');
                // 成功时生成下一步输入路径
                inputPaths.length=1;
                inputPaths[0]=outputSeqs;
            }catch(error){
                // 出错时生成错误日志并报错
                const logPath:string=path.join(taskDir,'log.txt');
                fs.writeFileSync(logPath,error.toString());
                reportError(taskName,logPath);
            }
            // 执行下一步任务
            executeTasks(taskList,order+1);
            break;
        // 进化树合并
        case 'wASTRAL':
            const [task,log,result]=mergeTrees(astralPath,inputPaths,taskDir);
            task.on('exit',()=>{
                // 输出文件为空时报错
                if(fs.readFileSync(result).length === 0){
                    reportError(taskName,log);
                }
                // 向主进程反馈进度更新
                reportProgressUpdate(progress,taskName);
                // 生成下一步输入路径
                inputPaths.length=1;
                inputPaths[0]=result;
                // 执行下一步任务
                executeTasks(taskList,order+1);
            });
            break;
        // 对齐格式转换
        case 'ALTER':
            // 初始化格式转换子任务完成状态
            const convertFinish:boolean[]=Array(inputPaths.length).fill(false);
            // 遍历输入进行格式转换
            for(const [index,entry] of Object.entries(inputPaths)){
                // 当输入文件为FASTA格式时跳过
                if(fastaSuffix.includes(path.extname(entry as string))){
                    convertFinish[index]=true;
                    continue;
                }
                // 生成输出路径
                const outputName:string=path.basename(entry as string).replace(path.extname(entry as string),'.fa');
                const outputPath:string=path.join(taskDir,outputName);
                // 生成下一步输入路径
                inputPaths[index]=outputPath;
                // 为单个输入创建子进程调用ALTER进行格式转换
                const [task,log]=convertAlignmentFormat(alterPath,entry as string,outputPath,'FASTA','GENERAL');
                task.on('exit',()=>{
                    // 错误日志不为空时报错
                    if(fs.readFileSync(log).length > 0){
                        reportError(taskName,log);
                    }
                    convertFinish[index]=true;
                    // 向主进程反馈进度更新
                    reportProgressUpdate(progress,taskName);
                    // 全部输入转换成功时执行下一步任务
                    if(convertFinish.every(finish=>finish)){
                        executeTasks(taskList,order+1);
                    }
                });
            }
            break;
        default:
            const nextTask:string|undefined=taskList.shift();
            // 当任务为多序列对齐时检查下一步任务是否为对齐优化
            const alnOpt:boolean=(['MAFFT','MACSE'].includes(taskName)) && (nextTask === 'trimAl');
            // 当任务为多序列对齐或对齐优化时检查下一步任务是否为序列拼接
            let alnConcat:boolean=(['MAFFT','MACSE','trimAl'].includes(taskName)) && (nextTask === 'Concatenation');
            // 当无缝衔接序列拼接时直接创建下一步输出目录并生成输出文件路径和日志路径
            let concatDir:string='';
            let concatOutput:string='';
            let concatLog:string='';
            if(alnConcat){
                concatDir=path.join(outputDirPath,`${order+1}-Concatenation_results`);
                fs.mkdirSync(concatDir);
                concatOutput=path.join(concatDir,'concatenated_sequences.fa');
                concatLog=path.join(concatDir,'log.txt');
            }
            if(alnOpt){
                // 当任务为多序列对齐且下一步为对齐优化时直接创建其输出目录
                var optDir=path.join(outputDirPath,`${order+1}-trimAl_results`);
                fs.mkdirSync(optDir);
                // 检查对齐优化后下一步是否为序列拼接
                const nextTask2:string|undefined=taskList.shift();
                if(nextTask2 === 'Concatenation'){
                    // 当下一步任务是序列拼接时直接创建其输出目录并生成输出文件路径和日志路径
                    alnConcat=true;
                    concatDir=path.join(outputDirPath,`${order+2}-Concatenation_results`);
                    fs.mkdirSync(concatDir);
                    concatOutput=path.join(concatDir,'concatenated_sequences.fa');
                    concatLog=path.join(concatDir,'log.txt');
                }else if(nextTask2 !== undefined){
                    // 当下一步任务不是序列拼接且存在时放回任务列表
                    taskList.unshift(nextTask2);
                }
            }else if(nextTask !== undefined){
                // 当下一步任务不是对齐优化且存在时放回任务列表
                taskList.unshift(nextTask);
            }
            // 创建用于序列拼接的映射表和错误日志
            if(alnConcat){
                var mappings:SequenceMap={};
            }
            // 初始化子任务完成状态
            const taskFinish:boolean[]=Array(inputPaths.length).fill(false);
            // 生成子进程调用工具的路径和运行参数
            const tool:string=taskName.replace('-','').toLowerCase();
            const toolPath:string=eval(tool+'Path');
            const toolArgv:string=eval(tool+'Argv');
            // 遍历输入创建多进程任务
            for(const [index,entry] of Object.entries(inputPaths)){
                // 根据任务类型生成输出路径
                let outputName:string;
                switch(taskName){
                    case 'trimAl':
                        outputName=path.basename(entry as string).replace(path.extname(entry as string),'_concentrated.fa');
                        break;
                    case 'IQ-TREE':
                        outputName=path.basename(entry as string).replace(path.extname(entry as string),'_iqtree');
                        break;
                    default:
                        outputName=path.basename(entry as string).replace(path.extname(entry as string),'_msa.fa');
                        break;
                }
                const outputPath:string=path.join(taskDir,outputName);
                // 根据任务类型生成下一步输入路径
                switch(taskName){
                    case 'IQ-TREE':
                        inputPaths[index]=outputPath+'.treefile';
                        break;
                    case 'MACSE':
                        inputPaths[index]=outputPath.replace('.fa','_NT.fa');
                        break;
                    default:
                        inputPaths[index]=outputPath;
                        break;
                }
                // 为单个输入创建子进程调用工具执行任务
                const [task,log]=callCMDTool(taskName,toolPath,toolArgv,entry as string,outputPath);
                task.on('exit',(code:number)=>{
                    // 子进程退出返回码不为0时报错
                    if(code !== 0){
                        reportError(taskName,log);
                    }
                    // 向主进程反馈进度更新
                    reportProgressUpdate(progress,taskName);
                    if(alnOpt){
                        // 当任务为多序列对齐且下一步为对齐优化时子任务无缝衔接
                        const outputName:string=path.basename(inputPaths[index]).replace(path.extname(inputPaths[index]),'_concentrated.fa');
                        const outputPath:string=path.join(optDir,outputName);
                        const [optTask,optLog]=callCMDTool('trimAl',trimalPath,trimalArgv,inputPaths[index],outputPath);
                        // 生成下一步输入路径
                        inputPaths[index]=outputPath;
                        optTask.on('exit',(code:number)=>{
                            // 子进程退出返回码不为0时报错
                            if(code !== 0){
                                reportError('trimAl',optLog);
                            }
                            // 向主进程反馈进度更新
                            reportProgressUpdate(progress,'trimAl');
                            // 当需要进行序列拼接时，读取输出序列将其拼接到映射表中
                            if(alnConcat){
                                try{
                                    extendSequences(outputPath,mappings);
                                    // 向主进程反馈进度更新
                                    reportProgressUpdate(progress,'Concatenation');
                                }catch(error){
                                    // 出错时生成错误日志并报错
                                    fs.writeFileSync(concatLog,error.toString());
                                    reportError('Concatenation',concatLog);
                                }
                            }
                            taskFinish[index]=true;
                            // 全部子任务完成后执行下一步任务
                            if(taskFinish.every(finish=>finish)){
                                if(alnConcat){
                                    // 进行了序列拼接时，将完成拼接的序列从映射表输出到文件
                                    try{                                    
                                        outputConcatentaion(mappings,concatOutput);
                                    }catch(error){
                                        // 出错时生成错误日志并报错
                                        fs.writeFileSync(concatLog,error.toString());
                                        reportError('Concatenation',concatLog);
                                    }
                                    // 生成下一步输入路径
                                    inputPaths.length=1;
                                    inputPaths[0]=outputPath;
                                    // 已经完成了序列对齐后的对齐优化和序列拼接，所以任务序列号加3
                                    executeTasks(taskList,order+3);
                                }else{
                                    // 已经完成了序列对齐后的对齐优化，所以任务序列号加2
                                    executeTasks(taskList,order+2);
                                }
                            }
                        });
                    }else{
                        // 当需要进行序列拼接时，读取输出序列将其拼接到映射表中
                        if(alnConcat){
                            try{
                                extendSequences(outputPath,mappings);
                                // 向主进程反馈进度更新
                                reportProgressUpdate(progress,'Concatenation');
                            }catch(error){
                                // 出错时生成错误日志并报错
                                fs.writeFileSync(concatLog,error.toString());
                                reportError('Concatenation',concatLog);
                            }
                        }
                        taskFinish[index]=true;
                        // 全部子任务完成后执行下一步任务
                        if(taskFinish.every(finish=>finish)){
                            if(alnConcat){
                                // 进行了序列拼接时，将完成拼接的序列从映射表输出到文件
                                try{                                    
                                    outputConcatentaion(mappings,concatOutput);
                                }catch(error){
                                    // 出错时生成错误日志并报错
                                    fs.writeFileSync(concatLog,error.toString());
                                    reportError('Concatenation',concatLog);
                                }
                                // 生成下一步输入路径
                                inputPaths.length=1;
                                inputPaths[0]=outputPath;
                                // 已经完成了序列对齐后的序列拼接，所以任务序列号加2
                                executeTasks(taskList,order+2);
                            }else{
                                executeTasks(taskList,order+1);
                            }
                        }
                    }
                });
            }
            break;
    }
}

// 解析从父进程接收的参数
const {
    mafftPath,
    figtreePath,
    macsePath,
    alterPath,
    trimalPath,
    iqtreePath,
    mrbayesPath,
    astralPath,
    mafftArguments:mafftArgv,
    trimalArguments:trimalArgv,
    iqtreeArguments:iqtreeArgv,
    macseArguments:macseArgv,
    workflow,
    input:inputPaths,
    output:outputDirPath,
    fastaSuffix
}=JSON.parse((process.argv)[process.argv.length-1]);
// 创建输出目录
try{
    fs.mkdirSync(outputDirPath,{recursive:true});
}catch(error){};
// 根据工作流执行任务
const tasks:string[]=workflow.split('->');
// 当输入文件存在非FASTA格式对齐序列时增加一步格式转换作为预处理
if(
    (tasks.toString() !== 'wASTRAL') 
    && 
    (['MAFFT','MACSE'].every(step=>!tasks.includes(step)))
    &&
    (!inputPaths.every((filePath:string)=>
        fastaSuffix.includes(path.extname(filePath))
    ))
){
    tasks.unshift('ALTER');
}
// 创建任务执行进度
const progress={} as Progress;
for(const task of tasks){
    // 初始化序列对齐/对齐优化/序列拼接进度
    if(['MAFFT','MACSE','trimAl','Concatenation'].includes(task)){
        progress[task]=[0,inputPaths.length];
    }
    // 初始化进化树构建进度
    if(['IQ-TREE','MrBayes'].includes(task)){
        const treeCount:number=tasks.includes('Concatenation')?1:inputPaths.length;
        progress[task]=[0,treeCount];
    }
    // 初始化进化树合并进度
    if(task === 'wASTRAL'){
        progress[task]=[0,1];
    }
    // 初始化对齐转换进度
    if(task === 'ALTER'){
        let convertCount:number=0;
        for(const filePath of inputPaths){
            if(!fastaSuffix.includes(path.extname(filePath))){
                convertCount++;
            }
        }
        progress[task]=[0,convertCount];
    }
}
// 将任务进度发送给主进程
(process as unknown as ElectronProcess).parentPort.postMessage({
    finish:false,
    progress
});
// 从计数第一步开始执行任务流
executeTasks(tasks,1);
