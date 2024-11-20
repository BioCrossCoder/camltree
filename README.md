# CamlTree

## Introduction

A bioinformatics tool, mainly used for phylogeny analysis for viral and mitochondrial genomes, and it is also suitable for smaller-scale projects (containing dozens or fewer genes) concerning eukaryotic genomes (such as the nuclear genome). Both nucleic acid sequences and amino acid sequences can be used for input sequences.

## Platform and environment requirement

1. The operating environment should be Windows 10 or Windows 11.
2. The MacOS version is under testing.
3. JAVA Running Environment (JRE) is necessary for running embedded FigTree/ALTER/MACSE, so it is recommended to install JAVA before running CamlTree.
   
## Installation

1. Installers for all files about CamlTree can be downloaded from https://github.com/BioCrossCoder/camltree/releases/.
2. There are two ways to download and install CamlTree. One is to click the CamlTree_setup.exe for a quick start, the other way is to click the CamlTree-win32-x64-2.2.0.zip, then unzip it, and run CamlTree directly from the folder.

## Quick start

Please click [user.md](./docs/User.md) or click the “Guidance” button on the main interface of the software.

## Features

+ Easy to use with powerful functions.
+ A brief and beautiful responsive graphical user interface.
+ A desktop application supports Windows.
+ Integrated several popular third-party tools in the field and users can customize their operating parameters.

## Comparison

### Comparison with PhyloSuite

1. PhyloSuite is an analysis platform whose interface becomes complex with its large number of functions, which increases users' mental burden; CamlTree is an analysis tool for a specific set of processes, so its interface and functions are brief and concentrated, which focuses users' attention in order to make it easy to get started with.
2. CamlTree has a responsive interface, and the fonts can be enlarged with the interface, which is very friendly to users with vision problems (such as elderly users or users with visual impairment due to ophthalmic diseases). This is what PhyloSuite does not have.
3. In CamlTree, Sequence Alignment and Alignment Optimization adopt multi-process design to realize parallel operations, so they are faster than those in PhyloSuite.
4. PhyloSuite calls tools as plugins, while CamlTree is powered by built-in batteries which simplifies the usage.
5. The running results of PhyloSuite are saved in the specified workspace directory, while CamlTree can specify a separate output path for each task.
6. Users can configure operation parameters more easily and flexibly in CamlTree than in PhyloSuite, and users can import or export running parameter configurations in CamlTree.
7. CamlTree can call built-in FigTree to visualize and edit evolution tree files.
8. The guidance of CamlTree is built-in to the local program so it can be viewed offline, while that of PhyloSuite is an online document.
9. CamlTree supports not only Concatenation but also Coalescence that PhyloSuite does not includes.

### Comparison with Concatenator

1. Concatenator adopts FastTree for Tree Construction, while CamlTree adopts IQ-TREE that is recognized as better.
2. Concatenator is still in an extremely unstable testing version currently and we found that it cannot run properly, while CamlTree is already stable enough to keep it available.

## Document navigation

### [Guidence](./docs/User.zh.md)

### [Development](./docs/Developer.md)

### Copyright

1. This program is free and commercial use is not allowed; The third-party programs redistributed do not contain source codes.
2. MAFFT uses the pre-compiled version provided by the author, and cites the BSD copyright statement according to the official requirement.
3. trimAl/IQ-TREE/MrBayes/wASTRAL uses the pre-compiled version provided by the author, which does not contain the source codes so their open source licenses are not cited, and the copyright statements are not required.
4. FigTree/MACSE uses the jar file provided by the author, which does not contain the source codes, and the copyright statements are not required.
5. ALTER is a jar file compiled and packaged through Maven by us, which does not contain the source codes so their open source licenses are not cited, and the copyright statements are not required.
