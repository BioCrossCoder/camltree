const child_process=require('child_process');
const fs=require('fs');
const path = require('path');

// 通知打包开始
console.log('Building Start...');
// 清除开发环境编译打包目录
if(fs.readdirSync('.').includes('dist')){
    fs.rmSync('dist',{recursive:true});
}
if(fs.readdirSync('.').includes('dist-electron')){
    fs.rmSync('dist-electron',{recursive:true});
}
// 编译TypeScript并vite打包React
child_process.execSync('npx tsc && npx vite build');
// 初始化打包目录
if(fs.readdirSync('.').includes('package')){
    fs.rmSync('package',{recursive:true});
}
fs.mkdirSync('package');
// 将打包后的React应用迁移到electron打包目录下
for(const item of fs.readdirSync('dist')){
    fs.renameSync(path.join('dist',item),path.join('package',item));
}
fs.rmdirSync('dist');
// 将编译后的electron脚本迁移到electron打包目录下
for(const item of fs.readdirSync('dist-electron')){
    fs.renameSync(path.join('dist-electron',item),path.join('package',item));
}
fs.rmdirSync('dist-electron');
// 构建electron打包环境
fs.copyFileSync('forge.config.js','package/forge.config.js');
const {name,author,description,private,version}=JSON.parse(fs.readFileSync('package.json').toString());
const packageConfig={
    name,
    author,
    description,
    private,
    version,
    ...JSON.parse(fs.readFileSync('package-make.json').toString())
};
fs.writeFileSync('package/package.json',JSON.stringify(packageConfig));
fs.copyFileSync('LICENSE','package/LICENSE');
child_process.execSync('cd package && npm install');
// 打包electron并清除打包环境
child_process.execSync('cd package && npx electron-forge make');
if(fs.readdirSync('.').includes('out')){
    fs.rmSync('out',{recursive:true});
}
fs.renameSync('package/out','out');
fs.rmSync('package',{recursive:true});
// 通知打包完成
console.log('Building Finish!');
