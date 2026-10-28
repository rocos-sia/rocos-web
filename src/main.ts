import './style.css';
import { parseSimulationConfig } from './config';

const base = import.meta.env.BASE_URL;
const github = 'https://github.com/rocos-sia';
const external = (url: string, text: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}<span class="external" aria-hidden="true">↗</span></a>`;
const icons: Record<string, string> = {
  home: '<path d="m3 10 9-7 9 7v10h-6v-7H9v7H3Z"/>',
  architecture: '<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v5M5 17v-6h14v6"/>',
  applications: '<path d="m12 3 9 5v9l-9 5-9-5V8Zm0 9 9-4M12 12 3 8m9 4v10"/>',
  experience: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4"/>',
  learning: '<path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15"/>',
  reinforcement: '<path d="M4 20V12h3v8m4 0V4h3v16m4 0V8h3v12"/>',
  docs: '<path d="M5 3h9l5 5v13H5Zm9 0v6h5M9 13h6m-6 4h6"/>',
};
const icon = (name: string) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const pages = [ ['home', '首页'], ['architecture', '软件架构'], ['applications', '应用场景'], ['experience', '在线体验'], ['imitation', '模仿学习'], ['reinforcement', '强化学习'], ['docs', '文档与下载'] ];
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `<header class="mobile-header"><a class="wordmark" href="#/">ROCOS<span class="brand-dot"></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="sidebar">菜单 <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" stroke-width="2"/></svg></button></header>
  <button class="menu-scrim" aria-label="关闭导航" tabindex="-1" hidden></button>
  <aside id="sidebar" class="sidebar"><a class="wordmark" href="#/" aria-label="ROCOS 首页">ROCOS<span class="brand-dot"></span></a>
    <nav aria-label="主要导航">${pages.map(([id, label]) => id === 'imitation' || id === 'reinforcement' ? `<button class="nav-item unavailable" disabled aria-disabled="true">${icon(id === 'imitation' ? 'learning' : 'reinforcement')}<span>${label}</span><small>筹备中</small></button>` : `<a class="nav-item" data-route="${id}" href="#/${id === 'home' ? '' : id}">${icon(id)}<span>${label}</span></a>`).join('')}</nav>
    <div class="sidebar-bottom">${external(github, 'GitHub')}<p>机器人控制系统</p><span>中文</span></div>
  </aside><main id="main" tabindex="-1"></main>`;
const main = document.querySelector<HTMLElement>('main')!;
const footer = () => `<footer class="footer"><a class="wordmark" href="#/">ROCOS<span class="brand-dot"></span></a><p>连接运动控制、仿真与真实世界。</p><div>${external(`${github}/rocos-web`, '网站源码')}${external(`${github}/rocos-web/blob/main/THIRD_PARTY_NOTICES.md`, '素材与许可')}</div><small>© ${new Date().getFullYear()} ROCOS</small></footer>`;
const topbar = () => `<header class="topbar"><span>机器人控制系统</span>${external(`${github}/rocos-web`, '查看源码')}</header>`;
const architecture = () => `<div class="architecture-flow" role="img" aria-label="rocos-viz 连接 rocos-app，App 分别接入 rocos-mujoco 物理仿真或 ECM 硬件，二者并行而非串联"><div class="flow-node">${icon('experience')}<div><strong>rocos-viz</strong><span>浏览器界面</span></div></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-node">${icon('architecture')}<div><strong>rocos-app</strong><span>运动控制</span></div></div><div class="flow-branch"><span class="branch-label">接入其一</span><div class="flow-node"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20 20 3M5 3h15v15" fill="none" stroke="currentColor" stroke-width="2"/></svg><div><strong>rocos-mujoco</strong><span>物理仿真</span></div></div><div class="flow-node"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 4 17 17M5 21h15V6" fill="none" stroke="currentColor" stroke-width="2"/></svg><div><strong>ECM</strong><span>硬件接入</span></div></div></div></div>`;
const viewer = (hero = false) => `<div class="model-viewer ${hero ? 'hero-viewer' : ''}" data-viewer data-state="loading" data-ui><img class="model-fallback" src="${base}images/talon-front.webp" alt="Talon 七轴机械臂的预设观察姿态"/><canvas aria-label="Talon 三维模型，可拖动旋转、滚轮缩放，也可使用下方按钮" role="img"></canvas><div class="viewer-caption"><span data-model-status role="status">正在加载 Talon 模型…</span><button data-view="reset" aria-label="复位视角">↺ <span>复位</span></button></div>${hero ? '' : `<div class="viewer-controls" aria-label="模型视角操作"><button data-view="left">向左旋转</button><button data-view="right">向右旋转</button><button data-view="in">放大</button><button data-view="out">缩小</button></div>`}</div>`;
const home = () => `${topbar()}<section class="hero"><div class="hero-copy"><h1>从仿真，<br>走向真实控制</h1><p class="hero-description">连接运动控制、MuJoCo 仿真与浏览器可视化。</p><a class="button" href="#/experience">打开模型预览 <span aria-hidden="true">→</span></a><a class="text-link" href="#/architecture">了解软件架构</a></div><div class="hero-stage">${viewer(true)}</div></section>
  <section class="section architecture-section"><div class="section-heading"><div><h2>软件架构</h2><p>同一套控制理念，连接仿真与机器人。</p></div><a href="#/architecture">查看组件职责</a></div>${architecture()}</section>
  <section class="section preview-section"><div class="preview-copy"><h2>先认识 Talon</h2><p>Talon 的七个旋转关节，构成从基座到末端的运动链。用实际模型，观察连杆、关节与末端坐标轴的空间关系。</p><p>模型可以在浏览器中自由观察。真实的运动指令与物理反馈，需要连接 App 和仿真服务。</p><a class="text-link" href="#/experience">进入三维预览</a></div><a class="model-still" href="#/experience" aria-label="打开 Talon 三维预览"><img src="${base}images/talon-side.webp" alt="Talon 实际模型的侧面视图" loading="lazy"/><span>Talon · 七轴串联机械臂</span></a></section>
  <section class="section open-section"><h2>让开发有迹可循</h2><div><p>从机器人模型、控制配置到发布文件，沿着组件仓库查看实现与使用说明。先在仿真中联调，再为具体硬件验证配置与行为。</p><a class="text-link" href="#/docs">查阅文档与下载</a></div></section>${footer()}`;
