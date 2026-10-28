# ROCOS 官方网站

ROCOS 产品介绍、组件架构与 Talon 浏览器模型预览。站点继承组织主页域名，访问 **http://rocos-sia.cn/rocos-web/**；GitHub 默认入口 **https://rocos-sia.github.io/rocos-web/** 会由 GitHub 跳转至组织域名。源仓库为 [rocos-sia/rocos-web](https://github.com/rocos-sia/rocos-web)。本项目不新增独立自定义域名，保留组织现有绑定。当前组织域名尚无匹配的 HTTPS 证书，暂使用其现有 HTTP 入口；证书签发后再启用 HTTPS。

## 本地运行

需要 Node.js 22.12+ 和 npm。

```bash
npm ci
npm run dev
```

打开终端显示的 `/rocos-web/` 地址。技术栈为 Vite + TypeScript + Three.js，不依赖后端或远程 CDN。

```bash
npm test            # 仿真入口配置的边界与安全校验
npm run build       # TypeScript 检查与静态构建
npm run preview     # 生产产物预览
npx playwright install chromium
npm run test:browser
```

也可使用现有 Chrome：`CHROME_PATH=/usr/bin/google-chrome npm run test:browser`。测试覆盖 1440、768、390 宽度、五页导航与刷新、模型加载、拖动/旋转/缩放/复位、加载失败回退、外部服务入口及手机菜单。对线上站点复跑：`SITE_URL=http://rocos-sia.cn/rocos-web/ CHROME_PATH=/usr/bin/google-chrome npm run test:browser`。

## 页面与状态

- 首页：银白实验室设计、实际 Talon 模型主视觉、架构和体验入口。
- 软件架构：Viz → App → MuJoCo **或** ECM，后两者是并行接入路径。
- 应用场景：模型观察、本地仿真联调、硬件集成，分别说明条件。
- 在线体验：浏览器本地 Three.js 预览，支持触控/鼠标和按钮；静态图用于加载失败或 WebGL 不可用时回退。
- 文档与下载：官方组件说明、配置文档、rocos-releases 及渠道清单。
- 模仿学习、强化学习仅为不可用的“筹备中”导航，不生成子页。

使用 hash 路由（例如 `/#/experience`），刷新不依赖服务器重写。所有本地资源使用 Vite `BASE_URL`，构建基路径固定为 `/rocos-web/`。修改仓库名时同步调整 `vite.config.ts`。

## GitHub Pages 发布

`.github/workflows/pages.yml` 在推送 `main` 时执行安装、单元测试、类型检查、构建和 Chromium 浏览器测试，再上传 `dist/` 并部署至 `github-pages` 环境。只部署静态产物，不启动长期仿真进程。

仓库 Settings → Pages 的 Source 应为 **GitHub Actions**。工作流最小权限为 `contents: read`、`pages: write`、`id-token: write`，使用 GitHub 自带令牌和 OIDC，不存储个人凭据。部署结果查看仓库 Actions。

如果 GitHub Pages 自动跳转到组织自定义域名，检查组织主页仓库 `rocos-sia.github.io` 的 Pages 域名设置；这是 GitHub 的继承行为，不由本项目 `base` 或前端路由控制。不要添加 CNAME。

## 后续实时仿真接入

本轮交付的是**模型预览**，没有连接 App，不进行物理仿真、碰撞检测、关节反馈或机器人控制。显示姿态仅用于观察。默认 `public/config/simulation.json`：

```json
{ "enabled": false, "experienceUrl": null }
```

未来会话服务部署完成后，将 `enabled` 设为 `true`，`experienceUrl` 设为该服务的公开 HTTPS 入口，然后提交、重新部署。配置解析拒绝 HTTP、脚本 URL、带用户名/密码的 URL、缺失和无效数据；加载失败时仍保持“实时仿真暂未开放”。入口配置成功只显示“打开外部仿真服务”，不意味着服务连接成功。

该入口是独立的会话 Web 应用，不是 App API 地址。服务端需要负责会话创建/销毁、独立 App + MuJoCo 进程、共享内存 ID 隔离、超时回收、身份认证和资源配额；Viz 与 App 的真实交互在该服务中完成。任何 token、控制凭据和私钥均不能写入 JSON、源码、构建环境的前端变量或 URL。后续实现前应从 Apifox 刷新 ROCOS API 契约。

## 素材与内容依据

Talon URDF 与 8 个 STL 来自 rocos-app 的 `config/robots/talon/`，原文件未改动。许可声明、固定上游提交、校验清单和第三方软件说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。静态 WebP 由这些实际网格在本项目渲染，不是样式图中的生成机器人。未复制 rocos-viz / rocos-mujoco 代码，未修改参考仓库。

设计沿用已确认的 B · 银白实验室 / One motif（seed 906359474），没有重新抽取方向。圆形来自 Talon 旋转关节；本轮实际交互为模型观察。视觉检查记录见 [.taste-skill/review.md](.taste-skill/review.md)。

本站初版版本为 `1.0.0`，`package.json` 与锁文件保持一致。参考仓库各自的版本规则不跨仓库套用。
