// pages/tuner/tuner.js
// 古筝调音器 - 使用自相关算法检测音高

// 古筝21弦标准调音（D调，最常用）
// 从低到高：D2-D6
const GUZHENG_STRINGS = {
  D: [
    { string: 1,  note: 'D2',  freq: 73.42,  name: '1(低)', solmization: '1' },
    { string: 2,  note: 'E2',  freq: 82.41,  name: '2(低)', solmization: '2' },
    { string: 3,  note: 'F#2', freq: 92.50,  name: '3(低)', solmization: '3' },
    { string: 4,  note: 'A2',  freq: 110.00, name: '5(低)', solmization: '5' },
    { string: 5,  note: 'B2',  freq: 123.47, name: '6(低)', solmization: '6' },
    { string: 6,  note: 'D3',  freq: 146.83, name: '1',     solmization: '1' },
    { string: 7,  note: 'E3',  freq: 164.81, name: '2',     solmization: '2' },
    { string: 8,  note: 'F#3', freq: 185.00, name: '3',     solmization: '3' },
    { string: 9,  note: 'A3',  freq: 220.00, name: '5',     solmization: '5' },
    { string: 10, note: 'B3',  freq: 246.94, name: '6',     solmization: '6' },
    { string: 11, note: 'D4',  freq: 293.66, name: '1(中)', solmization: '1' },
    { string: 12, note: 'E4',  freq: 329.63, name: '2(中)', solmization: '2' },
    { string: 13, note: 'F#4', freq: 369.99, name: '3(中)', solmization: '3' },
    { string: 14, note: 'A4',  freq: 440.00, name: '5(中)', solmization: '5' },
    { string: 15, note: 'B4',  freq: 493.88, name: '6(中)', solmization: '6' },
    { string: 16, note: 'D5',  freq: 587.33, name: '1(高)', solmization: '1' },
    { string: 17, note: 'E5',  freq: 659.25, name: '2(高)', solmization: '2' },
    { string: 18, note: 'F#5', freq: 739.99, name: '3(高)', solmization: '3' },
    { string: 19, note: 'A5',  freq: 880.00, name: '5(高)', solmization: '5' },
    { string: 20, note: 'B5',  freq: 987.77, name: '6(高)', solmization: '6' },
    { string: 21, note: 'D6',  freq: 1174.66, name: '1(超高)', solmization: '1' },
  ],
  G: [
    { string: 1,  note: 'G2',  freq: 98.00,  name: '1(低)', solmization: '1' },
    { string: 2,  note: 'A2',  freq: 110.00, name: '2(低)', solmization: '2' },
    { string: 3,  note: 'B2',  freq: 123.47, name: '3(低)', solmization: '3' },
    { string: 4,  note: 'D3',  freq: 146.83, name: '5(低)', solmization: '5' },
    { string: 5,  note: 'E3',  freq: 164.81, name: '6(低)', solmization: '6' },
    { string: 6,  note: 'G3',  freq: 196.00, name: '1',     solmization: '1' },
    { string: 7,  note: 'A3',  freq: 220.00, name: '2',     solmization: '2' },
    { string: 8,  note: 'B3',  freq: 246.94, name: '3',     solmization: '3' },
    { string: 9,  note: 'D4',  freq: 293.66, name: '5',     solmization: '5' },
    { string: 10, note: 'E4',  freq: 329.63, name: '6',     solmization: '6' },
    { string: 11, note: 'G4',  freq: 392.00, name: '1(中)', solmization: '1' },
    { string: 12, note: 'A4',  freq: 440.00, name: '2(中)', solmization: '2' },
    { string: 13, note: 'B4',  freq: 493.88, name: '3(中)', solmization: '3' },
    { string: 14, note: 'D5',  freq: 587.33, name: '5(中)', solmization: '5' },
    { string: 15, note: 'E5',  freq: 659.25, name: '6(中)', solmization: '6' },
    { string: 16, note: 'G5',  freq: 783.99, name: '1(高)', solmization: '1' },
    { string: 17, note: 'A5',  freq: 880.00, name: '2(高)', solmization: '2' },
    { string: 18, note: 'B5',  freq: 987.77, name: '3(高)', solmization: '3' },
    { string: 19, note: 'D6',  freq: 1174.66, name: '5(高)', solmization: '5' },
    { string: 20, note: 'E6',  freq: 1318.51, name: '6(高)', solmization: '6' },
    { string: 21, note: 'G6',  freq: 1567.98, name: '1(超高)', solmization: '1' },
  ],
  C: [
    { string: 1,  note: 'C2',  freq: 65.41,  name: '1(低)', solmization: '1' },
    { string: 2,  note: 'D2',  freq: 73.42,  name: '2(低)', solmization: '2' },
    { string: 3,  note: 'E2',  freq: 82.41,  name: '3(低)', solmization: '3' },
    { string: 4,  note: 'G2',  freq: 98.00,  name: '5(低)', solmization: '5' },
    { string: 5,  note: 'A2',  freq: 110.00, name: '6(低)', solmization: '6' },
    { string: 6,  note: 'C3',  freq: 130.81, name: '1',     solmization: '1' },
    { string: 7,  note: 'D3',  freq: 146.83, name: '2',     solmization: '2' },
    { string: 8,  note: 'E3',  freq: 164.81, name: '3',     solmization: '3' },
    { string: 9,  note: 'G3',  freq: 196.00, name: '5',     solmization: '5' },
    { string: 10, note: 'A3',  freq: 220.00, name: '6',     solmization: '6' },
    { string: 11, note: 'C4',  freq: 261.63, name: '1(中)', solmization: '1' },
    { string: 12, note: 'D4',  freq: 293.66, name: '2(中)', solmization: '2' },
    { string: 13, note: 'E4',  freq: 329.63, name: '3(中)', solmization: '3' },
    { string: 14, note: 'G4',  freq: 392.00, name: '5(中)', solmization: '5' },
    { string: 15, note: 'A4',  freq: 440.00, name: '6(中)', solmization: '6' },
    { string: 16, note: 'C5',  freq: 523.25, name: '1(高)', solmization: '1' },
    { string: 17, note: 'D5',  freq: 587.33, name: '2(高)', solmization: '2' },
    { string: 18, note: 'E5',  freq: 659.25, name: '3(高)', solmization: '3' },
    { string: 19, note: 'G5',  freq: 783.99, name: '5(高)', solmization: '5' },
    { string: 20, note: 'A5',  freq: 880.00, name: '6(高)', solmization: '6' },
    { string: 21, note: 'C6',  freq: 1046.50, name: '1(超高)', solmization: '1' },
  ],
}