const architecturePage = () => `${topbar()}<div class="page-intro"><h1>一套控制，<br>两种接入</h1><p>Viz 连接 App。App 面向仿真和硬件，提供运动控制与应用服务。</p></div><section class="section"><h2>软件架构</h2>${architecture()}<p class="architecture-note">MuJoCo 与 ECM 是两条并行路径。选择仿真或实体机器人时，需要使用匹配的模型、配置与组件版本。</p></section>
  <section class="section component-section"><h2>各组件做什么</h2><dl class="component-list"><div><dt>rocos-viz<span>浏览器可视化与操作界面</span></dt><dd>显示 URDF 三维模型、机器人状态与数据曲线，提供关节点动、笛卡尔点动、精确运动及工具配置入口。完整控制功能需要连接 App。${external(`${github}/rocos-viz`, '阅读 Viz 文档')}</dd></div><div><dt>rocos-app<span>运动控制与应用服务</span></dt><dd>组织机器人模型、运动规划、控制状态与 Lua 应用逻辑，通过 HTTP / WebSocket 与前端通信，通过共享内存与底层主站交互。${external(`${github}/rocos-app`, '阅读 App 文档')}</dd></div><div><dt>rocos-mujoco<span>物理仿真</span></dt><dd>基于 MuJoCo 运行物理模型，模拟主站共享内存接口与驱动行为，向 App 提供关节反馈并接收目标值；支持可视化或无头运行。${external(`${github}/rocos-mujoco`, '阅读仿真文档')}</dd></div><div><dt>ECM<span>硬件接入</span></dt><dd>对接 EtherCAT 主站与实体从站，承担硬件侧的数据交换。实机接入需核对总线、驱动、关节映射与安全条件。${external(`${github}/rocos-app/blob/main/config/README.md`, '查看硬件配置说明')}</dd></div></dl></section>
  <section class="section blue-band"><h2>控制逻辑与运行环境分开</h2><p>在仿真端验证控制流程，在硬件端验证真实行为。相同的接口思路方便迁移，但模型参数、单位、周期和共享内存 ABI 都需要逐项核对。仿真通过不等于完成实机验收。</p></section><section class="section two-columns"><h2>从本地联调开始</h2><div><p>先配置并启动 MuJoCo，再启动使用匹配共享内存配置的 App，最后使用 Viz 连接 App。仿真服务运行在 Linux 主机上，浏览器负责交互与展示。</p><p>本官网提供独立的模型观察入口。实时仿真会话服务尚未开放。</p><a class="text-link" href="#/experience">打开模型预览</a></div></section>${footer()}`;
