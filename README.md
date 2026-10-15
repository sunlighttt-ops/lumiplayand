# Lumi Match · Android

奶油色与紫色的水果记忆翻牌小游戏。12 张卡片、6 组配对；记录步数，自动保存最佳步数，支持随时重新开始。完全离线。

## 运行

用 Android Studio 打开此文件夹，使用 JDK 17、Android SDK 35 和本地 Gradle 8.9，同步后选择 Android 6.0 或更新设备运行 app。本仓库未附带 Gradle Wrapper；安装 Gradle 8.9 后可执行 `gradle wrapper --gradle-version 8.9` 生成。命令行构建：`gradle :app:assembleDebug`。

## 文件

- `app/src/main/java/com/lumiplay/match/MainActivity.java`：原生入口与离线 WebView。
- `app/src/main/assets/index.html`：完整游戏界面、逻辑和样式。
- `app/src/main/assets/platform.png`：从 `images/googleplay.png` 复制，在游戏底部实际展示。原图保留。

两端采用相同 HTML/CSS/JavaScript 游戏实现，分别由原生容器加载。最佳成绩保存在本机 localStorage，无网络权限。当前对局不跨页面重建恢复。

## 验证

执行 `node tests/game.test.cjs` 可验证配对、误配锁定、重新开始取消计时、胜利和最佳成绩逻辑。此测试不替代真机测试。
