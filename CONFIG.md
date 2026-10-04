# mms-desktop 核心配置说明

本工程使用 **Tauri 2**：**Rust 侧**配置在 **`src-tauri/tauri.conf.json`**，**前端**仍为仓库根下的 **`dist/`**（Vue/Vite 构建产物）。

## 1. 前端产物 `dist/`

| 项 | 说明 |
|----|------|
| **目录** | 与 `package.json` 同级 **`dist/`**，至少含 **`index.html`**。 |
| **Vite** | 典型需 **`base: './'`**（或等价），以便资源相对路径正确。 |
| **初始化** | **`npm run init`** 仅写入占位 **`dist/index.html`**，不覆盖已有文件。 |

`tauri.conf.json` → **`build.frontendDist`** 当前为 **`../dist`**（相对 **`src-tauri/`**）。

## 2. `src-tauri/tauri.conf.json` 要点

| 字段 | 含义 |
|------|------|
| **`productName`** | 用户可见应用名（如 **MMS Desktop**）。 |
| **`identifier`** | 反向域名唯一 id（如 **`com.sxpcwlkj.mms-desktop`**），影响安装包标识。 |
| **`version`** | 应用版本；建议与根目录 **`package.json`** 的 **`version`** 保持一致。 |
| **`build.beforeDevCommand`** | 开发前命令：本仓库用 **`sirv`** 在 **`dist`** 上起 **`http://localhost:1420`**，支持 **`--single`**（SPA fallback）。 |
| **`build.devUrl`** | 开发时 WebView 加载的 URL，与 **beforeDevCommand** 端口一致。 |
| **`build.beforeBuildCommand`** | 发布构建前钩子；当前为空（**请自行先准备好 `dist/`**）。 |
| **`app.windows[]`** | 窗口 **`title`/`width`/`height`/`minWidth`/`minHeight`**、`center` 等。 |
| **`bundle.*`** | 安装包：`icon`、**`copyright`**、**`publisher`**、**`targets`** 等。 |

更全字段见 [Tauri 配置参考](https://v2.tauri.app/reference/config/)。

**可选关注点**：**`app.withGlobalTauri`**（当前 `false`：不在全局挂 `window.__TAURI__`，需时改为 `true` 并读文档）；**`app.security.csp`**（当前 `null`；上线若需收紧策略再配置）。

## 2.1 根目录 `package.json` 脚本（摘要）

| 脚本 | 作用 |
|------|------|
| **`npm run init`** | 若无 **`dist/index.html`** 则写占位页（不覆盖已有）。 |
| **`npm run dev`** | **`tauri dev`**（**`predev`** 会先 **`check-rust`** 再 **`init-dist`**）。 |
| **`npm run build`** | **`tauri build`**（**`prebuild`** 同上；请自备 **`dist/`**）。 |
| **`npm run icons:tauri`** | 用 **`icons/icon.png`**（须方形）刷新 **`src-tauri/icons/`**，见 **`icons/README.md`**。 |
| **`build:win` / `:mac` / `:linux`** | 当前均等同于 **`tauri build`**（在**当前宿主机**上编当前平台；交叉编译需另配）。 |

## 3. 能力与权限

**`src-tauri/capabilities/default.json`** 当前仅 **`core:default`**。若前端需调用 Rust 命令、打开外部链接、读写文件等，需在 **capabilities** 与 Rust 侧一并扩展（见 Tauri 文档）。

## 4. 路由（Vue Router）

| 模式 | 说明 |
|------|------|
| **hash** | 简单、与内嵌静态资源兼容性好。 |
| **history** | 开发态 **`sirv --single`** 通常可用；**生产包** deep link 若遇 **404**，优先改 **hash**，或在架构上引入本地 HTTP / custom protocol 策略。 |

## 5. 跨平台构建

- **一次 `npm run build` 只打「当前系统」的包**：在 **macOS** 上不会自动生成 **Windows `.msi`/`.exe`** 或 **Linux `.deb`/AppImage**；要到对应系统（或 CI 对应 runner）再构建。
- **产物根目录**：**`src-tauri/target/release/bundle/`**。常见子目录（随平台与 `bundle.targets` 变化）：
  - **macOS**：**`macos/`**（`.app`）、**`dmg/`**（`.dmg`）
  - **Windows**：**`msi/`**、**`nsis/`** 等
  - **Linux**：**`deb/`**、**`appimage/`** 等
- **交叉编译**（例如在 macOS 上直接产 `.exe`）需单独配置 Rust target 与依赖，见 [Tauri 分发文档](https://v2.tauri.app/distribute/)；本仓库脚本不假定交叉环境。细节见 **README「八、打包流程」**。

## 6. 参考链接

- **`README.md`**：**分操作系统**的安装依赖、操作步骤、配置与打包流程（正文以 README 为准）。
- **`icons/README.md`**：源图 **`icons/icon.png`** 与 **`npm run icons:tauri`**。
- **`.skills/mms-desktop/SKILL.md`**：协作助手与排障口径。

## 7. 常见问题

| 现象 / 需求 | 建议 |
|-------------|------|
| **`cargo metadata` … `No such file or directory (os error 2)`** | 未安装 Rust 或未进 **PATH**。按 **README「二～四」** 中你所在系统的步骤安装 **rustup**；完成后新开终端并运行 **`cargo --version`**。再按需补 [Tauri 系统依赖](https://v2.tauri.app/start/prerequisites/)。 |
| **`tauri` 命令找不到 / 其它 Rust 报错** | 同上；macOS 需 **Xcode Command Line Tools**，Windows 需 **WebView2** 等。 |
| **白屏 / 资源 404** | 检查 **`dist/index.html`**、Vite **`base`**、静态资源是否均在 **`dist/`** 内。 |
| **`beforeDevCommand` 端口占用** | 改 **`tauri.conf.json`** 中 **sirv 端口**与 **`devUrl`** 保持一致。 |
| **`npm run icons:tauri` 报错非方形图** | 源 **`icons/icon.png`** 需 **正方形**；可用设计稿导出 1024×1024 再执行。 |
| **只有 mac 的 `.dmg`，没有 Windows / Linux 包** | 属正常：需分别在 **Windows / Linux**（或 CI 对应 runner）执行 **`npm run build`**。见 **README「八、打包流程」**。 |