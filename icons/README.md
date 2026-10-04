# 图标说明

## 根目录 `icons/`（给设计 / 品牌用）

| 文件 | 用途 |
|------|------|
| **`icon.png`** | 建议 **正方形**（如 1024×1024）；用于 **`npm run icons:tauri`** 生成 **`src-tauri/icons/`** 下全平台安装图标。 |

Windows / macOS 安装包实际使用的 **`.ico` / `.icns`** 以 **`src-tauri/icons/`** 为准，勿在根目录再维护一份，避免与 CLI 生成结果不一致。
## Tauri 生成图标

在 **`mms-desktop`** 根目录执行（需已 **`npm install`**）：

```bash
npm run icons:tauri
```

要求 **`icons/icon.png` 为方形**；否则会报错 `Source image must be square`。

生成结果写入 **`src-tauri/icons/`**（**请勿**手改 `tauri.conf.json` 里 `bundle.icon` 列表，除非你知道在做什么）。
