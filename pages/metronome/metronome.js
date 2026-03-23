// pages/metronome/metronome.js

// 节拍器核心类
class Metronome {
  constructor(options = {}) {
    this.bpm = options.bpm || 96
    this.isRunning = false
    this.startTime = 0
    this.beatCount = 0
    this.timeSignature = options.timeSignature || [4, 4]
    this.currentBeat = 0
    this.onBeat = options.onBeat || (() => {})
    this.timerId = null
  }

  start() {
    if (this.isRunning) return
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
    const interval = 60000 / this.bpm
    const expectedTime = this.startTime + this.beatCount * interval

    // 计算当前拍
    this.currentBeat = ((this.currentBeat) % this.timeSignature[0]) + 1

    // 判断是否为强拍
    const isStrong = this.isStrongBeat(this.currentBeat)

    // 触发回调
    this.onBeat(this.currentBeat, isStrong)

    // 计算时间偏差并补偿
    const actualTime = Date.now()
    const drift = actualTime - expectedTime
    const nextDelay = Math.max(0, interval - drift)

    // 设置下一拍
    this.timerId = setTimeout(() => this.tick(), nextDelay)
  }

  stop() {
    this.isRunning = false
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.currentBeat = 0
  }

  setBPM(bpm) {
    this.bpm = Math.max(30, Math.min(240, bpm))
    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }

  setTimeSignature(beatsPerMeasure, noteValue) {
    this.timeSignature = [beatsPerMeasure, noteValue]
    this.currentBeat = 0
  }

  isStrongBeat(beatNumber) {
    const [beatsPerMeasure] = this.timeSignature

    // 第一拍总是强拍
    if (beatNumber === 1) return true

    // 6/8 和 9/8 拍的次强拍
    if (beatsPerMeasure === 6 && beatNumber === 4) return true
    if (beatsPerMeasure === 9 && (beatNumber === 4 || beatNumber === 7)) return true

    return false
  }
}

