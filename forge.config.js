module.exports = {
  packagerConfig:{
		name:'CamlTree',// 应用名称配置
		icon:'icons/icon',// 应用图标配置
		overwrite:true,
		asar:true,// 归档打包源代码
		ignore:['tools','config','LICENSE'],// 忽略文件和目录
		extraResource:['tools','config','LICENSE']// 复制文件和目录
	},
  makers: [
    { 
      name: '@electron-forge/maker-zip',// 配置zip压缩包打包器
      platforms: ['darwin','win32'],// 配置打包平台
    }
  ],
};
