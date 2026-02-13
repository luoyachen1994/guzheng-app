// pages/practice/practice.js
const app = getApp();
const audioService = require('../../services/audio');
const videoService = require('../../services/video');

Page({
  data: {
    currentMode: 'video', // video | audio | combined
    isRecording: false,
    isAnalyzing: false,
    analyzeProgress: '',
    cameraReady: false,
    cameraPosition: 'front',
    recordingSeconds: 0,
    formatTime: '00:00',
    handPoints: [],
    selectedSong: {},
    // 录制器实例
    recorderManager: null,
    cameraContext: null,
  },

  // 录制定时器
  _timer: null,
  // 录制开始时间
  _startTime: null,

  onLoad(options) {
    if (options.mode) {
      this.setData({ currentMode: options.mode });
    }
    this.initRecorder();
  },

  onUnload() {
    this.clearTimer();
    if (this.data.isRecording) {
      this.cancelRecording();
    }
  },

  // 初始化录音器
  initRecorder() {
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      console.log('录音开始');
    });

    recorderManager.onStop((res) => {
      console.log('录音结束', res);
      this._audioFilePath = res.tempFilePath;
      this._audioDuration = res.duration;
      // 如果是纯音频模式，直接分析
      if (this.data.currentMode === 'audio') {
        this.analyzeRecording();
      }
    });

    recorderManager.onError((err) => {
      console.error('录音错误', err);
      wx.showToast({ title: '录音出错，请重试', icon: 'none' });
      this.resetRecordingState();
    });

    this.data.recorderManager = recorderManager;
  },

  // 模式切换
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (this.data.isRecording) return;
    this.setData({ currentMode: mode });
  },

  // 摄像头初始化完成
  onCameraInit() {
    this.setData({ cameraReady: true });
    this.data.cameraContext = wx.createCameraContext();
  },

  // 摄像头错误
  onCameraError(e) {
    console.error('摄像头错误', e);
    this.setData({ cameraReady: false });
  },

  // 授权摄像头
  requestCameraAuth() {
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        this.setData({ cameraReady: true });
      },
      fail: () => {
        wx.showModal({
          title: '权限提示',
          content: '需要摄像头权限来录制练习视频，请在设置中开启',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          },
        });
      },
    });
  },

  // 翻转摄像头
  flipCamera() {
    this.setData({
      cameraPosition: this.data.cameraPosition === 'front' ? 'back' : 'front',
    });
  },

  // 选择曲目
  selectSong() {
    // TODO: 弹出曲目选择列表
    wx.showToast({ title: '曲谱库开发中', icon: 'none' });
  },

  // ===== 录制控制 =====

  // 开始录制
  startRecording() {
    const { currentMode } = this.data;

    // 音频录制（audio 和 combined 模式）
    if (currentMode === 'audio' || currentMode === 'combined') {
      this.startAudioRecording();
    }

    // 视频录制（video 和 combined 模式）
    if (currentMode === 'video' || currentMode === 'combined') {
      this.startVideoRecording();
    }

    this.setData({ isRecording: true, recordingSeconds: 0, formatTime: '00:00' });
    this.startTimer();
  },

  // 开始音频录制
  startAudioRecording() {
    const { recorderManager } = this.data;
    recorderManager.start({
      duration: 300000, // 最长5分钟
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
    });
  },

  // 开始视频录制
  startVideoRecording() {
    if (!this.data.cameraContext) return;
    this.data.cameraContext.startRecord({
      timeoutCallback: () => {
        // 超时自动停止
        this.stopRecording();
      },
      success: () => {
        console.log('视频录制开始');
      },
      fail: (err) => {
        console.error('视频录制失败', err);
        wx.showToast({ title: '视频录制失败', icon: 'none' });
      },
    });
  },

  // 停止录制
  stopRecording() {
    const { currentMode, recorderManager, cameraContext } = this.data;

    this.clearTimer();

    // 停止音频
    if (currentMode === 'audio' || currentMode === 'combined') {
      recorderManager.stop();
    }

    // 停止视频
    if ((currentMode === 'video' || currentMode === 'combined') && cameraContext) {
      cameraContext.stopRecord({
        success: (res) => {
          console.log('视频录制完成', res);
          this._videoFilePath = res.tempVideoPath;
          this._videoPoster = res.tempThumbPath;
          if (currentMode === 'video') {
            this.analyzeRecording();
          }
          // combined 模式在两者都完成后分析
          if (currentMode === 'combined' && this._audioFilePath) {
            this.analyzeRecording();
          }
        },
      });
    }

    if (currentMode === 'audio') {
      // 音频模式在 onStop 回调中触发分析
    }

    this.setData({ isRecording: false });
  },

  // 取消录制
  cancelRecording() {
    const { currentMode, recorderManager, cameraContext } = this.data;

    this.clearTimer();

    if (currentMode === 'audio' || currentMode === 'combined') {
      recorderManager.stop();
    }
    if ((currentMode === 'video' || currentMode === 'combined') && cameraContext) {
      cameraContext.stopRecord({
        success: () => {}, // 丢弃视频
      });
    }

    this.resetRecordingState();
  },

  // 分析录制内容
  analyzeRecording() {
    this.setData({ isAnalyzing: true, analyzeProgress: '正在上传视频...' });

    const { currentMode } = this.data;

    // 视频模式或综合模式：上传视频到后端分析
    if ((currentMode === 'video' || currentMode === 'combined') && this._videoFilePath) {
      this.setData({ analyzeProgress: '正在压缩视频...' });
      videoService.compressVideo(this._videoFilePath).then((compressedPath) => {
        this.setData({ analyzeProgress: '正在上传视频...' });
        return videoService.analyzeVideo(compressedPath, {
          songId: this.data.selectedSong.id || '',
        });
      }).then((result) => {
        this.setData({ isAnalyzing: false });
        if (result && result.success) {
          // 将分析结果通过全局变量传递给报告页
          const app = getApp();
          app.globalData.lastAnalysisResult = result.data;
          wx.navigateTo({
            url: `/pages/report/report?source=analysis`,
          });
        } else {
          wx.showToast({ title: result.error || '分析失败', icon: 'none' });
          this.resetRecordingState();
        }
      }).catch((err) => {
        console.error('分析失败', err);
        this.setData({ isAnalyzing: false });
        wx.showToast({ title: '分析失败，请重试', icon: 'none' });
        this.resetRecordingState();
      });
      return;
    }

    // 纯音频模式：暂时使用模拟数据
    this.simulateAnalysis({});
  },

  // 模拟 AI 分析流程（框架占位，后续替换为真实调用）
  simulateAnalysis(analysisData) {
    const steps = [
      { text: '正在上传文件...', delay: 800 },
      { text: '正在识别手部动作...', delay: 1200 },
      { text: '正在分析音频特征...', delay: 1000 },
      { text: '正在生成指导建议...', delay: 1500 },
    ];

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= steps.length) {
        // 分析完成，跳转到报告页
        this.setData({ isAnalyzing: false });
        // TODO: 传递真实分析结果 ID
        wx.navigateTo({
          url: `/pages/report/report?id=mock_${Date.now()}`,
        });
        return;
      }
      this.setData({ analyzeProgress: steps[stepIndex].text });
      setTimeout(() => {
        stepIndex++;
        runStep();
      }, steps[stepIndex].delay);
    };
    runStep();
  },

  // ===== 工具方法 =====

  startTimer() {
    this._startTime = Date.now();
    this._timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._startTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      this.setData({
        recordingSeconds: elapsed,
        formatTime: `${minutes}:${seconds}`,
      });
    }, 1000);
  },

  clearTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  resetRecordingState() {
    this.setData({
      isRecording: false,
      isAnalyzing: false,
      recordingSeconds: 0,
      formatTime: '00:00',
      handPoints: [],
    });
    this._audioFilePath = null;
    this._videoFilePath = null;
  },
});
