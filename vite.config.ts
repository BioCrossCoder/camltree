import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import electron from 'vite-electron-plugin';
import { rmSync,readdirSync,cpSync } from 'node:fs';
import path from 'node:path';

// 启动开发服务器和热更新时复制electron项目中的静态资源
const electronSrc:string='src-electron';
const electronDist:string='dist-electron';
if(readdirSync('.').includes(electronDist)){
  rmSync(electronDist,{recursive:true});
}
const staticDir:string=path.join(electronSrc,'static');
for(const item of readdirSync(staticDir)){
  cpSync(
    path.join(staticDir,item),
    path.join(electronDist,item),
    {recursive:true}
  );
}
// 根据运行平台复制不同版本的依赖工具
const tools:string=(process.platform === 'win32')?'tools-win':'tools-mac';
cpSync(
  path.join(electronSrc,tools),
  path.join(electronDist,'tools'),
  {recursive:true}
);
// 将jar包复制到依赖工具目录下
const javaTools:string=path.join(electronSrc,'tools-java');
for(const jar of readdirSync(javaTools)){
  cpSync(
    path.join(javaTools,jar),
    path.join(electronDist,'tools',jar)
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),// 配置React热更新
    electron({
      include:[electronSrc]
    })// 配置electron热更新
  ]
});
