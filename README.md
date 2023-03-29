# CamlTree

## 简介

生物信息学工具，主要用于对线粒体/病毒来源的功能微基因做系统发育分析；同时适用于任意核酸序列和氨基酸序列的系统发育分析。

## 产品特色

+ 简单易用且功能强大。

+ 简洁美观的响应式图形界面。

+ 同时支持Windows和MacOS的跨平台桌面应用程序（为了向下兼容旧版本操作系统，electron采用22.x.x版本）。

+ 集成了几种业内流行的第三方工具且可定制运行参数。

+ 具有同类产品通常不具备的热更新功能（基于GitHub进行配置，国内网络可能无法正常访问）。

## 用户手册

### 快速开始

1. 跳转页面：点击START按钮。

2. 选择输入文件
   + 方法1：点击OPEN按钮打开弹窗选择输入文件（允许进行多选）后点击确定按钮；注意当运行任务为figtree时需要通过弹窗中文件名输入框右侧的下拉列表选择Phylogeny Tree类型文件。
   + 方法2：点击MODIFY按钮后键盘输入文件路径（每行一个输入文件的路径），完成后点击OK按钮。

3. 配置输出路径
   + 方法1：点击SAVE按钮打开弹窗选择输出文件夹目录，输入自定义的目录名称后点击确定按钮。
   + 方法2：点击MODIFY按钮后键盘输入目标路径（只能输入一个路径且不允许手动换行），完成后点击OK按钮。

4. 选择运行任务：通过tasks下拉列表选择器来选择运行的任务（选择figtree任务时输入文件可以为空，输出路径无效）。

5. 提交任务运行：点击RUN按钮来执行检查（默认为integrated），在核验弹窗内容无误后点击确定提交任务，任务将在后台运行。

6. 任务结束提示：当任务运行结束时（figtree除外），程序会弹窗提示；可以通过弹窗中的按钮查看输出结果目录；在integrated任务完成时可以通过figtree可视化查看输出结果。

7. 异常处理：在提交任务前程序会检查输入输出参数是否有问题，有问题时会阻止提交并弹窗提示错误；在任务执行过程中出错时，程序会直接中止任务并弹窗提示错误，可以通过弹窗中的按钮直接打开错误日志进行查看。

### 如何定制

1. 跳转页面：当默认配置不满足需求时，在主页面点击Customize按钮以定制工具运行参数。

2. 修改参数

   + 方法1：每个工具配置项的运行参数都会显示在文本框中，点击MODIFY按钮后用键盘在文本框中修改参数，完成后点击OK按钮。
   + 方法2：在config下拉列表选择器选择配置（*开头表示程序内置配置；...表示从外部文件导入）后点击LOAD按钮，检查弹窗内容无误后点击确认，导入的运行参数会直接覆盖当前参数。

3. 开始任务：点击START按钮后跳转到运行页面，后续操作参考《快速开始》。

4. 导出配置：点击EXPORT按钮将当前配置导出为JSON文件，之后可以用于导入（保存在弹窗默认的config目录则配置会加载到config选择器列表中，可以作为内部配置导入）。

### 注意事项

1. JAVA运行环境（JRE）是运行FigTree必要的依赖；如果要在integrated任务结束后进行FigTree可视化或者运行figtree任务，则需要在运行的电脑上本地安装JRE并将其可执行文件路径配置到环境变量中。

2. 在integrated任务中需要被连接到一起的输入序列必须拥有完全相同的序列名称（在FASTA文件中序列信息行必须以>开头，其后的字符中位于分隔符前的所有字符组成的字符串会被识别为序列名称，分隔符是在字符串中检测到的第一个非字母数字的特殊符号（但不能为.或者>））以保证它们被正确地连接。

3. 在没有特定需求的情况下，推荐采用默认配置运行任务。

## 技术架构

+ 使用vite搭建项目开发环境，通过插件和配置实现了全量热更新开发。

+ 使用electron框架搭建的桌面应用程序，为界面提供了系统API和文件API。

+ 使用React框架基于TypeScript搭建的GUI界面，所有组件均基于框架原生封装实现。

+ 引入linaria实现css-in-js开发，采用vw/vh/%单位取代px单位实现了响应式界面布局。

+ 使用recoil进行状态管理，存储了运行参数配置信息、输入输出文件路径信息、应用加载状态、页面交互元素可用性状态等，组件通过recoil Hooks进行访问。

