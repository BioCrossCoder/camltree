import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil';
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 提供全局状态管理上下文 */}
    <RecoilRoot>
      <App/>
    </RecoilRoot>
  </React.StrictMode>,
);
