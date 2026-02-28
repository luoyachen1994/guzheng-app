# 节拍器功能设计文档（PRD）

## 文档信息
- **功能名称**：节拍器
- **优先级**：P0（第一周交付）
- **设计日期**：2026-02-28
- **目标用户**：古筝学习者

---

## 一、功能概述

### 1.1 产品目标
为古筝学习者提供专业、易用的节拍器工具，帮助练习者建立稳定的节奏感，提升演奏的时间准确性。

### 1.2 核心价值
- 提供稳定的节奏参考，适合不同练习阶段
- 支持多种拍型和速度预设，满足各类曲目需求
- 古筝音色特色，贴合练习场景
- 后台播放支持，方便多场景使用

### 1.3 使用场景
- **场景1**：初学者单独练习节奏感，熟悉不同拍型
- **场景2**：练习曲目时使用节拍器保持速度稳定
- **场景3**：跟随老师要求的特定速度（如"用行板练习"）
- **场景4**：逐步提升演奏速度，从慢速到原速

---

## 二、功能架构

### 2.1 页面结构
- **位置**：独立工具页 `pages/metronome/`
- **入口**：首页功能卡片、底部导航（可选）

### 2.2 核心功能模块

```
┌─────────────────────────────────┐
│        节拍器页面               │
├─────────────────────────────────┤
│  1. 音效切换                    │
│  2. 速度预设（术语/场景）        │
│  3. 速度控制（滑块+按钮）        │
│  4. 节拍类型选择                │
│  5. 视觉指示器（摆锤/方块）      │
│  6. 播放控制                    │
└─────────────────────────────────┘
```

---

## 三、详细设计

### 3.1 速度控制模块

#### 3.1.1 速度范围
- **最小值**：30 BPM
- **最大值**：240 BPM
- **默认值**：96 BPM（中板）

#### 3.1.2 调节方式

**滑块调节**
- 横向滑块，覆盖 30-240 BPM
- 步长：1 BPM
- 显示刻度标记（每 30 BPM 一个刻度）
- 拖动时实时更新显示

**按钮微调**
- 四个按钮：[-5] [-1] [+1] [+5]
- 排列在速度显示下方
- 点击时短震动反馈
- 自动限制在有效范围内

**速度显示**
- 超大字号居中显示（如 "120"）
- 显示单位 "BPM"
- 字体：数字专用字体，清晰易读

---

### 3.2 预设速度系统

#### 3.2.1 音乐术语预设

| 术语 | 中文 | BPM | 说明 |
|------|------|-----|------|
| Grave | 庄板 | 40 | 极慢 |
| Largo | 广板 | 50 | 很慢 |
| Adagio | 柔板 | 60 | 慢 |
| Andante | 行板 | 76 | 稍慢 |
| Moderato | 中板 | 96 | 中等 |
| Allegretto | 小快板 | 112 | 稍快 |
| Allegro | 快板 | 132 | 快 |
| Presto | 急板 | 168 | 很快 |

#### 3.2.2 练习场景预设

| 场景 | BPM | 说明 |
|------|-----|------|
| 初学 | 60 | 初次接触曲目，分解动作 |
| 熟悉 | 80 | 已掌握指法，练习连贯性 |
| 熟练 | 100 | 可以完整演奏，提升速度 |
| 演奏 | 120 | 接近原速演奏 |

#### 3.2.3 UI展示
- 页面上方显示两个Tab："音乐术语" / "练习场景"
- Tab内容横向滚动显示预设按钮
- 点击预设后速度自动调整
- 当前速度匹配的预设高亮显示
- 用户可在预设基础上继续微调

---

### 3.3 节拍类型选择

#### 3.3.1 支持的拍型
- **2/4**：强-弱
- **3/4**：强-弱-弱
- **4/4**：强-弱-次强-弱（最常用）
- **3/8**：强-弱-弱
- **6/8**：强-弱-弱-次强-弱-弱
- **9/8**：强-弱-弱-次强-弱-弱-次强-弱-弱

#### 3.3.2 UI展示
- 横向排列的选项卡
- 当前选中项突出显示（背景色+边框）
- 默认选择：4/4

---

### 3.4 音效系统

#### 3.4.1 音效类型

**1. 经典木鱼**
- 强拍：低沉的"咚"声
- 弱拍：清脆的"哒"声
- 适合传统练习习惯

**2. 古筝音色**
- 强拍：中音5（sol）+ 音量加强
- 弱拍：中音5（sol）+ 音量减弱
- 贴合古筝练习场景

