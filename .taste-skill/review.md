# 银白实验室视觉检查

方向：已确认的 B · 银白实验室 / One motif，seed 906359474，无重抽。实际 Talon 旋转关节的圆形作为蓝色舞台、图片裁切和架构节点的共同形状。交互为实际模型观察，没有仿真反馈。样式图只作基准，没有当作网页背景。

## 检查与适用范围

生产构建 `npm run build` + `vite preview`，真实 Chrome。首页执行 `inspect.mjs`，宽度 1440、768、390；已打开三张首屏与三张全页截图。其余四页在上述三个宽度分别截图并逐一查看，共 12 张。没有采用 scroll scenes，未运行 scenes.mjs。

命令：

```bash
node /home/rocos/.codex/skills/design-taste-frontend/scripts/lint.mjs src
node /home/rocos/.codex/skills/design-taste-frontend/scripts/inspect.mjs http://127.0.0.1:4173/rocos-web/ --out .taste-skill/after --allow off-centre,few-pictures
```

首次未豁免检查：4 FAIL、3 WARN。最终适用检查：0 FAIL、3 WARN；源码 lint：0 FAIL、0 WARN。

显式豁免：
- `off-centre`：用户明确指定固定左侧导航；检测器将占宽220px的导航当成左侧空白。主内容在扣除导航后有统一左右内边距，不能为满足检测器删除导航。
- `few-pictures`：沿用用户已确认的大幅实际机器人主视觉，首页保留交互模型和一张模型侧视图，不为图片数量门槛添加无关素材。

保留提示：
- `size-count`：正文、标题和侧栏、模型控件的不同尺寸仍超过五档。后续可进一步合并辅助字号。
- `no-footage`：未提供实际机器人视频；可操作的真实模型承担展示，不用无关图库视频冒充产品录像。
- `name-only-title`：中文标题被英文词数启发式误判。首屏实际有“连接运动控制、MuJoCo 仿真与浏览器可视化。”说明。

## ROUND 1
Seen in one second: 蓝色圆形与白色机器人，但模型偏小且末端被裁切。
Idea (one sentence): Talon 旋转关节成为整个页面的圆形舞台。
Live thing: 在浏览器中旋转、缩放实际 Talon 模型。
Layout words by section: hero=图文主视觉 / 架构=分叉关系 / Talon=双栏 / 源码=整片蓝色 / footer=信息收束
Scores: design 6 · usability 6 · creativity 7 · content 8 → overall 6.4（FAIL 上限后为 6.0）
Caps applied: 检查失败；少于四张实物图片；模型与控件裁切。
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. before/tablet-fold.jpg 模型末端出屏：取消负向容器偏移，镜头以模型实际包围盒为中心，并适配视口宽高。
2. before/desktop-fold.jpg 复位与状态被圆形截断：把圆形背景与交互画布分开，控件保留在可见区域。
3. before/mobile-page-01.jpg 静态图过小且过亮：统一实际模型渲染相机与光照，重新生成三张 WebP。

## ROUND 2
Seen in one second: 蓝色关节圆形舞台上完整的 Talon 机械臂。
Idea (one sentence): 同一关节圆形贯穿模型舞台、架构节点和模型观察图。
Live thing: 鼠标拖动、触控和等效按钮观察真实模型。
Layout words by section: hero=图文主视觉 / 架构=并行分支 / Talon=双栏 / 源码=整片蓝色 / footer=信息收束
Scores: design 6.5 · usability 8 · creativity 7 · content 8 → overall 7.2
Caps applied: 按严格 rubric，首页没有四张摄影/录像，design 上限6.5；没有因此捏造或添加无关照片。
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. after/tablet-fold.jpg 中间版本仍裁切末端：最终相机增加窄画幅距离补偿，重新截图确认完整。
2. after/desktop-page-01.jpg 中间版本侧视图过亮：最终已降低曝光并重新渲染备用图。
3. after/desktop-fold.jpg 辅助字号档位偏多：保留清晰的导航与触控控件，记录为后续排版优化项。

最终已查看重新生成的六张首页截图和十二张内页截图。自评7.2，不宣称达到7.5。没有虚构客户、指标、服务连接或需要替换的样例内容。素材来源和许可在文档页与页脚“素材与许可”可访问；具体声明见 THIRD_PARTY_NOTICES.md。
