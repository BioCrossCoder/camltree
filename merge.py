import os

root=os.path.abspath('.')
target=os.path.abspath('./source_code.txt')
count=0

def addFile(path:str):
    global count
    if os.path.isdir(path):
        for file in os.listdir(path):
            addFile(os.path.join(path,file))
    if os.path.splitext(path)[-1] in ('.ts','.tsx','.html'):
        f=iter(open(path,'r'))
        g=iter(open(target,'a'))
        name=os.path.relpath(path,root)
        g.write('// '+name+'\n')
        for line in f:
            text=line.strip()
            if len(text) == 0:
                continue
            if text.startswith('// '):
                continue
            if text.startswith('{/*') and text.endswith('*/}'):
                continue
            if text.startswith('/*') and text.endswith('*/'):
                continue
            annotation=line.find('//')
            if annotation > 0:
                line=line[:annotation]+'\n'
            g.write(line)
            count+=1
        f.close()
        g.write('\n')
        g.close()
        print(name)

addFile('./index.html')
addFile('./src')
addFile('./src-electron')
print(count)
