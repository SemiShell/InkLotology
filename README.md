# 新中式水墨风随机点名系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一款基于Web技术开发的随机点名工具，采用新中式水墨风设计，专为课堂互动与教学场景优化。无需安装，即开即用。

## ✨ 主要特性

- **极简操作**：单按钮设计，一键启动随机选择
- **水墨风格**：动态墨迹背景、印章式按钮，营造中国传统文化氛围
- **防连抽机制**：智能排除已选中人员，确保公平性
- **触控友好**：为触屏设备优化，支持手势操作
- **沉浸体验**：全屏模式、流畅动画与音效反馈

## 🚀 快速开始

### 在线体验
访问 [Demo页面](#) 立即体验（待部署）

### 本地使用
1. 克隆或下载此仓库
2. 双击 `index.html` 文件在浏览器中打开
3. 点击"點"按钮开始随机选择
4. 点击右下角设置图标调整配置

## 💻 技术实现

- 纯原生JavaScript实现，无依赖
- HTML5 Canvas绘制动态水墨效果
- CSS3动画实现流畅过渡效果
- 本地存储记录已选状态

## ⚙️ 自定义配置

### 修改名单
编辑 `js/nameData.js` 文件中的 `names` 数组：

```javascript
this.names = [
    '姓名1', '姓名2', '姓名3',
    // 添加更多名字...
];
```

### 高级设置
通过界面右下角的设置按钮，可以配置：
- 是否排除已选人员
- 更多设置可通过修改源码实现

## 📱 兼容性

- 现代浏览器：Chrome、Edge、Firefox、Safari最新版
- 移动设备：iOS Safari、Android Chrome
- 推荐：Windows触屏设备（Surface等）

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议。

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 📞 联系方式

项目作者 - [@SemiShell](https://github.com/SemiShell)

项目链接: [https://github.com/SemiShell/InkLotology](https://github.com/SemiShell/InkLotology) 