Page({
  data: {
    // 速度相关
    bpm: 96,

    // 震动开关
    vibrationEnabled: true,

    // 预设相关
    presetTab: 'music',
    musicPresets: [
      { term: 'Grave', name: '庄板', bpm: 40 },
      { term: 'Largo', name: '广板', bpm: 50 },
      { term: 'Adagio', name: '柔板', bpm: 60 },
      { term: 'Andante', name: '行板', bpm: 76 },
      { term: 'Moderato', name: '中板', bpm: 96 },
      { term: 'Allegretto', name: '小快板', bpm: 112 },
      { term: 'Allegro', name: '快板', bpm: 132 },
      { term: 'Presto', name: '急板', bpm: 168 },
    ],
    practicePresets: [
      { name: '初学', bpm: 60, desc: '初次接触' },
      { name: '熟悉', bpm: 80, desc: '掌握指法' },
      { name: '熟练', bpm: 100, desc: '完整演奏' },
      { name: '演奏', bpm: 120, desc: '接近原速' },
    ],

    // 节拍类型
    timeSignature: [4, 4],
    timeSignatures: [
      [2, 4],
      [3, 4],
      [4, 4],
      [3, 8],
      [6, 8],
      [9, 8],
    ],

    // 音效类型
    soundType: 'wooden', // wooden, guzheng, electronic

    // 视觉模式
    visualMode: 'blocks', // blocks, pendulum

    // 方块状态
    beatBlocks: [],

    // 摆锤样式
    pendulumStyle: '',

    // 播放状态
    isPlaying: false,
  },

  metronome: null,
  audioCtx: null,
  // 音频合成器
  audioSynthesizer: null,

  onLoad() {
    // 初始化节拍器
    this.metronome = new Metronome({
      bpm: this.data.bpm,
      timeSignature: this.data.timeSignature,
      onBeat: (beatNumber, isStrong) => {
        this.onMetronomeBeat(beatNumber, isStrong)
      }
    })

    // 初始化音频上下文
    this.audioCtx = wx.createInnerAudioContext()
    this.audioCtx.obeyMuteSwitch = false

    // 初始化音频合成器
    this.initAudioSynthesizer()

    // 加载用户配置
    this.loadConfig()

    // 初始化视觉元素
    this.initBeatBlocks()
    this.updatePendulumStyle()
  },

  onShow() {
    // 设置音频选项（后台播放）
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      speakerOn: true
    })
  },

  // 初始化音频合成器（使用简单的音频合成方案）
  initAudioSynthesizer() {
    // 创建不同音效的音频上下文
    this.audioSynthesizer = {
      // 木鱼音效
      wooden: {
        strong: this.createBeepSound(600, 0.08),  // 低音 600Hz
        weak: this.createBeepSound(1200, 0.05)    // 高音 1200Hz
      },
      // 古筝音效（模拟）
      guzheng: {
        strong: this.createBeepSound(523, 0.1),   // C5
        weak: this.createBeepSound(523, 0.06)     // C5 弱
      },
      // 电子音效
      electronic: {
        strong: this.createBeepSound(880, 0.08),  // A5
        weak: this.createBeepSound(1760, 0.05)    // A6
      }
    }
  },

  // 创建简单的哔哔声（Base64编码的WAV文件）
  createBeepSound(frequency, duration) {
    // 由于小程序不支持Web Audio API，我们返回一个播放策略
    return {
      frequency: frequency,
      duration: duration
    }
  },

  onHide() {
    // 页面隐藏时停止播放（可选：如果希望后台继续则注释掉）
    // this.stopMetronome()
  },

  onUnload() {
    // 清理资源
    this.stopMetronome()
    if (this.audioCtx) {
      this.audioCtx.destroy()
    }
  },

  // ===== 预设速度 =====
  switchPresetTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ presetTab: tab })
  },

  selectPreset(e) {
    const bpm = parseInt(e.currentTarget.dataset.bpm)
    this.setBPM(bpm)

    // 播放预览音
    this.playBeat(true)
  },

  // ===== 速度控制 =====
  adjustBPM(e) {
    const value = parseInt(e.currentTarget.dataset.value)
    const newBPM = Math.max(30, Math.min(240, this.data.bpm + value))
    this.setBPM(newBPM)

    // 播放预览音
    this.playBeat(true)
  },

  onSliderChange(e) {
    const bpm = e.detail.value
    this.setBPM(bpm)
  },

  onSliderChanging(e) {
    // 实时更新显示，但不触发节拍器重启
    this.setData({ bpm: e.detail.value })
  },

  setBPM(bpm) {
    this.setData({ bpm })
    this.metronome.setBPM(bpm)
    this.updatePendulumStyle()
    this.saveConfig()
  },

  // ===== 节拍类型 =====
  selectTimeSignature(e) {
    const index = e.currentTarget.dataset.index
    const timeSignature = this.data.timeSignatures[index]
    this.setData({ timeSignature })
    this.metronome.setTimeSignature(timeSignature[0], timeSignature[1])
    this.initBeatBlocks()
    this.saveConfig()
  },

  // ===== 音效切换 =====
  toggleSoundType() {
    const types = ['wooden', 'guzheng', 'electronic']
    const currentIndex = types.indexOf(this.data.soundType)
    const nextIndex = (currentIndex + 1) % types.length
    const soundType = types[nextIndex]

    this.setData({ soundType })

    // 播放预览音
    this.playBeat(true)

    this.saveConfig()
  },

  toggleVibration() {
    this.setData({
      vibrationEnabled: !this.data.vibrationEnabled
    })

    // 测试震动反馈
    if (this.data.vibrationEnabled) {
      wx.vibrateShort({ type: 'medium' })
    }

    this.saveConfig()
  },

  // ===== 视觉模式 =====
  toggleVisualMode() {
    const visualMode = this.data.visualMode === 'blocks' ? 'pendulum' : 'blocks'
    this.setData({ visualMode })
    this.saveConfig()
  },

  initBeatBlocks() {
    const count = this.data.timeSignature[0]
    const blocks = Array.from({ length: count }, () => ({
      active: false,
      strong: false
    }))
    this.setData({ beatBlocks: blocks })
  },

  updateBeatBlocks(beatNumber, isStrong) {
    const blocks = this.data.beatBlocks.map((block, index) => ({
      active: index === beatNumber - 1,
      strong: (index === beatNumber - 1) && isStrong
    }))
    this.setData({ beatBlocks: blocks })
  },

  updatePendulumStyle() {
    const duration = (60 / this.data.bpm) * 2 // 完整摆动周期 = 2拍
    this.setData({
      pendulumStyle: `--swing-duration: ${duration}s`
    })
  },

  // ===== 播放控制 =====
  togglePlay() {
    if (this.data.isPlaying) {
      this.stopMetronome()
    } else {
      this.startMetronome()
    }
  },

  startMetronome() {
    this.setData({ isPlaying: true })
    this.metronome.start()
  },

  stopMetronome() {
    this.setData({ isPlaying: false })
    this.metronome.stop()

    // 重置视觉指示器
    this.initBeatBlocks()
  },

  // ===== 节拍回调 =====
  onMetronomeBeat(beatNumber, isStrong) {
    // 播放音效
    this.playBeat(isStrong)

    // 触觉反馈
    if (this.data.vibrationEnabled) {
      wx.vibrateShort({
        type: isStrong ? 'heavy' : 'light'
      })
    }

    // 更新视觉指示器
    if (this.data.visualMode === 'blocks') {
      this.updateBeatBlocks(beatNumber, isStrong)
    }
  },

  // ===== 音频播放 =====
  playBeat(isStrong) {
    const { soundType } = this.data
    const beatType = isStrong ? 'strong' : 'weak'

    // 播放音频文件
    try {
      const src = `/assets/sounds/metronome/${soundType}/${beatType}.wav`
      this.audioCtx.src = src
      this.audioCtx.play().catch((e) => {
        console.log('音频播放失败:', e)
      })
    } catch (e) {
      console.log('音效播放异常', e)
    }
  },

  // ===== 数据持久化 =====
  loadConfig() {
    try {
      // 一次性迁移：检查旧的 metronome_prefs 数据
      const oldPrefs = wx.getStorageSync('metronome_prefs')
      if (oldPrefs) {
        // 迁移到新的存储键
        wx.setStorageSync('metronome_config', {
          bpm: oldPrefs.bpm || 96,
          timeSignature: oldPrefs.timeSignature || [4, 4],
          soundType: oldPrefs.soundType || 'wooden',
          visualMode: oldPrefs.visualMode || 'blocks',
          vibrationEnabled: oldPrefs.vibrationEnabled !== undefined ? oldPrefs.vibrationEnabled : true,
          timestamp: Date.now()
        })
        // 删除旧数据
        wx.removeStorageSync('metronome_prefs')
      }

      // 加载配置
      const config = wx.getStorageSync('metronome_config')
      if (config) {
        this.setData({
          bpm: config.bpm || 96,
          timeSignature: config.timeSignature || [4, 4],
          soundType: config.soundType || 'wooden',
          visualMode: config.visualMode || 'blocks',
          vibrationEnabled: config.vibrationEnabled !== undefined ? config.vibrationEnabled : true
        })
        this.metronome.setBPM(this.data.bpm)
        this.metronome.setTimeSignature(this.data.timeSignature[0], this.data.timeSignature[1])
        this.initBeatBlocks()
        this.updatePendulumStyle()

        // 显示恢复提示
        wx.showToast({
          title: '已恢复上次设置',
          icon: 'none',
          duration: 2000
        })
      }
    } catch (e) {
      console.error('加载配置失败', e)
    }
  },

  saveConfig() {
    try {
      wx.setStorageSync('metronome_config', {
        bpm: this.data.bpm,
        timeSignature: this.data.timeSignature,
        soundType: this.data.soundType,
        visualMode: this.data.visualMode,
        vibrationEnabled: this.data.vibrationEnabled,
        timestamp: Date.now()
      })
    } catch (e) {
      console.error('保存配置失败', e)
    }
  }
})
