// pages/audio/audio.js
Page({
  data: {
    audioLoaded: false,
    isPlaying: false,
    currentPosition: 0,
    audioInfo: {
      name: '',
      duration: 0,
      durationText: '00:00',
    },
    analysisResult: null,
  },

  _innerAudioContext: null,

  onLoad(options) {
    if (options.filePath) {
      this.loadAudio(options.filePath);
    }
  },

  onUnload() {
    if (this._innerAudioContext) {
      this._innerAudioContext.destroy();
    }
  },

  // 从文件导入
  importFromFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['mp3', 'wav', 'aac', 'm4a'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.loadAudio(file.path, file.name);
      },
    });
  },

  // 从最近录音导入
  importFromRecent() {
    // TODO: 展示最近录音列表
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 加载音频
  loadAudio(filePath, name) {
    const ctx = wx.createInnerAudioContext();
    ctx.src = filePath;

    ctx.onCanplay(() => {
      const duration = Math.floor(ctx.duration);
      const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
      const seconds = (duration % 60).toString().padStart(2, '0');
      this.setData({
        audioLoaded: true,
        audioInfo: {
          name: name || '录音文件',
          duration: duration,
          durationText: `${minutes}:${seconds}`,
        },
      });
    });

    ctx.onTimeUpdate(() => {
      this.setData({ currentPosition: Math.floor(ctx.currentTime) });
    });

    ctx.onEnded(() => {
      this.setData({ isPlaying: false, currentPosition: 0 });
    });

    this._innerAudioContext = ctx;
  },

  // 播放/暂停
  togglePlay() {
    if (!this._innerAudioContext) return;
    if (this.data.isPlaying) {
      this._innerAudioContext.pause();
    } else {
      this._innerAudioContext.play();
    }
    this.setData({ isPlaying: !this.data.isPlaying });
  },

  // 快退
  rewind() {
    if (!this._innerAudioContext) return;
    const newPos = Math.max(0, this._innerAudioContext.currentTime - 5);
    this._innerAudioContext.seek(newPos);
  },

  // 快进
  forward() {
    if (!this._innerAudioContext) return;
    const newPos = Math.min(
      this.data.audioInfo.duration,
      this._innerAudioContext.currentTime + 5
    );
    this._innerAudioContext.seek(newPos);
  },

  // 拖动进度
  onSeek(e) {
    if (!this._innerAudioContext) return;
    this._innerAudioContext.seek(e.detail.value);
  },

  // 查看完整报告
  viewFullReport() {
    // TODO: 传递分析结果 ID
    wx.navigateTo({ url: '/pages/report/report?id=audio_mock' });
  },

  // 跳转到练习页录音
  goToPractice() {
    wx.navigateTo({ url: '/pages/practice/practice?mode=audio' });
  },
});
