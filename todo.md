# TODO

以下事项按数据丢失/功能阻断风险排序，只包含从当前代码、README、BUG 注释和 CI 配置中能确认的问题。

## P0：先修复下载和解析阻断

- [ ] 修复 `background.ts` 的文件名决定流程：`local:download-folder` 为 `false` 时也必须调用 `suggest()`，并确保成功、失败、取消三种结果都会推进和清理任务。
- [ ] 让下载任务与对应的 `onDeterminingFilename` 事件可靠关联；当前总取 `Set` 中第一个 task，并发或重复触发时会把文件名配到错误批次。
- [ ] 在 background 消息边界拒绝空 `fileList` 和无效 URL；popup 的按钮保护不能替代运行时输入校验。
- [ ] 对文章目录名和文件名统一做路径安全化。目前文章标题没有过滤双引号、尾随空格/句点、Windows 保留名，单个文件名也只处理部分非法情况。
- [ ] 修复 OUP 异步等待：`Promise.allSettled` 内部没有返回 `fetchOriginUrlParams` Promise，随后请求站点首页充当等待条件并不可靠。保留并覆盖 `Parsers/oup.ts` 中记录的 NAR 老文章样例。
- [ ] 修复 ScienceDirect 补充图片只有一个下载链接时访问 `figList[1]` 的分支。
- [ ] 为 Science 正文图解析补空值保护；缺少 caption/heading 时当前 `cloneNode`、`removeChild` 或字符串拆分可能直接中止整次解析。

## P1：建立最小回归保护

- [ ] 为八个出版社各保存至少一个最小 DOM fixture，测试 `FiguresData`/`FilesData` 的标题、编号、名称和 URL；优先覆盖已有 BUG 注释中的 OUP、PNAS 页面。
- [ ] 增加一个下载流程测试，覆盖文件夹开关、冲突策略、失败回调和连续两个任务。
- [ ] CI 在构建前运行 `pnpm compile`，并固定 Node、pnpm 版本；当前 workflow 使用 `latest`，`package.json` 也没有 `packageManager` 声明。
- [ ] 明确进度语义。当前数字表示浏览器接受下载请求的数量，不代表文件写入完成；若 UI 继续称为“下载进度”，应监听 downloads 状态变化和错误。
- [ ] popup 区分“不支持的网站”“content script 不可用”“页面尚未加载”“parser 返回空结果”，提供一次重试入口，避免长期显示加载文案。

## P2：整理已存在但未闭环的能力

- [ ] 决定 `hasSrc`、`srcFiles` 和 `FileCard` 的 `sources` 类型是否真的需要；当前没有 UI/解析流程使用，若近期无需求则删除。
- [ ] 仅在反复打开 popup 的解析开销可测量时增加按标签页缓存；需同时定义页面导航后的失效策略。
- [ ] 仅在准备收集诊断信息时扩展“问题反馈”链接，提交前让用户确认当前 URL 和将发送的数据。
- [ ] 修正文档中的构建产物路径：README 写的是 `output`，实际是 `.output`。
- [ ] 清理已确认无用的代码和导入，例如 `extractFigureInfo_old`、未使用的局部变量/类型，以及只打印调试信息的 `console.log`；不要与功能修复混在同一提交。

