# 视频分析功能设计

## 架构

```
小程序前端 → 上传视频 → Python 后端（阿里云）→ 返回分析 JSON → 前端展示报告
```

## Python 后端 (FastAPI)

### 目录结构
```
server/
├── main.py              # FastAPI 入口，路由定义
├── requirements.txt     # 依赖
├── services/
│   ├── audio_analyzer.py   # librosa 音频分析
│   ├── hand_analyzer.py    # MediaPipe 手部识别
│   └── video_processor.py  # FFmpeg 视频处理（提取音频、抽帧）
```

### API 端点

**POST /api/analyze/video**
- 接收：视频文件（multipart/form-data）
- 处理流程：
  1. FFmpeg 提取音频（wav 格式）
  2. FFmpeg 抽帧（每秒 2 帧）
  3. librosa 分析音频 → 音准、节奏、力度
  4. MediaPipe 分析抽帧图片 → 手部关键点、手型评估
  5. 合并结果返回
- 返回：JSON 分析报告

### 音频分析 (audio_analyzer.py)
- librosa.load() 加载音频
- librosa.pyin() 基频检测 → 音准评分
- librosa.onset.onset_detect() 节拍检测 → 节奏评分
- librosa.feature.rms() 能量分析 → 力度评分
- 生成逐秒音准曲线数据

### 手部分析 (hand_analyzer.py)
- MediaPipe Hands 检测 21 个手部关键点
- 分析手指角度、手型是否标准
- 生成问题列表和建议

### 视频处理 (video_processor.py)
- FFmpeg 提取音频轨道
- FFmpeg 按间隔抽帧

## 小程序端改动

### services/api.js
- apiBaseUrl 改为阿里云服务器地址

### services/video.js
- analyzeVideo() 上传视频到 Python 后端 POST /api/analyze/video
- 处理返回的分析结果

### pages/practice/practice.js
- analyzeRecording() 调用真实 API 替代 simulateAnalysis()
- 将分析结果传递给报告页

### pages/report/report.wxml + report.js
- 展示真实的音准、节奏、力度评分
- 展示手型问题列表和建议

## 依赖（全部免费开源）
- FastAPI + uvicorn
- librosa + numpy
- mediapipe
- ffmpeg-python
- python-multipart
