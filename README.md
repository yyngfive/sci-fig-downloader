# Sci Fig Downloader

Chrome/Edge拓展，用于从期刊网站上下载文章附图的原始版本

## 支持的期刊

- nature系列
- acs系列
- wiley系列

## 计划

- [x] 简单的下载管理界面
- [ ] 支持更多的期刊
- [ ] 可将图片分类下载到可自定义名称的文件夹
- [ ] 支持下载SI文件以及视频等
- [ ] 优化插件界面
- [ ] 更方便的Parser添加方式

## 已知BUG
- 某些情况下无法成功爬取网站内容导致插件界面空白

## 使用

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
构建的浏览器拓展位于`dist`文件夹中，可在Chrome或Edge浏览器中开启开发者模式，通过“加载解压缩的拓展”文件夹方式安装