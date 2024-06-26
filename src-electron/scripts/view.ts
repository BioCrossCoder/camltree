import child_process from 'node:child_process';

// 解析从父进程接收的参数
const {figtreePath,treeFilePath}=JSON.parse((process.argv)[process.argv.length-1]);

// 生成figtree命令
const command:string=`java -jar ${figtreePath} ${treeFilePath}`;
// 调用子进程运行figtree
child_process.exec(command,()=>{});