**3. 电子音**
- 强拍：高频提示音
- 弱拍：低频提示音
- 简洁清晰

#### 3.4.2 切换方式
- 页面右上角音效图标按钮
- 点击弹出选择菜单或直接切换
- 当前选中的音效类型显示在图标上

---

### 3.5 视觉指示器

用户可切换两种视觉反馈模式：

#### 3.5.1 摆锤动画模式
- 模拟传统机械节拍器的钟摆
- 摆锤左右摆动，摆动速度对应BPM
- 强拍到达最左/右端
- 弱拍经过中心点
- 颜色变化：强拍变亮/变色

#### 3.5.2 方块阵列模式
- 根据拍型显示对应数量的方块
  - 4/4拍：4个方块
  - 3/4拍：3个方块
  - 6/8拍：6个方块
- 当前拍的方块高亮放大
- 强拍：特殊颜色（如金色/红色）+ 更大尺寸
- 弱拍：普通颜色（如蓝色/灰色）
- 次强拍：中间颜色（如橙色）

#### 3.5.3 切换方式
- 视觉指示器区域右上角切换图标
- 点击在两种模式间切换
- 用户偏好保存到本地存储

---

### 3.6 播放控制

#### 3.6.1 播放按钮
- 大号圆形按钮，居中显示
- 未播放状态：绿色播放图标 ▶
- 播放中状态：红色暂停图标 ⏸
- 点击切换播放/暂停

#### 3.6.2 播放行为
- 点击播放后立即开始第一拍（强拍）
- 播放中可随时调整速度、拍型（实时生效）
- 播放中切换音效立即生效
- 暂停后再播放从第一拍开始

#### 3.6.3 后台播放
- 支持小程序切到后台继续播放
- 支持锁屏状态继续播放
- 用户主动暂停或关闭页面时停止

---

## 四、界面布局

### 4.1 页面结构（从上到下）

```
┌─────────────────────────────────┐
│  节拍器              [音效图标]  │  ← 顶部栏
├─────────────────────────────────┤
│  [音乐术语] [练习场景]          │  ← Tab切换
│  [柔板][行板][中板][快板]...    │  ← 预设按钮（横向滚动）
├─────────────────────────────────┤
│                                 │
│           120                   │  ← 速度显示（大字号）
│           BPM                   │
│                                 │
│    [-5]  [-1]  [+1]  [+5]      │  ← 微调按钮
│                                 │
├─────────────────────────────────┤
│  30 ●────────────○────── 240   │  ← 滑块
├─────────────────────────────────┤
│  [2/4][3/4][4/4][6/8][9/8]     │  ← 拍型选择
├─────────────────────────────────┤
│          [切换视觉]              │
│      ╱        │        ╲       │  ← 视觉指示器
│     ╱         │         ╲      │  （摆锤或方块）
│    ●          ●          ●     │
├─────────────────────────────────┤
│                                 │
│           ( ▶ )                │  ← 播放按钮
│                                 │
└─────────────────────────────────┘
```

### 4.2 视觉风格
- 整体风格：简洁、专业
- 主色调：与app整体配色一致
- 强拍颜色：红色/金色（醒目）
- 弱拍颜色：蓝色/灰色（柔和）
- 按钮：圆角矩形，有阴影
- 动画：流畅自然，60fps

---

## 五、技术实现方案

### 5.1 音频播放技术

#### 5.1.1 音效资源
```
assets/sounds/metronome/
├── wooden/          # 木鱼音效
│   ├── strong.mp3   # 强拍
│   └── weak.mp3     # 弱拍
├── guzheng/         # 古筝音效
│   ├── strong.mp3
│   └── weak.mp3
└── electronic/      # 电子音效
    ├── strong.mp3
    └── weak.mp3
```

- 格式：MP3（兼容性好）
- 采样率：44.1kHz
- 时长：<0.5秒
- 文件大小：<50KB/个

#### 5.1.2 播放实现
```javascript
// 创建音频上下文
const audioCtx = wx.createInnerAudioContext()
audioCtx.obeyMuteSwitch = false  // 忽略静音开关
audioCtx.autoplay = false

// 播放节拍音
function playBeat(isStrong) {
  const soundType = this.data.soundType  // wooden/guzheng/electronic
  const beatType = isStrong ? 'strong' : 'weak'
  audioCtx.src = `/assets/sounds/metronome/${soundType}/${beatType}.mp3`
  audioCtx.play()
}
```