+ 使用react-router配置了页面路由，采用hash模式获得了较好的性能。

+ 使用NodeJS脚本实现后台核心逻辑，基于异步+子进程的多进程设计实现了并行运算。

+ 采用JSON格式作为运行配置文件。

+ 内置集成了MAFFT、trimAl、IQ-TREE、FigTree。

+ 运行FigTree需另行安装其运行依赖的JRE（Java Running Environment）。

+ 备注事项(linaria)

>1. 开发服务器启动和热更新时经常容易报错，但配置和依赖均无问题，此时手动重启服务即可。
>2. 创建新的css样式或styled组件时，如果没有被组件渲染内容引用，则会报错无法在运行时使用。

## 项目结构

```
CamlTree-GUI
├── LICENSE 开源许可证
├── README.md 本文档
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
│   │   ├── InputButton.tsx 输入按钮组件
│   │   ├── Introduce.tsx 程序简介文本块组件
│   │   ├── ModeSelector.tsx 模式选择器组件
│   │   ├── RunButton.tsx 运行按钮组件
│   │   ├── Runner.tsx 运行器组件
│   │   ├── TitlePictrue.tsx 标题图片组件
│   │   ├── ToolArgv.tsx 工具参数块组件
│   │   └── common
│   │       ├── ButtonTemplate.tsx 按钮模板组件
│   │       ├── HeaderLine.tsx 顶部行容器组件
│   │       ├── HelpButton.tsx 帮助按钮组件
│   │       ├── HelpText.tsx 帮助文本组件
│   │       ├── LinkButton.tsx 导航按钮组件
│   │       ├── ParagraphTemplate.tsx 文本段落模板组件
│   │       ├── ReturnButton.tsx 返回按钮组件
│   │       ├── SelectorTemplate.tsx 选择器模板组件
│   │       └── TextareaTemplate.tsx 文本区域模板组件
│   ├── main.tsx 应用入口脚本(react)
│   ├── pages
│   │   ├── Guide.tsx 指南页面
│   │   ├── Main.tsx 主页面
│   │   ├── Settings.tsx 配置页面
│   │   └── Start.tsx 运行页面
│   ├── router
│   │   └── index.tsx 页面路由配置(react-router)
│   ├── static
│   │   ├── docs.json 文档
│   │   ├── title.png 标题图片
│   │   └── server.json 自动更新服务器配置
│   ├── stores
│   │   ├── allow.ts 页面可用性状态
│   │   ├── config.ts 工具参数配置状态
│   │   ├── figtree.ts 运行参数状态(FigTree)
│   │   ├── index.ts 状态引用接口
│   │   ├── input.ts 输入文件列表状态
│   │   ├── iqtree.ts 运行参数状态(IQ-TREE)
│   │   ├── load.ts 应用加载状态
│   │   ├── mafft.ts 运行参数状态(MAFFT)
│   │   ├── mode.ts 运行模式状态
│   │   ├── output.ts 输出目录状态
│   │   ├── running.ts 运行参数状态集合
│   │   └── trimal.ts 运行参数状态(trimAl)
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
│   ├── tools-mac 应用依赖工具(MacOS版本)
│   └── tools-win 应用依赖工具(Windows版本)
├── tsconfig.json 编译配置(TypeScript)
├── tsconfig.node.json 编译配置(TypeScript-Node)
└── vite.config.ts 开发配置(vite)
```

## 版权声明

1. 本程序是开源免费的，遵循开源协议GPLv3，不允许商业使用；重新分发的第三方程序均不包含源代码。

2. 重新分发的MAFFT使用了官方提供的预编译版本，根据官方要求在mac版本中添加了官方提供的BSD版权声明。

3. 重新分发的trimAl使用了官方提供的预编译版本，其中包含的开源许可证是自带的（尽管并不包含源代码）。

4. 重新分发的IQ-TREE使用了官网提供的发行版，未包含源代码所以未附带其开源许可证（尽管该程序是开源的）。

5. 重新分发的FigTree使用了官方提供的发行版，未包含源代码，且官方未要求提供版权声明。

## 后续计划

1. 为本文档中的用户手册添加图片演示。

2. 撰写英文文档和英文注释。

3. 正式发布项目：英文主页-GitHub公开仓库；中文主页-Gitee公开仓库。
