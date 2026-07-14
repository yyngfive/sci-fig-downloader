# AGENTS.md

## 项目定位

Sci Fig Downloader 是一个基于 WXT、React 和 TypeScript 的 Manifest V3 浏览器扩展。它在论文页面中解析原图、正文 PDF 与补充材料，在 popup 中供用户预览和选择，并通过 background 的 downloads API 批量下载。

详细运行结构见 [`architecture.md`](architecture.md)，已确认的后续工作见 [`todo.md`](todo.md)。

## 工作边界

- 不编辑生成目录：`.wxt/`、`.output/`、`node_modules/`。
- 不把站点 DOM 结构想当然；解析器修改必须对应真实页面或保存的最小 DOM 样例。
- 保持解析器输出符合 `types/parser.d.ts`，不要把站点差异泄漏到 popup。
- 下载相关改动必须同时检查 `entrypoints/popup/App.tsx`、`entrypoints/background.ts` 和 `utils/downloads.ts` 的完整消息链路。
- 保留工作区已有改动。目前 `Parsers/oup.ts` 可能包含用户记录的 BUG 样例，不要顺手覆盖。
- 优先修复共享入口的根因，避免在每个调用方重复加补丁；不要为单个站点引入新依赖或无实际使用者的抽象。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm dev:firefox
pnpm compile
pnpm build
pnpm build:firefox
pnpm zip
pnpm add:publisher -- --help
```

若 `pnpm compile` 因本地 pnpm 想重建 `node_modules` 而在非交互环境失败，可在不安装依赖的前提下运行现有二进制：

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

## 修改入口

### 增加或修改出版社解析器

可先运行生成器登记代码键、函数名、识别域名和 WXT 匹配规则：

```bash
pnpm add:publisher -- --key cell --symbol Cell --host www.cell.com --match "https://www.cell.com/*"
```

用 `--host`、`--match` 重复传入多个值；先加 `--dry-run` 可只查看计划。生成器不会修改 README 或 changelog，必须在解析函数完成并通过真实文章页面验证后手动更新支持列表。

1. 在 `Parsers/<publisher>.ts` 实现图片和文件解析函数。
2. 在 `types/parser.d.ts` 的 `from` 联合类型中登记站点键。
3. 在 `Parsers/parsers.ts` 同时登记 URL 识别、图片解析器和文件解析器。
4. 在 `entrypoints/content.ts` 增加准确的页面匹配规则。
5. 用至少一个真实文章页面分别核对标题、正文图、图文摘要、补充图、正文 PDF 和补充文件；不存在的类别应返回空数组/默认值，而不是抛错。
6. 同步 `README.md` 与 changelog 中的支持列表。

### 修改下载流程

- popup 只负责把选中项转换为 `DownloadItem` 并发消息。
- background 是下载、重命名、冲突策略和进度消息的唯一执行层。
- 所有 `onDeterminingFilename` 分支都必须调用 `suggest`；任何失败都必须推进或结束任务，不能留下悬挂任务。
- 页面标题和文件名都属于不可信输入，必须在作为下载路径前完成跨平台安全化。

## 验证要求

- 最低要求：TypeScript 静态检查通过。
- 解析器改动：对受影响出版社做真实页面手测；DOM 解析存在分支或正则时，补一个最小可运行测试/样例。
- 下载改动：至少验证“不开启文件夹”“开启文件夹”“重名策略”“下载失败”“空列表”五条路径。
- 构建或配置改动：执行对应 Chromium/Firefox 构建；CI 目前只构建 Edge 和 Chrome。
- 提交前查看 `git diff`，确认没有包含 `.output/`、`.wxt/`、`node_modules/` 或无关的用户改动。

## 代码约定

- 使用现有 `@/` 路径别名和 WXT 提供的 `browser`、`storage`、`define*` API。
- 数据对象显式填写 `selected: false`；解析失败时返回结构完整的空结果。
- 站点选择器集中留在对应 parser；通用文件类型、URL、文件名逻辑放在 `utils/`。
- 只为实际行为写注释，BUG 注释应附可复现 URL；完成后删除过期注释。