#### 5.1.3 后台播放配置
```json
// app.json
{
  "requiredBackgroundModes": ["audio"]
}
```

```javascript
// 页面加载时设置
onLoad() {
  wx.setInnerAudioOption({
    obeyMuteSwitch: false,
    speakerOn: true
  })
}
```

---

### 5.2 高精度定时器

#### 5.2.1 问题分析
JavaScript 的 `setInterval` 存在累积误差，长时间运行会导致节拍不准。

#### 5.2.2 解决方案
使用 `setTimeout` + 误差补偿算法

```javascript
class Metronome {
  constructor() {
    this.bpm = 96
    this.isRunning = false
    this.startTime = 0
    this.beatCount = 0
    this.timeSignature = [4, 4]  // [每小节拍数, 以几分音符为一拍]
    this.currentBeat = 0
  }

  start() {
    this.isRunning = true
    this.startTime = Date.now()
    this.beatCount = 0
    this.currentBeat = 0
    this.tick()
  }

  tick() {
    if (!this.isRunning) return

    // 计算下一拍的理论时间
    this.beatCount++
    const interval = 60000 / this.bpm  // 每拍间隔（毫秒）
    const expectedTime = this.startTime + this.beatCount * interval

    // 计算实际时间偏差
    const actualTime = Date.now()
    const drift = actualTime - expectedTime

    // 播放当前拍
    this.currentBeat = (this.currentBeat % this.timeSignature[0]) + 1
    const isStrong = (this.currentBeat === 1) ||
                     (this.timeSignature[0] === 6 && this.currentBeat === 4)
    this.playBeat(isStrong)

    // 更新视觉指示器
    this.updateVisualIndicator(this.currentBeat, isStrong)

    // 设置下一拍（补偿时间偏差）
    const nextDelay = interval - drift
    setTimeout(() => this.tick(), Math.max(0, nextDelay))
  }

  stop() {
    this.isRunning = false
  }

  setBPM(bpm) {
    this.bpm = Math.max(30, Math.min(240, bpm))
    if (this.isRunning) {
      // 重新开始以应用新速度
      this.stop()
      this.start()
    }
  }

  setTimeSignature(beatsPerMeasure, noteValue) {
    this.timeSignature = [beatsPerMeasure, noteValue]
    this.currentBeat = 0
  }
}
```

---

### 5.3 视觉动画实现

#### 5.3.1 摆锤动画
```css
/* WXSS */
.pendulum {
  width: 200rpx;
  height: 300rpx;
  position: relative;
}

.pendulum-rod {
  width: 4rpx;
  height: 250rpx;
  background: #333;
  position: absolute;
  left: 50%;
  top: 0;
  transform-origin: top center;
  animation: swing var(--swing-duration) linear infinite;
}

@keyframes swing {
  0% { transform: rotate(-20deg); }
  50% { transform: rotate(20deg); }
  100% { transform: rotate(-20deg); }
}
```

```javascript
// JS 动态设置动画时长
updatePendulum(bpm) {
  const duration = (60 / bpm) * 2  // 一个完整摆动周期 = 2拍
  this.setData({
    pendulumStyle: `--swing-duration: ${duration}s`
  })
}
```

#### 5.3.2 方块阵列动画
```css
/* WXSS */
.beat-blocks {
  display: flex;
  justify-content: center;
  gap: 20rpx;
}

.beat-block {
  width: 60rpx;
  height: 60rpx;
  background: #e0e0e0;
  border-radius: 8rpx;
  transition: all 0.1s ease;
}

.beat-block.active {
  background: #4CAF50;
  transform: scale(1.3);
}

.beat-block.strong {
  background: #f44336;
  transform: scale(1.5);
}
```

```javascript
// JS 更新方块状态
updateVisualIndicator(beatNumber, isStrong) {
  const blocks = this.data.beatBlocks.map((block, index) => ({
    ...block,
    active: index === beatNumber - 1,
    strong: (index === beatNumber - 1) && isStrong
  }))
  this.setData({ beatBlocks: blocks })
}
```

---

### 5.4 数据持久化

#### 5.4.1 保存用户偏好
```javascript
// 保存设置
savePreferences() {
  wx.setStorageSync('metronome_prefs', {
    bpm: this.data.bpm,
    timeSignature: this.data.timeSignature,
    soundType: this.data.soundType,
    visualMode: this.data.visualMode,  // 'pendulum' or 'blocks'
  })
}

// 加载设置
loadPreferences() {
  const prefs = wx.getStorageSync('metronome_prefs')
  if (prefs) {
    this.setData(prefs)
  }
}
```

