# CamlTree

## 简介

生物信息学工具，主要用于对线粒体/病毒来源的功能微基因做系统发育分析，也适用于任意核酸序列或氨基酸序列的系统发育分析。

## 安装

1. 关于 CamlTree 的所有安装文件可以从 https://github.com/BioCrossCoder/camltree/releases/ 下载。
2. 支持 Windows 10 和 11，有两种方式可以下载和安装 CamlTree，一种是快速安装方式，只需双击 CamlTree_setup.exe 文件，图标会出现在桌面上，点击图标即可运行 CamlTree；另一种方式是双击 CamlTree-win32-x64-2.2.0.zip 文件，然后解压，直接从该文件夹运行 CamlTree。

## 产品特色

+ 简单易用且功能强大。
+ 简洁美观的响应式图形界面。
+ 支持Windows桌面应用程序。

    ***我们曾经成功在`v1.x.x`版本支持MacOS，但这已不再被维护。事实上，MacOS的权限问题迫使我们放弃对它的支持，毕竟我们没有足够的时间浪费在解决这个问题上。***
+ 集成了几种业内流行的第三方工具且可定制运行参数。

## 竞品对比

### 与PhyloSuite的对比

1. PhyloSuite是一个分析平台，其界面随功能而变得复杂，增加了用户的心智负担；CamlTree是针对一套特定流程的分析工具，其界面和功能都精简专一，集中了用户的注意力而使其易于上手。
2. CamlTree具有响应式界面，字体可以随界面放大而放大，对有视力问题的用户（如老年用户或因患有眼科疾病而导致视力障碍的用户）十分友好。这是PhyloSuite所不具有的。
3. CamlTree的多序列对齐和对齐优化采用了多进程设计实现并行运算，因此性能优于PhyloSuite。
4. PhyloSuite通过插件引用工具，CamlTree采用内置电池赋能，简化了使用。
5. PhyloSuite的运行结果均保存在指定的工作空间目录中，而CamlTree可以为每个任务单独指定输出。
6. CamlTree的运行参数配置比PhyloSuite更灵活简便，且具有导入导出运行参数配置的功能。
7. CamlTree可以通过调用内置的FigTree可视化查看和编辑进化树文件。
8. CamlTree的用户指南内置于本地程序可在不联网状态下查看，而PhyloSuite的用户指南则为在线文档。
9. CamlTree支持了PhyloSuite所不包含的并联建树工作流。

### 与Concatenator的对比

1. Concatenator采用FastTree构建分子进化树，CamlTree则采用更受认可的IQ-TREE。
2. Concatenator目前仍处于极不稳定的测试版本，我们测试发现无法正常运行，而CamlTree已经足够稳定可用。

## 文档导航

### [用户手册](./docs/User.zh.md)

### [开发文档](./docs/Developer.md)

## 版权声明

1. 本程序是免费的，不允许商业使用；重新分发的第三方程序均不包含源代码。
2. MAFFT使用了官方提供的预编译版本，根据官方要求引用了BSD版权声明。
3. trimAl/IQ-TREE/MrBayes/wASTRAL使用了官方提供的预编译版本，未包含源代码所以没有引用开源许可证，且官方未要求提供版权声明。
4. FigTree/MACSE使用了官方提供的jar文件，未包含源代码，且官方未要求提供版权声明。
5. ALTER是采用Maven自行编译打包得到的jar文件，未包含源代码所以没有引用开源许可证，且官方未要求提供版权声明。
