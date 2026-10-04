#!/usr/bin/env node
/**
 * 初始化 mms-desktop 的 dist/index.html（占位页）。
 * 若已存在 dist/index.html 则跳过，避免覆盖 Vue 构建产物。
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const indexFile = path.join(distDir, "index.html");

if (fs.existsSync(indexFile)) {
  console.log("[mms-desktop] 已存在 dist/index.html，跳过初始化。");
  process.exit(0);
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MMS Desktop · 占位页</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; font-family: system-ui, sans-serif;
      background: #0f1419; color: #e6edf3;
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
    }
    .card {
      max-width: 36rem; padding: 1.75rem 2rem;
      background: #1a222d; border-radius: 12px;
      border: 1px solid #30363d;
      line-height: 1.6;
    }
    h1 { font-size: 1.25rem; margin: 0 0 0.75rem; font-weight: 600; }
    p { margin: 0.5rem 0; color: #8b949e; font-size: 0.95rem; }
    code {
      display: block; margin-top: 1rem; padding: 0.75rem 1rem;
      background: #0d1117; border-radius: 8px; font-size: 0.8rem;
      color: #79c0ff; overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>mms-desktop 已就绪</h1>
    <p>这是占位 <strong>dist/index.html</strong>。请将 Vue 项目构建产物整目录拷贝到本工程的 <code style="display:inline;padding:0.1em 0.35em;">dist/</code>（需包含构建后的 index.html 与 assets 等）。</p>
    <p>拷贝后可运行 <code style="display:inline;padding:0.1em 0.35em;">npm run dev</code> 打开 Tauri 预览窗口（需已安装 Rust 与 Tauri 前置依赖）。</p>
    <code>cp -R ../你的-vue项目/dist ./dist</code>
  </div>
</body>
</html>
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(indexFile, html, "utf8");
console.log("[mms-desktop] 已创建 dist/index.html（占位）。若要用真实页面，请用 Vue dist 覆盖。");