---

## 六、交互反馈

### 6.1 触觉反馈
- 调整速度按钮：短震动（15ms）
- 切换拍型：短震动（15ms）
- 播放/暂停：中等震动（25ms）

```javascript
wx.vibrateShort({ type: 'light' })
```

### 6.2 视觉反馈
- 强拍时：指示器明显变化（颜色+大小）
- 按钮点击：按下效果（scale + 透明度）
- 播放中：播放按钮呼吸灯效果
- 速度变化：数字短暂放大动画

### 6.3 音频反馈
- 每次调整速度时播放一次当前音效（预览）
- 切换音效时播放一次新音效（预览）

---

## 七、性能优化

### 7.1 音频优化
- 音频文件预加载，避免首次播放延迟
- 使用音频池，复用音频上下文
- 音频文件压缩优化，减小体积

### 7.2 动画优化
- 使用 CSS transform（硬件加速）
- 避免频繁 setData，批量更新
- 动画帧率控制在 60fps

### 7.3 内存优化
- 页面隐藏时停止动画
- 页面卸载时清理定时器和音频上下文

```javascript
onHide() {
  this.metronome.stop()
}

onUnload() {
  this.metronome.stop()
  this.audioCtx.destroy()
}
```

---

## 八、测试用例

### 8.1 功能测试

| 测试项 | 测试步骤 | 预期结果 |
|--------|----------|----------|
| 速度调节 | 拖动滑块到120 BPM | 显示120，节拍速度对应变化 |
| 按钮微调 | 点击+5按钮 | 速度增加5 BPM |
| 边界值 | 滑块拖到最左 | 显示30 BPM，不能更小 |
| 预设选择 | 点击"快板" | 速度跳转到132 BPM |
| 拍型切换 | 选择3/4拍 | 方块变为3个，强弱节奏正确 |
| 音效切换 | 切换到古筝音色 | 播放古筝音效 |
| 视觉切换 | 切换到方块模式 | 显示方块阵列 |
| 播放控制 | 点击播放按钮 | 开始播放节拍 |
| 后台播放 | 切换到其他app | 节拍继续播放 |
| 节奏准确性 | 播放5分钟 | 节拍保持稳定，无明显偏差 |

### 8.2 兼容性测试
- iOS微信客户端
- Android微信客户端
- 不同屏幕尺寸适配

### 8.3 性能测试
- 长时间运行（30分钟）内存稳定
- CPU占用率<10%
- 动画流畅度60fps

---

## 九、开发计划

### 9.1 任务分解

**第1天：基础框架**
- 创建页面结构和基本布局
- 实现速度控制（滑块+按钮）
- 实现BPM显示

**第2天：核心功能**
- 实现高精度定时器
- 集成音频播放
- 实现拍型逻辑（强弱拍判断）

**第3天：音效和预设**
- 准备/录制三套音效文件
- 实现音效切换
- 实现预设速度系统（术语+场景）

**第4天：视觉指示器**
- 实现摆锤动画
- 实现方块阵列动画
- 实现视觉模式切换

**第5天：优化和测试**
- 后台播放配置和测试
- 交互反馈优化
- 数据持久化
- 全面测试和bug修复

### 9.2 交付标准
- ✅ 所有功能正常运行
- ✅ 节拍精度误差<10ms
- ✅ 后台播放稳定
- ✅ 无明显性能问题
- ✅ 通过兼容性测试

---

## 十、未来扩展

### 10.1 V1.1 规划
- 添加重音模式（用户自定义强弱拍模式）
- 支持复合节拍（如5/4, 7/8）
- 添加渐变速度（渐快/渐慢）

### 10.2 V1.2 规划
- 与曲谱系统联动（曲谱播放时自动启用节拍器）
- 节拍器录音功能（录下练习+节拍器混音）
- 更多音色选择（钢琴、鼓点等）

---

## 十一、附录

### 11.1 音乐术语参考
- BPM：Beats Per Minute（每分钟拍数）
- 拍号：Time Signature（如4/4表示每小节4拍，以四分音符为一拍）
- 强拍：小节中力度较强的拍子
- 弱拍：小节中力度较弱的拍子

### 11.2 相关文件
- 产品路线图：`docs/product_roadmap.md`
- UI设计稿：待补充
- 音效素材：`assets/sounds/metronome/`

---

*文档版本：V1.0*
*最后更新：2026-02-28*
