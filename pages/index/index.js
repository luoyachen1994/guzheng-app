// pages/index/index.js
const app = getApp();

Page({
  data: {
    greeting: '',
    userInfo: {},
    todayMinutes: 0,
    consecutiveDays: 0,
    totalSessions: 0,
    recentSessions: [],
  },

  onLoad() {
    this.setGreeting();
  },

  onShow() {
    this.loadUserInfo();
    this.loadStats();
    this.loadRecentSessions();
  },

  // 根据时间设置问候语
  setGreeting() {
    const hour = new Date().getHours();
    let greeting = '晚上好';
    if (hour < 6) greeting = '夜深了';
    else if (hour < 12) greeting = '早上好';
    else if (hour < 14) greeting = '中午好';
    else if (hour < 18) greeting = '下午好';
    this.setData({ greeting });
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    this.setData({ userInfo });
  },

  // 加载练习统计
  loadStats() {
    // TODO: 从后端或本地存储加载
    const stats = wx.getStorageSync('practiceStats') || {};
    this.setData({
      todayMinutes: stats.todayMinutes || 0,
      consecutiveDays: stats.consecutiveDays || 0,
      totalSessions: stats.totalSessions || 0,
    });
  },

  // 加载最近练习记录
  loadRecentSessions() {
    // TODO: 从后端或本地存储加载
    const sessions = wx.getStorageSync('recentSessions') || [];
    this.setData({
      recentSessions: sessions.slice(0, 5),
    });
  },

  // 跳转到练习页
  goToPractice(e) {
    const mode = e.currentTarget.dataset.mode;
    wx.navigateTo({
      url: `/pages/practice/practice?mode=${mode}`,
    });
  },

  // 跳转到曲谱库（后续开发）
  goToLibrary() {
    wx.showToast({
      title: '曲谱库开发中',
      icon: 'none',
    });
  },

  // 跳转到练习报告
  goToReport(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/report/report?id=${id}`,
    });
  },

  onShareAppMessage() {
    return {
      title: '古筝学习助手 - AI智能指导',
      path: '/pages/index/index',
    };
  },
});
