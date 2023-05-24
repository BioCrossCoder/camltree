# CamlTree

## 简介

生物信息学工具，主要用于对线粒体/病毒来源的功能微基因做系统发育分析；同时适用于任意核酸序列和氨基酸序列的系统发育分析。

## 产品特色

+ 简单易用且功能强大。
+ 简洁美观的响应式图形界面。
+ 同时支持Windows和MacOS的跨平台桌面应用程序。
+ 集成了几种业内流行的第三方工具且可定制运行参数。

## 竞品对比

### 与PhyloSuite的对比

1. PhyloSuite是一个分析平台，其界面随功能而变得复杂，增加了用户的心智负担；CamlTree是针对一套特定流程的分析工具，其界面和功能都精简专一，集中了用户的注意力而使其易于上手。
2. CamlTree具有响应式界面，字体可以随界面放大而放大，对有视力问题的用户（如老年用户或因患有眼科疾病而导致视力障碍的用户）十分友好。
3. CamlTree的多序列对齐和对齐优化采用了多进程设计实现并行运算，因此性能优于PhyloSuite。
4. PhyloSuite通过插件引用工具，CamlTree采用内置电池赋能，简化了用户的使用。
5. PhyloSuite的运行结果均保存在指定的工作空间目录下的子目录中，而CamlTree可以为每个任务单独指定输出。
6. CamlTree的运行参数配置比PhyloSuite更灵活简便，且具有一键导入导出运行参数配置的功能。
7. CamlTree可以通过调用内置的FigTree可视化查看和编辑进化树文件。
8. CamlTree的用户指南内置于本地程序可在不联网状态下查看，而PhyloSuite的用户指南则为在线文档。
9. CamlTree支持了PhyloSuite所不包含的并联建树工作流。

### 与Concatenator的对比

1. Concatenator采用FastTree构建分子进化树，CamlTree则采用更受认可的IQ-TREE。
2. Concatenator基于PySide6构建，放弃了对Windows7等较旧版本系统的支持，而CamlTree通过限制使用22版本的Electron框架兼容了Windows7支持。
3. Concatenator目前仍处于极不稳定的测试版本，我们测试发现无法正常运行，而CamlTree已经足够稳定可用。

## 文档导航

### [用户手册](./docs/User.md)

### [开发文档](./docs/Developer.md)

## 版权声明

1. 本程序是开源免费的，遵循开源协议GPLv3，不允许商业使用；重新分发的第三方程序均不包含源代码。
2. 重新分发的MAFFT使用了官方提供的预编译版本，根据官方要求在mac版本中添加了官方提供的BSD版权声明。
3. 重新分发的trimAl、IQ-TREE、MrBayes、wASTRAL使用了官方提供的预编译版本，未包含源代码所以没有引用开源许可证。
4. 重新分发的FigTree、MACSE使用了官方提供的jar文件，未包含源代码，且官方未要求提供版权声明。
5. 重新分发的ALTER是采用Maven自行编译打包得到的jar文件，未包含源代码所以没有引用开源许可证。
