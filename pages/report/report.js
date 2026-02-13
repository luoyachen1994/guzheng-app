// pages/report/report.js
Page({
  data: {
    reportId: '',
    report: {},
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ reportId: options.id });
      this.loadReport(options.id);
    }
  },

  // 加载报告数据
  loadReport(id) {
    // TODO: 从后端加载真实报告
    // 使用模拟数据展示框架
    const mockReport = this.getMockReport();
    this.setData({ report: mockReport });
  },

  // 模拟数据（后续替换为真实 API 调用）
  getMockReport() {
    return {
      totalScore: 78,
      level: '良好',
      date: '2026-02-13 14:30',
      dimensions: [
        { name: '手型姿势', score: 72 },
        { name: '音准', score: 85 },
        { name: '节奏', score: 80 },
        { name: '力度控制', score: 68 },
        { name: '流畅度', score: 82 },
      ],
      handAnalysis: {
        issues: [
          {
            severity: 'warning',
            title: '右手大指角度偏大',
            description: '录像分析显示您的右手大指（拇指）在托弦时角度偏大约15°，可能导致音色偏硬。',
            suggestion: '练习时注意大指自然弯曲，指尖触弦，保持约45°角。可以对着镜子慢速练习基本指法。',
          },
          {
            severity: 'info',
            title: '左手按弦位置可优化',
            description: '部分按音时左手位置略偏向琴码方向，影响按音的音准稳定性。',
            suggestion: '左手按弦点应在琴码左侧约15cm处，注意用指肚按压，保持手腕放松。',
          },
        ],
      },
      audioAnalysis: {
        issues: [
          {
            severity: 'warning',
            title: '第3-5小节音准偏低',
            description: '在第3至第5小节的按音段落中，音高整体偏低约20音分（cents），可能是按弦力度不足。',
            suggestion: '加强左手按弦力度练习，按弦时手指要到位，可以借助调音器进行校准练习。',
          },
          {
            severity: 'info',
            title: '节奏整体稳定',
            description: '节奏准确度较高，但在快速段落（第8-10小节）有轻微赶拍现象。',
            suggestion: '快速段落建议先用慢速练习，搭配节拍器逐步加速，确保每个音符时值准确。',
          },
        ],
      },
      advice: [
        '建议本周重点练习右手基本指法（托、勾、抹），每天15分钟，注意手型保持。',
        '左手按音练习搭配调音器进行，每个按音保持3秒确认音准后再进行下一个。',
        '快速段落用节拍器从60BPM开始，每次提速5BPM，直到达到目标速度。',
        '每次练习前做5分钟手指拉伸热身，避免肌肉紧张影响手型。',
      ],
    };
  },

  // 分享报告
  sharReport() {
    wx.showToast({ title: '分享功能开发中', icon: 'none' });
  },

  // 再练一次
  practiceAgain() {
    wx.navigateTo({
      url: '/pages/practice/practice?mode=combined',
    });
  },

  onShareAppMessage() {
    return {
      title: `古筝练习报告 - ${this.data.report.totalScore}分`,
      path: `/pages/report/report?id=${this.data.reportId}`,
    };
  },
});
