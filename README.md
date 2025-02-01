# Sci Fig Downloader (SFD)

Chrome/Edge 拓展，用于从期刊网站上下载文章附图的原始版本以及文章的补充材料

<a href='https://microsoftedge.microsoft.com/addons/detail/sci-fig-downloader/eakkjiohlkpoimlgnljjceajjpgfjdop'><img src='https://get.microsoft.com/images/en-us%20light.svg' alt='Microsoft Store' style='width: 202.5px; height: 72px;'/></a>

<a href='https://chromewebstore.google.com/detail/sci-fig-downloader/dooahdhpalnmkjkmdnhchoihgfmhfjkj'><img src='https://developer.chrome.com/static/docs/webstore/branding/image/206x58-chrome-web-bcb82d15b2486.png' alt='Chrome Web Store' style='height 72px;' /></a>


## LICENSE

本拓展程序遵循 GNU GPLv3.0 协议

## 支持的期刊网站

- [Nature](https://nature.com)
- [ACS](https://pubs.acs.org)
- [Wiley](https://onlinelibrary.wiley.com)
- [Science](https://science.org)
- [Elsevier](https://sciencedirect.com)
- [Oxford](https://academic.oup.com) 
- [RSC](https://pubs.rsc.org) 
- [PNAS](https://pnas.org) 

## 功能

- 在一个界面查看文章的所有图片
- 快速预览图片内容
- 同时下载原图与补充材料
- 自动整理下载的图片和文件（暂未完全实现）
- 支持多种期刊网站

## 已知 BUG

- Elsevier、Oxford等出版社的期刊很杂，插件只针对部分期刊进行了测试
- 下载功能可能会与其他插件冲突和浏览器设置冲突
  - 一些下载管理器插件可能会与本插件冲突
  - Edge浏览器的在浏览器中查看Office文件功能会导致插件界面关闭，影响下载到文件夹功能
  - 下载功能可能无法正确重命名并创建文件夹
  - 下载功能可能没有进度条显示
- Elsevier和Wiley系列期刊网站无法通过插件直接下载正文PDF
- 在RSC网站使用插件时，图片需要等网页图片加载完毕后才可预览

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
