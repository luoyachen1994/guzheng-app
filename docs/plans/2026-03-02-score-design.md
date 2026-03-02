# 动态曲谱设计文档

## 架构

```
分包 scorePackage/
├── pages/score/score.js/.wxml/.wxss/.json
├── data/meihua_sannong.js     ← 曲谱数据
└── audio/meihua_sannong.mp3   ← 用户提供的音频文件
```

主包 app.json 配置 subpackages，音频文件放分包避免占用主包 2MB 限制。

## 曲谱数据结构

```js
{
  title: '梅花三弄',
  bpm: 90,
  timeSignature: [4, 4],
  audioSrc: '/scorePackage/audio/meihua_sannong.mp3',
  sections: [
    {
      name: '第一段',
      measures: [
        {
          notes: [
            { pitch: '5', duration: 1, finger: '中', dot: false },
            { pitch: '3', duration: 1, finger: '食', dot: false },
          ]
        }
      ]
    }
  ]
}
```

- `duration`：以四分音符为1，二分音符为2，八分音符为0.5
- `dot`：附点音符
- `finger`：指法（中/食/无名/大）

## 光标同步

- 播放时每 200ms 轮询 `innerAudioContext.currentTime`
- `measureDuration = (60 / bpm) * beatsPerMeasure * 1000` ms
- `currentMeasure = Math.floor(currentTime * 1000 / measureDuration)`
- 高亮对应小节，scroll-view 自动滚动

## UI

- 顶部：标题 + 播放/暂停/循环按钮
- 进度条：可拖拽跳转
- 曲谱区：scroll-view 纵向滚动，每行一小节，当前小节棕色高亮
- 底部：速度选择 0.75x / 1x / 1.25x
- 点击小节跳转到对应播放位置

## 音频文件

用户将 MP3 放入 `scorePackage/audio/meihua_sannong.mp3`，文件名固定。