// 将频率转换为音分偏差（相对于目标频率）
function freqToCents(detected, target) {
  return 1200 * Math.log2(detected / target)
}

// 找到最近的弦
function findNearestString(freq, strings) {
  let minDiff = Infinity
  let nearest = null
  for (const s of strings) {
    const cents = Math.abs(freqToCents(freq, s.freq))
    if (cents < minDiff) {
      minDiff = cents
      nearest = { ...s, centsOff: freqToCents(freq, s.freq) }
    }
  }
  return nearest
}

// 自相关音高检测（YIN算法简化版）
function detectPitch(buffer, sampleRate) {
  const SIZE = buffer.length
  const MAX_SAMPLES = Math.floor(SIZE / 2)
  const threshold = 0.15

  // 计算差函数
  const yinBuffer = new Float32Array(MAX_SAMPLES)
  yinBuffer[0] = 1

  let runningSum = 0
  for (let tau = 1; tau < MAX_SAMPLES; tau++) {
    let sum = 0
    for (let i = 0; i < MAX_SAMPLES; i++) {
      const delta = buffer[i] - buffer[i + tau]
      sum += delta * delta
    }
    yinBuffer[tau] = sum
    runningSum += sum
    yinBuffer[tau] = yinBuffer[tau] * tau / runningSum
  }

  // 找到第一个低于阈值的谷值
  let tau = 2
  while (tau < MAX_SAMPLES) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < MAX_SAMPLES && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++
      }
      // 抛物线插值提高精度
      if (tau > 0 && tau < MAX_SAMPLES - 1) {
        const s0 = yinBuffer[tau - 1]
        const s1 = yinBuffer[tau]
        const s2 = yinBuffer[tau + 1]
        const betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0))
        return sampleRate / betterTau
      }
      return sampleRate / tau
    }
    tau++
  }
  return -1  // 未检测到
}

// 计算音量RMS
function calcRMS(buffer) {
  let sum = 0
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i]
  }
  return Math.sqrt(sum / buffer.length)
}

