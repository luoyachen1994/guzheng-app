// pages/report/report.js
Page({
  data: {
    reportId: '',
    report: {},
  },

  onLoad(options) {
    if (options.source === 'analysis') {
      // 从练习页跳转，读取全局分析结果
      const app = getApp();
      const result = app.globalData.lastAnalysisResult;
      if (result) {
        this.setData({ report: this.formatAnalysisResult(result) });
        app.globalData.lastAnalysisResult = null; // 用完清除
        return;
      }
    }
    if (options.id) {
      this.setData({ reportId: options.id });
      this.loadReport(options.id);
    }
  },

  // 将后端返回的分析结果转换为报告页展示格式
  formatAnalysisResult(data) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 评级
    let level = '需加强';
    if (data.overallScore >= 90) level = '优秀';
    else if (data.overallScore >= 80) level = '良好';
    else if (data.overallScore >= 60) level = '中等';

    // 分离手型问题和音频问题
    const handIssues = [];
    const audioIssues = [];
    (data.issues || []).forEach((issue) => {
      const title = issue.title || '';
      if (title.includes('手') || title.includes('指') || title.includes('检测率')) {
        handIssues.push(issue);
      } else {
        audioIssues.push(issue);
      }
    });

    // 生成建议
    const advice = [];
    if (data.pitchAccuracy < 80) {
      advice.push('建议搭配调音器进行逐音练习，注意左手按弦力度的控制。');
    }
    if (data.rhythmAccuracy < 80) {
      advice.push('建议使用节拍器从慢速开始练习，逐步提速，确保每个音符时值准确。');
    }
    if (data.dynamics < 70) {
      advice.push('注意乐句的强弱变化，练习渐强渐弱的控制，增强音乐表现力。');
    }
    if (data.handScore < 70) {
      advice.push('对着镜子慢速练习基本指法，注意手指自然弯曲，保持放松状态。');
    }
    if (advice.length === 0) {
      advice.push('整体表现不错，继续保持！可以尝试更高难度的曲目挑战自己。');
    }

    return {
      totalScore: data.overallScore || 0,
      level: level,
      date: dateStr,
      dimensions: [
        { name: '手型姿势', score: data.handScore || 0 },
        { name: '音准', score: data.pitchAccuracy || 0 },
        { name: '节奏', score: data.rhythmAccuracy || 0 },
        { name: '力度控制', score: data.dynamics || 0 },
      ],
      handAnalysis: {
        issues: handIssues,
      },
      audioAnalysis: {
        issues: audioIssues,
      },
      advice: advice,
    };
  },

  // 从后端加载历史报告
  loadReport(id) {
    // 使用模拟数据作为兜底
    const mockReport = this.getMockReport();
    this.setData({ report: mockReport });
  },

  getMockReport() {
    return {
      totalScore: 0,
      level: '等待分析',
      date: '',
      dimensions: [],
      handAnalysis: { issues: [] },
      audioAnalysis: { issues: [] },
      advice: ['请先录制或上传一段练习视频进行分析。'],
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