const applicationsPage = () => `${topbar()}<div class="page-intro"><h1>从模型理解，<br>到控制验证</h1><p>围绕现有组件展开的开发场景。部署条件与当前开放范围在每个场景中说明。</p></div>
  <section class="section scenario"><div><h2>观察机器人结构</h2><p class="availability">官网可体验</p><p>旋转、缩放 Talon 实际模型，观察七轴机械臂的连杆形态、关节布局和末端坐标轴，作为理解机器人模型的起点。</p><p>当前姿态是预设的观察姿态；预览不执行碰撞检测或物理计算。</p><a class="text-link" href="#/experience">打开模型预览</a></div><img src="${base}images/talon-front.webp" alt="Talon 机械臂完整模型" loading="lazy"/></section>
  <section class="section scenario reversed"><div><h2>联调运动控制</h2><p class="availability">需本地部署 App + MuJoCo</p><p>用 MuJoCo 提供关节反馈，通过 App 联调位置、速度和力矩控制流程。Viz 提供点动、精确运动和状态曲线入口，便于观察指令与反馈之间的关系。</p><p>适合验证配置和控制流程；模型、驱动行为与周期设置决定可验证的范围。</p>${external(`${github}/rocos-mujoco#快速开始`, '查看仿真部署步骤')}</div><img src="${base}images/talon-detail.webp" alt="Talon 实际模型的关节与连杆局部" loading="lazy"/></section>
  <section class="section two-columns"><h2>集成实体机器人</h2><div><p class="availability">需 ECM 与匹配的硬件环境</p><p>App 通过硬件接入层连接实体机器人，在 Viz 中查看状态、执行运动操作和配置工具。安装前需核对驱动参数、关节映射、单位换算与版本兼容性。</p><p>这些是组件支持的开发路径，不代表客户案例或生产验收结果。</p>${external(`${github}/rocos-app/blob/main/config/README.md`, '阅读配置规范')}</div></section>
  <section class="section planning"><h2>学习能力仍在筹备</h2><p>模仿学习与强化学习仅保留导航位置，当前官网不提供训练任务、数据采集服务或在线策略运行。</p></section>${footer()}`;
const experiencePage = () => `${topbar()}<div class="page-intro compact"><h1>从 Talon 开始</h1><p>实际模型，直接观察。拖动旋转，滚轮或双指缩放，也可使用视角按钮。</p></div><section class="section experience-section"><h2 class="visually-hidden">Talon 三维模型预览</h2>${viewer()}<div class="preview-notes"><p><strong>模型预览</strong> · 七轴机械臂的预设姿态，只在浏览器本地渲染。</p><p>末端红、绿、蓝轴分别表示 X、Y、Z 方向；当前未配置工具 TCP。</p></div></section>
  <section class="section simulation-section"><h2>App + MuJoCo 实时控制</h2><div data-simulation-status><p class="availability">实时仿真暂未开放</p><p>当前未配置公开仿真服务。上方模型预览可直接使用，页面不会发送运动指令，也不提供实时关节反馈。</p></div><p>后续服务将独立运行 App 与 MuJoCo，由会话服务提供访问入口、会话隔离和生命周期管理。官网仅负责打开服务入口。</p>${external(`${github}/rocos-mujoco#快速开始`, '先在本地运行仿真')}</section>
  <section class="section model-gallery"><h2>模型静态视图</h2><p>三维显示不可用时，仍可通过实际模型渲染图观察结构。</p><div><figure><img src="${base}images/talon-front.webp" alt="Talon 预设姿态的正面观察图" loading="lazy"/><figcaption>整体结构</figcaption></figure><figure><img src="${base}images/talon-side.webp" alt="Talon 预设姿态的侧面观察图" loading="lazy"/><figcaption>侧向轮廓</figcaption></figure><figure><img src="${base}images/talon-detail.webp" alt="Talon 的旋转关节局部观察图" loading="lazy"/><figcaption>旋转关节</figcaption></figure></div></section>${footer()}`;
const docsPage = () => `${topbar()}<div class="page-intro"><h1>从源码到运行</h1><p>官方组件、配置文档与发布入口。按部署目标选择组件，并核对版本兼容关系。</p></div><section class="section"><h2>组件与文档</h2><div class="resource-list"><article><h3>rocos-app</h3><p>运动控制与应用服务。包含启动配置、机器人模型、工具配置和构建说明。</p><div>${external(`${github}/rocos-app`, '官方仓库')}${external(`${github}/rocos-app/blob/main/config/README.md`, '配置文档')}${external(`${github}/rocos-app/blob/main/docs/tool_calibration.md`, '工具与标定')}</div></article><article><h3>rocos-viz</h3><p>浏览器可视化与操作界面。包含前端运行、控制器连接和工具配置说明。</p><div>${external(`${github}/rocos-viz`, '官方仓库')}${external(`${github}/rocos-viz/blob/main/README.md`, '运行说明')}${external(`${github}/rocos-viz/blob/main/docs/tool-configuration-guide.md`, '工具配置')}</div></article><article><h3>rocos-mujoco</h3><p>物理仿真组件。包含可视化 / 无头运行、模型加载与共享内存配置说明。</p><div>${external(`${github}/rocos-mujoco`, '官方仓库')}${external(`${github}/rocos-mujoco/blob/main/docs/config.md`, '仿真配置')}${external(`${github}/rocos-mujoco/blob/main/docs/hardware_config.md`, '硬件映射')}</div></article></div></section>
  <section class="section download-band"><div><h2>文档与下载</h2><p>rocos-releases 维护组件发布清单、发布说明与安装包。以发布页面列出的平台、架构与校验信息为准。</p><p>渠道清单中的空值表示尚无可提供的发布；同一渠道的组件不自动构成已验证兼容的套装。</p></div><div class="download-links">${external(`${github}/rocos-releases/releases`, '打开 GitHub Releases')}${external(`${github}/rocos-releases`, '发布仓库与安装说明')}${external(`${github}/rocos-releases/blob/main/channels/stable.json`, '正式版清单')}${external(`${github}/rocos-releases/blob/main/channels/internal.json`, '内测版清单')}</div></section>
  <section class="section two-columns"><h2>模型与素材来源</h2><div><p>本站 Talon 模型来自 rocos-app 的 URDF 与 STL 网格，按上游 README 声明的 MIT 许可保留来源。静态图由该实际模型渲染，观察姿态不代表控制反馈。</p>${external(`${github}/rocos-web/blob/main/THIRD_PARTY_NOTICES.md`, '查看素材来源与许可说明')}</div></section>${footer()}`;
const renderers: Record<string, () => string> = { home, architecture: architecturePage, applications: applicationsPage, experience: experiencePage, docs: docsPage };
let disposeViewer: (() => void) | undefined;
let generation = 0;
let revealObserver: IntersectionObserver | undefined;
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const sidebar = document.querySelector<HTMLElement>('.sidebar')!;
const scrim = document.querySelector<HTMLButtonElement>('.menu-scrim')!;
function setMenu(open: boolean) {
  menu.setAttribute('aria-expanded', String(open)); sidebar.classList.toggle('open', open); scrim.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  if (open) sidebar.querySelector<HTMLAnchorElement>('.nav-item[aria-current]')?.focus();
}
const mobileQuery = window.matchMedia('(max-width: 900px)');
mobileQuery.addEventListener('change', () => setMenu(false));
document.querySelector('.skip-link')?.addEventListener('click', event => { event.preventDefault(); main.focus(); });
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
scrim.addEventListener('click', () => { setMenu(false); menu.focus(); });
document.addEventListener('keydown', event => {
  if (!mobileQuery.matches || menu.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') { setMenu(false); menu.focus(); }
  if (event.key === 'Tab') {
    const items = [menu, ...sidebar.querySelectorAll<HTMLElement>('a[href]')];
    const first = items[0], last = items.at(-1)!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
async function route() {
  const key = location.hash === '#main' ? 'home' : location.hash.replace(/^#\/?/, '') || 'home';
  const page = renderers[key] ? key : '404';
  revealObserver?.disconnect();
  const current = ++generation; disposeViewer?.(); disposeViewer = undefined; setMenu(false);
  main.innerHTML = page === '404' ? `${topbar()}<div class="page-intro"><h1>页面未找到</h1><p>请从导航选择页面，或返回首页。</p><a class="button" href="#/">返回首页</a></div>${footer()}` : renderers[page]();
  document.title = `${pages.find(([id]) => id === page)?.[1] ?? '页面未找到'} · ROCOS`;
  document.querySelectorAll<HTMLElement>('[data-route]').forEach(link => {
    if (link.dataset.route === page) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  if (current > 1) main.focus({ preventScroll: true });
  const reveal = revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveal.unobserve(entry.target); }
  }), { threshold: 0.08 });
  main.querySelectorAll('.section h2, .section p, .section .text-link, .flow-node, .model-still, .resource-list article').forEach(element => reveal.observe(element));
  const host = main.querySelector<HTMLElement>('[data-viewer]');
  if (host) {
    try {
      const { createViewer } = await import('./viewer');
      if (current !== generation) return;
      const dispose = await createViewer(host);
      if (current !== generation) dispose(); else disposeViewer = dispose;
    } catch {
      const status = host.querySelector('[data-model-status]');
      if (status) status.textContent = '三维预览暂不可用，请查看模型静态图。';
      host.dataset.state = 'error';
    }
  }
  if (page === 'experience') {
    try {
      const response = await fetch(`${base}config/simulation.json`);
      if (!response.ok || current !== generation) return;
      const config = parseSimulationConfig(await response.json());
      if (config.enabled && config.experienceUrl && current === generation) {
        const section = main.querySelector('[data-simulation-status]')!;
        section.innerHTML = '<p>已配置外部仿真入口，服务可用性以该服务页面为准。</p>';
        const link = document.createElement('a'); link.className = 'button'; link.href = config.experienceUrl;
        link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '打开外部仿真服务'; section.append(link);
      }
    } catch { /* Fail closed: the usable local model preview stays available. */ }
  }
}
window.addEventListener('hashchange', () => { void route(); });
void route();