Page({
  data: {
    // 调式选择
    currentKey: 'D',
    keys: ['D', 'G', 'C'],

    // 当前检测到的音高
    detectedFreq: 0,
    detectedNote: '--',
    centsOff: 0,
    isInTune: false,
    hasSignal: false,

    // 最近匹配的弦
    matchedString: null,

    // 指针角度（-1 ~ +1 映射到 -90° ~ +90°）
    needleAngle: 0,

    // 调音状态
    isListening: false,

    // 21弦列表展示（当前调式）
    strings: [],

    // 参考音播放
    playingString: null,

    // 音量指示
    volume: 0,

    // 准确区间（cents）
    tunedThreshold: 8,

    // 稳定性：连续多帧在范围内才判定为准
    stableCount: 0,
    STABLE_REQUIRED: 3,

    // 触觉反馈
    lastVibrationTime: 0,
    vibrationCooldown: 300,
  },

  // 录音管理器
  recorderManager: null,
  // 定时分析器
  analyzeTimer: null,
  // 录音帧缓冲
  audioContext: null,
  sampleRate: 16000,
  frameBuffer: [],
  innerAudioContext: null,

  onLoad() {
    // 加载上次选择的调式
    const lastKey = wx.getStorageSync('tuner_last_key') || 'D'
    this.setData({
      currentKey: lastKey,
      strings: GUZHENG_STRINGS[lastKey]
    })
    this.recorderManager = wx.getRecorderManager()
    this._setupRecorder()
  },

  onUnload() {
    this._stopListening()
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
  },

  onHide() {
    this._stopListening()
  },

  // 切换调式
  selectKey(e) {
    const key = e.currentTarget.dataset.key
    if (key === this.data.currentKey) return
    const wasListening = this.data.isListening
    if (wasListening) this._stopListening()
    this.setData({
      currentKey: key,
      strings: GUZHENG_STRINGS[key],
      matchedString: null,
      detectedNote: '--',
      centsOff: 0,
      needleAngle: 0,
      hasSignal: false,
    })
    // 保存选择
    wx.setStorageSync('tuner_last_key', key)
    if (wasListening) setTimeout(() => this._startListening(), 200)
  },

  // 开始/停止调音
  toggleListening() {
    if (this.data.isListening) {
      this._stopListening()
    } else {
      this._startListening()
    }
  },

  _setupRecorder() {
    this.recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      this._analyzeFrame(frameBuffer)
    })

    this.recorderManager.onError((err) => {
      console.error('录音错误:', err)
      this._stopListening()
      wx.showToast({ title: '麦克风权限不足', icon: 'none' })
    })
  },

  _startListening() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.record'] === false) {
          wx.openSetting()
          return
        }
        this._doStartListening()
      }
    })
  },

  _doStartListening() {
    this.setData({ isListening: true, stableCount: 0 })
    // 使用帧录音模式，每帧 100ms
    this.recorderManager.start({
      duration: 600000,
      sampleRate: 16000,
      numberOfChannels: 1,
      format: 'PCM',
      frameSize: 4,
    })
  },

  _stopListening() {
    this.setData({ isListening: false, hasSignal: false, stableCount: 0 })
    try { this.recorderManager.stop() } catch (e) {}
    this.setData({
      detectedNote: '--',
      centsOff: 0,
      needleAngle: 0,
      matchedString: null,
      volume: 0,
    })
  },

  _analyzeFrame(frameBuffer) {
    // frameBuffer 是 ArrayBuffer，需转成 Float32Array
    const pcm16 = new Int16Array(frameBuffer)
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0
    }

    // 计算音量
    const rms = calcRMS(float32)
    const volumePercent = Math.min(100, Math.round(rms * 400))

    // 音量太低，忽略
    if (rms < 0.01) {
      this.setData({ hasSignal: false, volume: volumePercent, stableCount: 0 })
      return
    }

    // 检测音高
    const freq = detectPitch(float32, this.sampleRate)
    if (freq < 60 || freq > 1500) {
      this.setData({ hasSignal: false, volume: volumePercent })
      return
    }

    // 找最近的弦
    const strings = GUZHENG_STRINGS[this.data.currentKey]
    const matched = findNearestString(freq, strings)
    if (!matched) return

    // 超出 ±50 cents 就不算有效信号
    if (Math.abs(matched.centsOff) > 50) {
      this.setData({ hasSignal: false, volume: volumePercent })
      return
    }

    // 计算指针角度（±50 cents 对应 ±90°）
    const clampedCents = Math.max(-50, Math.min(50, matched.centsOff))
    const angle = clampedCents * 1.8  // 50cents = 90°

    // 判断是否准
    const isInTune = Math.abs(matched.centsOff) <= this.data.tunedThreshold

    // 稳定性计数
    let stableCount = this.data.stableCount
    if (isInTune) {
      stableCount = Math.min(stableCount + 1, this.data.STABLE_REQUIRED + 2)
    } else {
      stableCount = 0
    }

    // 触觉反馈：调准时震动
    if (isInTune && stableCount === this.data.STABLE_REQUIRED) {
      const now = Date.now()
      if (now - this.data.lastVibrationTime > this.data.vibrationCooldown) {
        wx.vibrateShort({ type: 'medium' })
        this.setData({ lastVibrationTime: now })
      }
    }

    this.setData({
      hasSignal: true,
      detectedFreq: Math.round(freq * 10) / 10,
      detectedNote: matched.note,
      centsOff: Math.round(matched.centsOff),
      needleAngle: angle,
      matchedString: matched,
      isInTune,
      volume: volumePercent,
      stableCount,
    })
  },

  // 播放参考音（标准频率正弦波，近似）
  playReference(e) {
    const idx = e.currentTarget.dataset.index
    const string = this.data.strings[idx]
    if (this.data.playingString === string.string) {
      // 再次点击停止
      if (this.innerAudioContext) {
        this.innerAudioContext.stop()
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
      this.setData({ playingString: null })
      return
    }

    // 小程序无法直接生成正弦波，改为显示标准频率提示
    // 实际项目可预录21个参考音
    wx.showToast({
      title: `${string.name}  ${string.freq}Hz`,
      icon: 'none',
      duration: 2000,
    })
    this.setData({ playingString: string.string })
    setTimeout(() => {
      this.setData({ playingString: null })
    }, 2000)
  },
})
