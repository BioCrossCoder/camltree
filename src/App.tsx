import { RouterProvider,createHashRouter } from 'react-router-dom';
// 导入路由配置
import { routes } from './router';
// 导入全局状态-配置状态、加载状态
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ConfigState } from './stores/config';
import { LoadState } from './stores/load';

// 定义CamlTree配置类型
interface CamlTreeConfig{
    mafftArguments:string,
    trimalArguments:string,
    iqtreeArguments:string,
    macseArguments:string
}

function App() {
  // 创建HASH模式路由
  const router=createHashRouter(routes);
  // 使用全局状态-配置状态、加载状态
  const [load,setLoad]=useRecoilState(LoadState);
  const setConfig=useSetRecoilState(ConfigState);
  // 应用初次加载时自动导入默认配置
  if(!load){
    window.electronAPI.autoConfig().then((result:CamlTreeConfig)=>{
      setConfig(result);
      setLoad(true);
    });
  }
  return (
    <div className="App">
      {/* 挂载路由出口 */}
      <RouterProvider router={router}/>
    </div>
  )
}

export default App;
