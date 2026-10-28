# 素材与第三方许可

## Talon 实际机器人模型

- 来源：[rocos-sia/rocos-app](https://github.com/rocos-sia/rocos-app/tree/93a39b586373761f2dd9ad4a277051664f7b952c/config/robots/talon)
- 固定参考提交：`93a39b586373761f2dd9ad4a277051664f7b952c`
- `public/models/talon/source.urdf` 是上游 `config/robots/talon/robot.urdf` 的逐字节副本。
- `public/models/talon/*.STL` 是上游 `config/robots/talon/meshes/*.STL` 的逐字节副本。
- 上游根 README 声明 MIT，版权行为 `Copyright (c) 2021 'Yang Luo, luoyang@sia.cn'`；模型目录内未发现单独许可证。保留该声明及 MIT 全文如下。本说明不声称另有独立模型授权或品牌商标授权。
- `public/images/talon-{front,side,detail}.webp` 由这些网格在本项目 Three.js 中渲染；材质、灯光和预设姿态属于展示设置，不是实机照片或仿真反馈。
- 校验值保存在 `public/models/talon/SHA256SUMS`。

Copyright (c) 2021 'Yang Luo, luoyang@sia.cn'

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Three.js

本站分发 Three.js 及其 OrbitControls、STLLoader（MIT）。
Copyright © 2010–2025 three.js authors.

适用的 MIT 条款与上文相同；构建时完整复制当前依赖 LICENSE 到 `dist/licenses/three-LICENSE.txt`，模型许可复制到 `dist/licenses/THIRD_PARTY_NOTICES.md`，使部署产物保留许可。Vite、TypeScript 和 Playwright 只用于开发、构建与测试，具体许可见各包。

## 设计及内容

使用已有的“B · 银白实验室”方向，样式图仅作为设计参考，不发布整张图，也未将其用作网页背景。ROCOS 字样使用文字排版；导航图标为本项目简单 SVG。无外部图库照片、字体 CDN、虚构客户或案例。

内容依据为 rocos-app、rocos-viz、rocos-mujoco、rocos-releases 的 README 和配置文档。链接指向对应官方源文件；不将文档中规划中的能力描述为官网已提供的服务。
