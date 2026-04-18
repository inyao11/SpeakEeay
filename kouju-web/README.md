# SpeakEasy English 🎯

> 轻量、现代、无广告的日常英文口语练习工具

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://yourusername.github.io/speakeasy-english)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pure Frontend](https://img.shields.io/badge/Pure%20Frontend-No%20Server-orange)]()

## ✨ 核心亮点

- ✅ **每日自动更新** - 每天提供新的口语句子
- ✅ **30分钟专注学习** - 打卡模式培养学习习惯
- ✅ **多场景口语** - 8大高频场景覆盖日常生活
- ✅ **即时发音** - 点击即可听到标准发音
- ✅ **跟读录音** - 支持语音识别跟读练习
- ✅ **AI 智能评分** - 发音/流利度/重音三维度评分
- ✅ **本地存储** - 学习记录、打卡、收藏永久保存
- ✅ **显示控制** - 原文/注释/隐藏三种学习模式
- ✅ **深色模式** - 支持浅色/深色主题切换
- ✅ **100% 免费** - 无登录、无广告、无服务器

## 🚀 在线体验

直接访问 GitHub Pages 部署地址即可使用：

```
https://yourusername.github.io/speakeasy-english
```

## 📱 功能截图

（截图占位符）

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 语义化结构 |
| CSS3 + Tailwind CSS | 现代响应式样式 |
| JavaScript (ES6+) | 核心逻辑 |
| Web Speech API | 语音合成与识别 |
| localStorage | 本地数据持久化 |
| Font Awesome | 图标库 |

## 📁 项目结构

```
speakeasy-english/
├── index.html          # 主页面
├── assets/
│   ├── css/
│   │   └── style.css   # 自定义样式
│   ├── js/
│   │   ├── app.js      # 主应用逻辑
│   │   ├── storage.js  # 本地存储管理
│   │   ├── speech.js   # 语音功能
│   │   ├── ai-score.js # AI评分算法
│   │   ├── data.js     # 口语数据
│   │   └── display.js  # 显示控制
│   └── icons/          # 图标资源
├── data/
│   └── scenes.json     # 情景数据（可选）
├── LICENSE             # MIT 开源协议
└── README.md           # 项目说明
```

## 🎯 功能模块

### 1. 每日打卡 + 30分钟学习模式
- 30分钟倒计时学习
- 完成自动打卡
- 连续打卡天数统计
- 进度条可视化

### 2. 情景口语库
8大高频场景，每场景8句实用口语：
- 🙋 日常问候
- ✈️ 机场出行
- 🍽️ 餐厅点餐
- 🛍️ 购物砍价
- 💼 职场沟通
- 🎓 校园交流
- 🎨 兴趣爱好
- 🏥 健康医疗

### 3. 句子核心操作
- ▶️ 点击播放标准发音（美式/英式可切换）
- 🎤 点击跟读录音
- 🤖 AI 自动评分（0-100分）
- ⭐ 收藏句子
- 📝 显示模式切换

### 4. 显示控制（特色功能）
三种显示模式自由切换：
- **显示原文** - 仅展示英文句子（进阶自测）
- **显示注释** - 英文+翻译+音标+注释（完整学习）
- **不显示** - 纯听力磨耳朵模式

### 5. 学习数据
- 学习历史记录
- 每日打卡日历
- 收藏夹管理
- 学习统计面板

## 🚀 本地运行

1. 克隆仓库
```bash
git clone https://github.com/yourusername/speakeasy-english.git
```

2. 进入目录
```bash
cd speakeasy-english
```

3. 直接用浏览器打开 `index.html` 即可

或者使用本地服务器：
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

## 📦 部署到 GitHub Pages

1. Fork 本仓库

2. 进入仓库 Settings → Pages

3. Source 选择 "Deploy from a branch"

4. Branch 选择 "main" 和 "/ (root)"

5. 点击 Save，等待几分钟即可访问

## 🌐 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome | ✅ 完全支持 |
| Edge | ✅ 完全支持 |
| Safari | ✅ 完全支持 |
| Firefox | ✅ 完全支持 |
| 微信内置 | ⚠️ 语音功能受限 |

## 📝 更新日志

### v1.0.0 (2026-04-18)
- 🎉 项目正式发布
- ✨ 8大场景口语数据
- ✨ 30分钟学习计时器
- ✨ AI 智能评分系统
- ✨ 显示控制功能
- ✨ 深色模式支持
- ✨ 本地数据存储

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Font Awesome](https://fontawesome.com/) - 精美的图标库
- Web Speech API - 浏览器原生语音能力

---

Made with ❤️ for English learners
