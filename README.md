# Sci Fig Downloader

Chrome/Edge 拓展，用于从期刊网站上下载文章附图的原始版本以及文章的补充材料

<a href='https://microsoftedge.microsoft.com/addons/detail/sci-fig-downloader/eakkjiohlkpoimlgnljjceajjpgfjdop'><img src='https://get.microsoft.com/images/en-us%20light.svg' alt='Microsoft Store' style='width: 202.5px; height: 72px;'/></a>

<a href='https://chromewebstore.google.com/detail/sci-fig-downloader/dooahdhpalnmkjkmdnhchoihgfmhfjkj'><img src='https://developer.chrome.com/static/docs/webstore/branding/image/206x58-chrome-web-bcb82d15b2486.png' alt='Chrome Web Store' style='height 72px;' /></a>


## LICENSE

本拓展程序遵循 GNU GPLv3.0 协议

## 支持的期刊网站

- nature.com (Nature)
- pubs.acs.org (ACS)
- onlinelibrary.wiley.com (Wiley)
- science.org (Science)
- sciencedirect.com (Elsevier)
- academic.oup.com (Oxford)
- pubs.rsc.org (RSC)

## 目标

- [x] 简单的图片浏览界面
- [ ] 支持多种期刊网站
- [x] 可将图片分类下载到文件夹
- [x] 支持下载补充材料文件
- [x] 支持预览图片
- [x] 较方便的 Parser 添加方式
- [ ] 显示下载进度

## 版本更迭

### 0.2.1

- 修复了已知的 BUG，详见Release页面

### 0.2.0

- 界面优化
  - [x] 设置界面
  - [x] 文件类型
- 修复了已知的 BUG

### 0.1.3

- 解析器支持：
  - [x] Science 网站
  - [x] ScienceDirect 网站
  - [x] nature 系列网站（文件）
  - [x] wiley 网站（文件）

## 已知 BUG

- Elsevier 的期刊很杂，插件只针对部分期刊进行了测试
- 下载功能可能会与其他插件冲突和浏览器设置冲突
  - 一些下载管理器插件可能会与本插件冲突
  - Edge浏览器的在浏览器中查看Office文件功能会导致插件界面关闭，影响下载到文件夹功能

## 开发

克隆源码到本地

```bash
git clone https://github.com/yyngfive/sci-fig-downloader.git
```

安装依赖(推荐使用 pnpm)

```bash
npm install -g pnpm
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
