<div align="center">
   <br/>
   <a href="https://mmsadmin.cn">
     <img width="150" src="https://mmsadmin.cn/logo.png" alt="MMS logo">
   </a>
   <h1>模块化管理系统</h1>
   <p>MMS · Modular Management System</p>
   <p><strong>mms-desktop · 桌面端开发基座（Tauri 2）</strong></p>
   <p><a href="https://mmsadmin.cn/">📘 在线文档 · mmsadmin.cn</a> · <a href="https://gitee.com/LumeCode/mms-desktop">Gitee</a> · <a href="https://github.com/MrShanDev/mms-desktop">GitHub</a></p>
   <br/>
</div>

将 **任意 Vue 项目**（Vite、`vue-cli-service` 等）产出的 **`dist/`** 封装为 **Windows / macOS / Linux** 桌面应用（[Tauri 2](https://v2.tauri.app/)）。

**重要**：**一次在某台系统上执行 `npm run build`，只会生成该系统的安装包**（例如在 Mac 上不会出现 Windows `.msi`）。全平台需要 **三系统分别构建** 或使用 **CI 多 Runner**，见下文「打包流程」。

---

## 官方必读

- [Tauri 2 · Prerequisites（按系统勾选依赖）](https://v2.tauri.app/start/prerequisites/)
- [Tauri 2 · 配置参考](https://v2.tauri.app/reference/config/)
- [Rust · rustup 安装](https://rustup.rs/)

---

## 一、三系统依赖速览

| 依赖 | macOS | Windows | Linux |
|------|--------|---------|--------|
| **Node.js** | 18+（[nodejs.org](https://nodejs.org/) 或 nvm） | 同左 | 同左 |
| **Rust（cargo）** | [rustup](https://rustup.rs/) | 同左（官网下载 `rustup-init.exe`） | 通常同左（或发行版包管理器安装后仍建议 `rustup`） |
| **C 编译与链接** | Xcode **Command Line Tools** | **Visual Studio 2022** 的 **使用 C++ 的桌面开发** 或 **Build Tools**（含 MSVC、Windows SDK） | **build-essential**、**clang** 等（随发行版） |
| **WebView** | 系统自带 **WebKit** | **WebView2**（运行时；新机多数已带，见 Prerequisites） | **webkit2gtk** 等（Debian/Ubuntu 见官方列表） |
| **其它** | — | 打包 NSIS/MSI 时由 Tauri 拉取/依赖本机工具链 | **libayatana-appindicator**、**librsvg2** 等（见官方） |

**验证（三系统通用）**：

```bash
node -v
npm -v
cargo --version
rustc --version
```

若 `cargo` 找不到，先完成 rustup 安装并**新开终端**，或执行 `source "$HOME/.cargo/env"`（Windows 用户安装 rustup 时会提示把 `%USERPROFILE%\.cargo\bin` 加入 PATH）。

---

## 二、macOS：安装步骤

### 1. 安装 Xcode Command Line Tools

```bash
xcode-select --install
```

已装可跳过。用于 Clang、`lipo` 等与原生编译相关能力。

### 2. 安装 Node.js

任选：官网安装包、[Homebrew](https://brew.sh/) `brew install node`、nvm 等。**版本 ≥ 18**。

### 3. 安装 Rust（rustup）

终端执行（交互安装；**Modify PATH：yes**；选项 **1** 默认工具链即可）：

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

装完后 **新开终端**，或：

```bash
source "$HOME/.cargo/env"
```

**zsh 建议**（任选，避免每次手动 `source`）：在 `~/.zshrc` 末尾追加：

```bash
[[ -f "$HOME/.cargo/env" ]] && . "$HOME/.cargo/env"
```

### 4. 核对 Tauri 前置

打开 [Tauri Prerequisites · macOS](https://v2.tauri.app/start/prerequisites/)，按当前文档逐项确认。

### 5. 进入工程并装 npm 依赖

```bash
cd /path/to/mms-desktop
npm install
```

---

## 三、Windows：安装步骤

### 1. 安装 Node.js

从 [Node.js 官网](https://nodejs.org/) 下载 **LTS** 安装包（**≥ 18**），安装时勾选 **Add to PATH**。

PowerShell 验证：

```powershell
node -v
npm -v
```

### 2. 安装 Visual Studio 构建环境

需 **MSVC** + **Windows SDK**（Tauri 2 官方要求），任选其一：

- 安装 **Visual Studio 2022 Community**，工作负载勾选 **「使用 C++ 的桌面开发」**，或  
- 仅安装 **Build Tools for Visual Studio 2022**，勾选相同 **C++ 桌面开发** 组件。

详见 [Tauri Prerequisites · Windows](https://v2.tauri.app/start/prerequisites/)。

### 3. WebView2

开发与最终用户运行均需 **WebView2**；多数 Win10/11 已带。若缺失，按 [Prerequisites](https://v2.tauri.app/start/prerequisites/) 安装 **Evergreen Bootstrapper**。

### 4. 安装 Rust（rustup）

1. 打开 [https://rustup.rs/](https://rustup.rs/)，下载 **RUSTUP-INIT.EXE（64-bit）**。  
2. 运行安装程序，按提示选择 **default toolchain**；确保将 **`%USERPROFILE%\.cargo\bin`** 加入 **PATH**（安装程序可勾选）。  
3. **关闭并重新打开** PowerShell / CMD / 终端，执行：

```powershell
cargo --version
rustc --version
```

### 5. 进入工程并装 npm 依赖

```powershell
cd C:\path\to\mms-desktop
npm install
```

路径请按你本机仓库位置修改。

---

## 四、Linux：安装步骤

> 不同发行版包名略有差异，**以 [Tauri Prerequisites · Linux](https://v2.tauri.app/start/prerequisites/) 当前页面为准**。下面以 **Debian / Ubuntu** 家族为例。

### 1. 系统包（示例）

```bash
sudo apt update
sudo apt install \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

若仓库里仍是 `webkit2gtk-4.0-dev`，请按官方文档选择 **4.0 / 4.1** 与发行版匹配的那一组。

### 2. 安装 Node.js

建议用 [NodeSource](https://github.com/nodesource/distributions)、**nvm** 或发行版仓库，保证 **Node ≥ 18**。

### 3. 安装 Rust（rustup）

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
cargo --version
```

### 4. 进入工程并装 npm 依赖

```bash
cd /path/to/mms-desktop
npm install
```

### 5. 图形界面与调试

打包出的 **`.deb` / AppImage** 通常在 **带桌面环境的 Linux** 上验证；纯 SSH 无显示器时 `tauri dev` 可能受显示/WebView 限制，以本机实测为准。

---

## 五、工程目录与前端 `dist`（三系统相同）

在 **`mms-desktop`** 根目录：

| 步骤 | 命令 |
|------|------|
| 安装 npm 依赖 | `npm install` |
| 无 Vue 产物时生成占位页 | `npm run init`（不覆盖已有 **`dist/index.html`**） |
| 用真实 Vue 构建结果 | 将 **`mms-ui/dist`**（或你的项目 `dist`）**整目录**拷入本目录 **`dist/`** |

示例（路径按你本机修改）：

```bash
rm -rf dist && cp -R ../mms-ui/dist ./dist
```

前端 **`vite.config`** 建议 **`base: './'`**（或等价相对资源路径），否则桌面内嵌时易 404。

---

## 六、配置参数说明

### 1. `src-tauri/tauri.conf.json`（当前仓库要点）

| 配置项 | 当前值 / 含义 |
|--------|----------------|
| **`productName`** | 安装包与窗口展示名，如 **`MMS Desktop`**。 |
| **`version`** | 与安装包版本一致；建议与根目录 **`package.json` → `version`** 同步修改。 |
| **`identifier`** | 应用唯一 id，如 **`com.sxpcwlkj.mms-desktop`**（反向域名），影响 macOS / Windows 标识。 |
| **`build.beforeDevCommand`** | 开发前执行：用 **`sirv`** 在 **`dist`** 上起静态站（**`--port 1420`**，`--single` 便于 Vue history）。 |
| **`build.devUrl`** | 开发时 WebView 打开的地址，须与 **sirv 端口**一致（现为 **`http://localhost:1420`**）。 |
| **`build.beforeBuildCommand`** | 发布前钩子；现为 **空**，**打正式包前请自行保证 `dist/` 已是最终 Vue 产物**。 |
| **`build.frontendDist`** | **`../dist`**（相对 **`src-tauri/`**）：开发与打包时使用的前端静态资源根目录。 |
| **`app.withGlobalTauri`** | **`false`**：默认不把 API 挂到 `window.__TAURI__`，需时改 **`true`** 并查文档。 |
| **`app.windows[]`** | 主窗口：**`label`**、**`title`**、宽高、**`minWidth`/`minHeight`**、**`center`** 等。 |
| **`app.security.csp`** | **`null`**；若上线要收紧 CSP 在此配置。 |
| **`bundle.active`** | **`true`**：生成安装包。 |
| **`bundle.targets`** | **`all`**：在**当前构建机**上启用**该平台支持**的全部打包格式（不是「一次打出 Win+Mac+Linux」）。 |
| **`bundle.publisher` / `copyright`** | 发行者、版权信息，显示在安装信息里。 |
| **`bundle.icon`** | 相对 **`src-tauri/`** 的图标路径列表；勿随便删改，需整套用 **`npm run icons:tauri`** 从 **`icons/icon.png`** 生成。 |

完整键说明见 [Tauri 配置参考](https://v2.tauri.app/reference/config/)。

### 2. 根目录 `package.json` → `scripts`

| 脚本 | 行为 |
|------|------|
| **`npm run init`** | 仅 **`init-dist`**：没有 **`dist/index.html`** 时写占位。 |
| **`npm run dev`** | **`predev`**：`check-rust` → **`init-dist`** → **`tauri dev`**。 |
| **`npm run build`** | **`prebuild`**：同上 → **`tauri build`**。 |
| **`npm run icons:tauri`** | 用 **`icons/icon.png`**（须**正方形**）刷新 **`src-tauri/icons/`**。 |
| **`npm run build:win` / `:mac` / `:linux`** | 目前均等同于 **`tauri build`**（只在**当前系统**上编当前平台）。 |

---

## 七、启动调试（三系统相同）

```bash
npm run dev
```

1. 检查 **`cargo`** 是否在 PATH。  
2. 必要时补 **`dist/index.html`**。  
3. 启动 **`sirv`**（默认 **1420**）并打开桌面窗口加载 **`http://localhost:1420`**。

**端口被占用**：改 **`tauri.conf.json`** 里 **`beforeDevCommand`** 的 **`--port`** 与 **`devUrl`** 保持一致。

首次拉起的 **Rust 依赖编译** 较慢，属正常。

---

## 八、打包流程（按系统）

**原则**：在 **macOS / Windows / Linux 各自环境** 各执行一次完整流程，才会得到对应安装包。

### 通用步骤（每台机器都做一遍）

1. 安装本节「一～四」中 **对应系统** 的全部依赖。  
2. `cd mms-desktop` → `npm install`。  
3. 准备好最终 **`dist/`**（`npm run init` 占位 **或** 拷贝 Vue **`dist`**）。  
4. 执行：

```bash
npm run build
```

5. 在终端输出中确认 **Finished** 与 **bundle** 路径；在资源管理器 / Finder 中打开：

**`mms-desktop/src-tauri/target/release/bundle/`**

### 各系统典型产物（名称随版本、架构略有不同）

| 构建所用系统 | 常见目录 / 文件 |
|----------------|------------------|
| **macOS** | **`bundle/macos/`** 下 **`.app`**；**`bundle/dmg/`** 下 **`.dmg`** |
| **Windows** | **`bundle/msi/`** 下 **`.msi`**；**`bundle/nsis/`** 下安装器 **`.exe`**（视 Tauri/目标配置） |
| **Linux** | **`bundle/deb/`** 下 **`.deb`**；**`bundle/appimage/`** 下 **`.AppImage`** 等 |

**若要全平台安装包**：在 **三台物理机/虚拟机** 分别构建，或使用 **CI**（Windows / ubuntu / macOS 各一个 job）各执行上述步骤，收集各 job 的 **`bundle/`** 产物。

**交叉编译**（单台机器编多平台）：需额外配置，见 [Tauri Distribute](https://v2.tauri.app/distribute/)，本仓库**未内置**脚本。

---

## 九、图标

- 安装包图标源：**`icons/icon.png`**（**须正方形**，否则 `icons:tauri` 报错）。  
- 生成到 **`src-tauri/icons/`**：

```bash
npm run icons:tauri
```

详见 **`icons/README.md`**。

---

## 十、路由与前端

- 窗口与加载内容：由 **`tauri.conf.json`** + **`dist/`** 决定。  
- **Vue Router**：**`hash`** 与内嵌资源最省心；**`history`** 在 **`sirv --single`** 开发态通常可用，**生产包** deep link 若 **404** 可改 **hash** 或查 **`CONFIG.md`**。

---

## 十一、更多文档

- **`CONFIG.md`**：字段速查、能力 **`capabilities`**、常见问题表。  
- **`.skills/mms-desktop/SKILL.md`**：协作与排障口径。
