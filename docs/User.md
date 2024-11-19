# Guidance

## Quick Start

***When you want to quickly get started with this product, please follow the operation processes below; The program will automatically load the default running configuration (when you has not customized) or the current configuration (when you has customized).***

### Operation Process

`Start`→`Customize a Workflow`→`Select Input Files`→`Specify an Output Path`→`Submit`

1. Start: Click the `Start` button.

2. Customize a Workflow

    ***You can customize a workflow through the button options in the table.***

    + *Step 1*: Select **Analysis Strategy**(`Concatenation`/`Coalescence`/`Separation`).
    + *Step 2*: Select **Sequence Alignment** method(`MAFFT`/`MACSE`/`Skip`).
    + *Step 3*: Select **Alignment Optimization** method(`trimAl`/`Skip`).
    + *Step 4*: Select **Tree Construction** method(`IQ-TREE`/`MrBayes`/`Skip`).
    + ***Attention***: When **Analysis Strategy** is `Coalescence`, `MrBayes` is not allowed; When **Analysis Strategy** is `Coalescence` and `Skip` **Tree Construction**, **Sequence Alignment** or **Alignment Optimization** is not allowed.

3. Select Input Files

    ***Depending on the first task of the workflow, there are different requirements for the format and content of the input files.***

    **Format Requirements**

    + `MAFFT`/`MACSE`

      >Input files should be sequence files in **FASTA** format.

    + `trimAl`/`IQ-TREE`/`MrBayes`

      >Input files should be sequence alignment files in **FASTA**/**ALN**/**MEGA**/**PHYLIP**/**NEXUS** format.

    + `Concatenation`

      >Input files should be a group of sequence alignment files in **FASTA**/**ALN**/**MEGA**/**PHYLIP**/**NEXUS** format, and the sequences will be concatenated together from different files must have the same name.

    + `wASTRAL`

      >Input files should be several evolution tree files in **NEWICK** format, and the branches will be merged together from different files must have the same name.

    **Operation Process**

    + ***Method 1***: Select files
      + *Step 1*: Click the `OPEN` button to open a popup window.
      + *Step 2*: Select input files (multiselect is allowed); The default matching is **FASTA** format sequence files. When you want to match other formats, please select the corresponding type in the dropdown list on the right side of the file name input box in the popup window; When your input files cannot be correctly matched and displayed, please check their suffixes and modify them to legal ones or select `All Files` for matching (not recommended).
      + *Step 3*: Click the `OK` button.
      + ***Attention***: This way will overwrite the existing **INPUT File(s)** configuration.

    + ***Method 2***: Keyboard entry
      + *Step 1*: Click the `MODIFY` button to active the textarea.
      + *Step 2*: Enter input file paths by keyboard (one input file path per line).
      + *Step 3*: Click the `OK` button to save the change.
      + ***Notice***: You can copy and paste or undo operations through system shortcuts.

4. Specify an Output Path

    ***The outputs of the workflow will be saved to the output path you specified.***

    + ***Method 1***: Select a path
      + *Step 1*: Click the `SAVE` button to open a popup window.
      + *Step 2*: Select a directory.
      + *Step 3*: Enter a custom directory name (It cannot have the same name as an existing file or directory).
      + *Step 4*: Click the `OK` button.
      + ***Attention***: This way will overwrite the existing **OUTPUT Path** configuration.

    + ***Method 2***: Keyboard entry
      + *Step 1*: Click the `MODIFY` button to active the textarea.
      + *Step 2*: Enter an output path by keyboard (You can only enter one path and line breaks are not allowed).
      + *Step 3*: Click the `OK` button to save the change.
      + ***Notice***: You can copy and paste or undo operations through system shortcuts.

5. Submit

    ***After completing the steps above, you need to submit your analysis tasks.***

    + Start
        + *Step 1*: Click the `RUN` button to submit the tasks, and a popup window will display the running parameters configuration of them.
        + *Step 2*: Click the `OK` button to confirm the submission, and the tasks will run in the background. The task progress will be displayed in the sub window of the program. You can click the title of the task progress item to open its output directory.
        + ***Parameter Check***: If **OUTPUT Path** or **INPUT File(s)** is illegal, the program will prevent the task submission and popup a window to report the error message.

    + Finish
      + When the tasks ends, the program will popup a window to inform you, and you can click the `Go to the directory` button to view the output directory.
      + When `IQ-TREE`/`MrBayes`/`wASTRAL` is in the workflow, you can click the `View in FigTree` button to visualize the output results through **FigTree**.
      + ***Exception***: When an error occurs during the task execution process, the program will directly abort the task and popup a window to inform you. You can click the `Show the logs` button to view the error log.

6. ToolKit

    ***The program provides the calling interfaces of 3 JAVA tools, which can be opened and used through the `FigTree`/`ALTER`/`MACSE` buttons.***

    + [FigTree](http://tree.bio.ed.ac.uk/software/figtree) is a tool commonly used for visulizing and viewing evolution trees, which can also be used to edit and beautify evolution trees and create publishing level images.
    + [ALTER](https://github.com/sing-group/ALTER) is an alignment sequence format conversion tool that can generate non-standard specific formats for different programs' input.
    + [MACSE](https://bioweb.supagro.inra.fr/macse/) is a multiple sequence alignment tool for aligning coding genes, which also provides some other functions.

## How to Customize

***When you need to customize the running configuration, please follow the operation steps below; Customize page always display the current configuration.***

1. Page Jump: Click the `Customize` button.

2. Modify Parameters

    ***You can customize the running parameters of the tools called during the tasks.***

    + ***Method 1***: Keyboard entry
      + *Step 1*: Click the `MODIFY` button to active the textarea.
      + *Step 2*: Enter parameters by keyboard (Line breaks are not allowed).
      + *Step 3*: Click the `OK` button to save the change.
      + ***Notice***: You can copy and paste or undo operations through system shortcuts.
    
    + ***Method 2***: Import a configuration
      + *Step 1*: Select a configuration in the dropdown list (A * prefix indicates a program built-in configuration).
      + *Step 2*: Click the `LOAD` button.
      + *Step 2.5*: When you select `...`, import configuration by selecting a **JSON** file through the popup window.
      + *Step 3*: Click the `OK` button after confirming the content displayed in the popup window.
      + ***Attention***: The imported running parameters will overwrite the current ones.

3. Start a task: Click the `NEXT` button to jump to Start Page, and then follow Step 2 in [Quick Start](#quick-start).

4. Export a configuration
    + *Step 1*: Click the `SAVE` button, a popup window will display the configuration to be exported.
    + *Step 2*: Click the `OK` button to open the SAVE window.
    + *Step 3*: Select an output directory.
    + *Step 4*: Enter a custom file name (It cannot have the same name as an existing file or directory).
    + *Step 5*: Click the `OK` button.
    + ***Notice***: If a configuration is saved in the default directory **config**, it will be loaded into the dropdown list for quick import.

## Notes

1. JAVA Running Environment (JRE) is necessary for running `FigTree`/`ALTER`/`MACSE`, you have to install it locally and configure the environment variables.

2. When the workflow includes `Concatenation`/`wASTRAL`, the sequence/tree branch naming in input files must follow their requirements.

3. Default settings are recommended unless you have specific requirements.
