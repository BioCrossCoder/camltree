# 开发文档

## 技术架构

+ 使用vite搭建项目开发环境，通过插件和配置实现了全量热更新开发。

+ 使用electron框架搭建的桌面应用程序，为界面提供了系统API和文件API。

+ 使用React框架基于TypeScript搭建的GUI界面，绝大部分组件基于框架原生封装实现，工作流定制部分引用了antd组件。

+ 引入emotion实现CSS-in-JS开发，采用vw/vh/%单位取代px单位实现了响应式界面布局。

+ 使用recoil进行状态管理，存储了运行参数配置信息、输入输出文件路径信息、应用加载状态、页面交互元素可用性状态等，组件通过recoil Hooks进行访问。

+ 使用react-router配置了页面路由，采用hash模式获得了较好的性能。

+ 使用NodeJS脚本实现后台核心逻辑，基于异步+子进程的多进程设计实现了并行运算。

+ 采用JSON格式作为运行配置文件。

+ 内置集成了MAFFT、MACSE、trimAl、IQ-TREE、MrBayes、FigTree、wASTRAL、ALTER。

+ 运行MACSE、FigTree、ALTER依赖的JRE(Java Running Environment)未内置。

## 项目结构

```shell
CamlTree-GUI
├── LICENSE 开源许可证
├── build.js 打包构建脚本
├── dependencies.txt 第三方命令行工具的资源链接清单
├── forge.config.js 打包配置(electron)
├── index.html 项目前端入口页面
├── package.json 项目依赖配置
├── package-make.json 打包依赖配置(electron)
├── src
│   ├── App.tsx 应用入口组件
│   ├── components
│   │   ├── ConfigSelector.tsx 配置选择器组件
│   │   ├── FileButton.tsx 打开文件路径按钮组件
│   │   ├── FilePath.tsx 文件路径块组件
│   │   ├── Introduce.tsx 程序简介文本块组件
│   │   ├── RunButton.tsx 运行按钮组件
│   │   ├── SelectorTemplate.tsx 选择器模板组件
|   |   ├── StepOptions.tsx 分析步骤选项栏组件
│   │   ├── TaskProgressList.tsx 任务进度列表组件
│   │   ├── TaskStepProgress.tsx 任务步骤进度组件
│   │   ├── TitlePictrue.tsx 标题图片组件
│   │   ├── ToolArgv.tsx 工具参数块组件
│   │   ├── ToolKit.tsx 工具箱组件
│   │   ├── WorkFlow.tsx 工作流组件
│   │   └── common
│   │       ├── ButtonTemplate.tsx 按钮模板组件
│   │       ├── HeaderLine.tsx 顶部行容器组件
│   │       ├── HelpButton.tsx 帮助按钮组件
│   │       ├── HelpText.tsx 帮助文本组件
│   │       ├── InputButton.tsx 输入按钮组件
│   │       ├── LinkButton.tsx 导航按钮组件
│   │       ├── ParagraphTemplate.tsx 文本段落模板组件
│   │       ├── ReturnButton.tsx 返回按钮组件
│   │       └── TextareaTemplate.tsx 文本区域模板组件
│   ├── main.tsx 应用入口脚本(react)
│   ├── pages
│   │   ├── Guide.tsx 指南页面
│   │   ├── Main.tsx 主页面
│   │   ├── Progress.tsx 进度页面
│   │   ├── Settings.tsx 配置页面
│   │   └── Start.tsx 运行页面
│   ├── router
│   │   └── index.tsx 页面路由配置(react-router)
│   ├── static
│   │   ├── docs.json 文档
│   │   ├── homepage.json 项目主页配置
│   │   └── title.png 标题图片
│   ├── stores
│   │   ├── alignment.ts 序列对齐方法状态
│   │   ├── allow.ts 页面可用性状态
│   │   ├── config.ts 工具参数配置状态
│   │   ├── directory.ts 输出目录列表状态
│   │   ├── index.ts 状态引用接口
│   │   ├── input.ts 输入文件列表状态
│   │   ├── iqtree.ts 运行参数状态(IQ-TREE)
│   │   ├── load.ts 应用加载状态
│   │   ├── macse.ts 运行参数状态(MACSE)
│   │   ├── mafft.ts 运行参数状态(MAFFT)
│   │   ├── optimize.ts 对齐优化方法状态
│   │   ├── output.ts 输出目录状态
│   │   ├── progress.ts 任务进度状态
│   │   ├── referrer.ts 页面来源状态
│   │   ├── running.ts 运行参数状态集合
│   │   ├── strategy.ts 分析策略状态
│   │   ├── task.ts 任务状态集合
│   │   ├── tree.ts 建树方法状态
│   │   ├── trimal.ts 运行参数状态(trimAl)
│   │   ├── unfold.ts 列表展开项状态
│   │   └── workflow.ts 工作流状态
│   └── vite-env.d.ts 类型声明文件(vite)
├── src-electron
│   ├── main.ts 应用入口脚本(electron)
│   ├── preload.ts 预加载脚本
│   ├── scripts
│   │   ├── view.ts 可视化脚本
│   │   └── worker.ts 任务执行脚本
│   ├── static
│   │   ├── config
│   │   │   └── default
│   │   │       ├── accurate.json 内置运行配置1(默认运行配置)
│   │   │       └── quick.json 内置运行配置2
│   │   └── icons
│   │       ├── icon.icns 应用图标(MacOS)
│   │       ├── icon.ico 应用图标(Windows)
│   │       └── icon@2x.png 任务栏图标
│   ├── tools-java 应用依赖工具(jar文件)
│   ├── tools-mac 应用依赖工具(MacOS版本)
│   └── tools-win 应用依赖工具(Windows版本)
├── tsconfig.json 编译配置(TypeScript)
├── tsconfig.node.json 编译配置(TypeScript-Node)
└── vite.config.ts 开发配置(vite)
```

## 备注事项

1. 为了向下兼容windows7等旧版本操作系统，采用22.x.x版本的`electron`。

2. 由于某次更新后样式失效问题，将CSS-in-JS实现从编译时方案`linaria`迁移至运行时方案`emotion`。

3. 进度条功能在开发环境下有时会出现阻滞问题：用户提交的任务已经弹窗提示完成，但进度条未推进至完成状态；这个问题在打包应用后，即生产环境下不存在，推测是`vite`存在无法使开发环境与生产环境表现保持一致的问题。
