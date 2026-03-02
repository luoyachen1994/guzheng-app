// scorePackage/pages/score/score.js
const SCORE = require('../../data/meihua_sannong')

// 把所有小节展平，同时记录 sectionName
function flattenMeasures(sections) {
  const result = []
  sections.forEach(section => {
    section.measures.forEach((measure, i) => {
      result.push({
        ...measure,
        sectionName: i === 0 ? section.name : '',
        sectionStart: i === 0,
      })
    })
  })
  return result
}

// 音符音高显示文字（简谱）
function pitchDisplay(pitch) {
  if (!pitch || pitch === '0') return '0'
  // h前缀=高八度，l后缀=低八度（兼容两种写法）
  const p = pitch.replace('h', '').replace('l', '').replace('L', '')
  return p
}

// 判断高低八度
function getOctave(pitch) {
  if (!pitch) return 0
  if (pitch.startsWith('h')) return 1   // 高八度
  if (pitch.endsWith('l') || pitch.endsWith('L')) return -1  // 低八度
  return 0
}

// 格式化时间 mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

Page({
  data: {
    score: null,
    measures: [],       // 展平后的小节列表（含 sectionName）
    currentMeasure: -1, // 当前高亮小节索引
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    progress: 0,        // 0~100
    speed: 1,
    speeds: [0.75, 1, 1.25],
    isLooping: false,
    audioReady: false,
    scrollIntoView: '',  // 用于 scroll-into-view
  },

  audioCtx: null,
  syncTimer: null,
  measureDuration: 0,   // 单小节毫秒数

  onLoad() {
    const measures = flattenMeasures(SCORE.sections)
    // 计算每个小节的开始时间（秒）
    const beatDuration = 60 / SCORE.bpm  // 一拍多少秒
    const measureBeats = SCORE.timeSignature[0]
    this.measureDuration = beatDuration * measureBeats  // 一小节多少秒

    // 预处理每个音符的显示信息
    const processedMeasures = measures.map((m, idx) => ({
      ...m,
      idx,
      startTime: idx * this.measureDuration,
      notes: m.notes.map(n => ({
        ...n,
        display: pitchDisplay(n.pitch),
        octave: getOctave(n.pitch),
        isDot: n.duration % 1 === 0.5,
        // 宽度比例：八分音符=1份，四分=2份，二分=4份，全音符=8份
        widthUnit: Math.round(n.duration * 2),
      }))
    }))

    this.setData({
      score: SCORE,
      measures: processedMeasures,
    })

    this._initAudio()
  },

  onUnload() {
    this._clearSyncTimer()
    if (this.audioCtx) {
      this.audioCtx.destroy()
      this.audioCtx = null
    }
  },

  onHide() {
    if (this.data.isPlaying) {
      this.audioCtx && this.audioCtx.pause()
      this._clearSyncTimer()
      this.setData({ isPlaying: false, isPaused: true })
    }
  },

  _initAudio() {
    this.audioCtx = wx.createInnerAudioContext()
    this.audioCtx.src = SCORE.audioSrc
    this.audioCtx.playbackRate = this.data.speed
    this.audioCtx.loop = this.data.isLooping

    this.audioCtx.onCanplay(() => {
      this.setData({ audioReady: true })
    })

    this.audioCtx.onPlay(() => {
      this.setData({ isPlaying: true, isPaused: false })
      this._startSyncTimer()
    })

    this.audioCtx.onPause(() => {
      this.setData({ isPlaying: false, isPaused: true })
      this._clearSyncTimer()
    })

    this.audioCtx.onStop(() => {
      this.setData({ isPlaying: false, isPaused: false, currentTime: 0, progress: 0, currentMeasure: -1 })
      this._clearSyncTimer()
    })

    this.audioCtx.onEnded(() => {
      this.setData({ isPlaying: false, isPaused: false, currentTime: 0, progress: 0, currentMeasure: -1 })
      this._clearSyncTimer()
    })

    this.audioCtx.onError((err) => {
      console.error('音频错误:', err)
      // 音频文件不存在时给出提示
      wx.showModal({
        title: '音频文件未找到',
        content: '请将《梅花三弄》MP3文件放入\nscorePackage/audio/meihua_sannong.mp3',
        showCancel: false,
      })
    })

    this.audioCtx.onTimeUpdate(() => {
      this._syncProgress()
    })

    this.audioCtx.onDurationChange(() => {
      const duration = this.audioCtx.duration || 0
      this.setData({ duration, durationText: formatTime(duration) })
    })
  },

  _startSyncTimer() {
    this._clearSyncTimer()
    this.syncTimer = setInterval(() => {
      this._syncProgress()
    }, 150)
  },

  _clearSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  },

  _syncProgress() {
    if (!this.audioCtx) return
    const currentTime = this.audioCtx.currentTime || 0
    const duration = this.audioCtx.duration || 0

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    // 计算当前小节
    const currentMeasure = Math.floor(currentTime / this.measureDuration)
    const clamped = Math.max(0, Math.min(currentMeasure, this.data.measures.length - 1))

    const updates = {
      currentTime,
      duration,
      progress,
      formatTime: formatTime(currentTime),
    }

    if (clamped !== this.data.currentMeasure) {
      updates.currentMeasure = clamped
      updates.scrollIntoView = `measure-${clamped}`
    }

    this.setData(updates)
  },

  // 播放/暂停
  togglePlay() {
    if (!this.data.audioReady) {
      wx.showToast({ title: '音频加载中...', icon: 'none' })
      return
    }
    if (this.data.isPlaying) {
      this.audioCtx.pause()
    } else {
      this.audioCtx.play()
    }
  },

  // 停止
  stopPlay() {
    if (this.audioCtx) {
      this.audioCtx.stop()
    }
  },

  // 切换循环
  toggleLoop() {
    const isLooping = !this.data.isLooping
    this.setData({ isLooping })
    if (this.audioCtx) this.audioCtx.loop = isLooping
  },

  // 切换速度
  selectSpeed(e) {
    const speed = parseFloat(e.currentTarget.dataset.speed)
    this.setData({ speed })
    if (this.audioCtx) this.audioCtx.playbackRate = speed
  },

  // 进度条拖拽
  onProgressChange(e) {
    const progress = e.detail.value
    if (!this.audioCtx || !this.data.duration) return
    const seekTime = (progress / 100) * this.data.duration
    this.audioCtx.seek(seekTime)
    this.setData({ progress, currentTime: seekTime })
  },

  // 点击小节跳转
  seekToMeasure(e) {
    const idx = e.currentTarget.dataset.idx
    if (!this.audioCtx) return
    const seekTime = idx * this.measureDuration
    this.audioCtx.seek(seekTime)
    this.setData({ currentMeasure: idx, currentTime: seekTime })
    if (!this.data.isPlaying) {
      this.audioCtx.play()
    }
  },
})
