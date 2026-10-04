#!/usr/bin/env node
/**
 * Tauri 依赖本机已安装且在 PATH 中的 cargo。
 * 避免直接跑出较晦涩的 cargo metadata / os error 2。
 */
const { spawnSync } = require("child_process");

const r = spawnSync("cargo", ["--version"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (r.status === 0) {
  process.exit(0);
}

console.error("");
console.error("[mms-desktop] 未检测到 cargo（Rust 工具链）。请先安装 Rust（官方 rustup）：");
console.error("");
console.error("  curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh");
console.error("");
console.error("  安装后新开终端，或: source \"$HOME/.cargo/env\"");
console.error("  Tauri 系统依赖说明: https://v2.tauri.app/start/prerequisites/");
console.error("  验证: cargo --version   rustc --version");
console.error("");
process.exit(1);
