# Sci Fig Downloader

Chrome/Edge 拓展，用于从期刊网站上下载文章附图的原始版本以及文章的补充材料

<a href='https://microsoftedge.microsoft.com/addons/detail/sci-fig-downloader/eakkjiohlkpoimlgnljjceajjpgfjdop'><img src='https://get.microsoft.com/images/en-us%20light.svg' alt='Microsoft Store' style='width: 202.5px; height: 72px;'/></a>

## LICENSE

本拓展遵循GNU GPLv3.0协议

## 支持的期刊

- nature 系列
- acs 系列
- wiley 系列
- science 系列
- sciencedirect 系列

## 目标

- [x] 简单的下载管理界面
- [ ] 支持更多的期刊
- [ ] 可将图片分类下载到可自定义名称的文件夹
- [x] 支持下载 SI 文件以及视频等
- [ ] 优化插件界面
- [x] 更方便的 Parser 添加方式

## 版本计划

### 0.1.5

- 解析器支持：
  - [ ] 牛津出版社 主要是 NAR
  - [ ] Cell 出版社(Cell 出版社的文章也可以通过 ScienceDirect 网站查看)

### 0.1.4

- 界面优化
  - 设置界面
  - 文件类型

### 0.1.3

- 解析器支持：
  - [x] Science 网站
  - [x] ScienceDirect 网站
  - [x] nature 系列网站（文件）
  - [x] wiley 网站（文件）

## 已知 BUG

- 爬虫仅针对部分文章页面进行了测试，一些特殊的期刊排版可能会导致插件无法正常运行
- European Journal of Cell Biology 等部分 Elsevier 期刊图片序号可能会出错
- Elsevier 的期刊很杂，插件只针对部分期刊进行了测试
- Nature Methods无法正确解析

## 开发

克隆源码到本地

```bash
git clone https://github.com/yyngfive/sci-fig-downloader.git
```

安装依赖

```bash
pnpm install
```
调试

```bash
pnpm dev
```
构建

```bash
pnpm build
```

默认将构建 edge 版本，如果需要其他浏览器的版本，可以使用`-b`参数，例如：

```bash
pnpm build -b chrome
```

构建的浏览器拓展位于`output`文件夹中，可在 Chrome 或 Edge 浏览器中开启开发者模式，通过“加载解压缩的拓展”文件夹方式安装
