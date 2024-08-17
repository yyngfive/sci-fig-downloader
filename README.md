# Sci Fig Downloader

Chrome/Edge拓展，用于从期刊网站上下载文章附图的原始版本以及文章的补充材料

## 支持的期刊

- nature系列：图片+补充材料
- acs系列：图片+补充材料
- wiley系列：图片
- science系列：图片+补充材料

## 下一版本 0.1.3

- 解析器支持：
  - [x] Science网站 
  - [ ] ScienceDirect网站
  - [x] nature系列网站（文件）
  - [x] wiley网站（文件）

## 目标

- [x] 简单的下载管理界面
- [ ] 支持更多的期刊
- [ ] 可将图片分类下载到可自定义名称的文件夹
- [x] 支持下载SI文件以及视频等
- [ ] 优化插件界面
- [x] 更方便的Parser添加方式

## 已知BUG

- 爬虫仅针对部分文章页面进行了测试，一些特殊的文章排版可能会导致插件无法运行

## 使用

### 通过Release

可直接从[Release](https://github.com/yyngfive/sci-fig-downloader/releases)页面下载构建好的拓展

### 通过源码
克隆源码到本地
```bash
git clone https://github.com/yyngfive/sci-fig-downloader.git
```
在项目目录中执行
```bash
pnpm install
```
安装依赖后执行
```bash
pnpm build
```
默认将构建edge版本，如果需要其他浏览器的版本，可以使用`-b`参数，例如：
```bash
pnpm build -b chrome
```
构建的浏览器拓展位于`output`文件夹中，可在Chrome或Edge浏览器中开启开发者模式，通过“加载解压缩的拓展”文件夹方式安装