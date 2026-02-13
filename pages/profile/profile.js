// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    isLoggedIn: false,
    userInfo: {},
    levelText: '初学者',
    stats: {
      totalHours: 0,
      totalDays: 0,
      avgScore: 0,
      bestScore: 0,
    },
  },

  onShow() {
    this.loadUserData();
  },

  loadUserData() {
    const isLoggedIn = app.globalData.isLoggedIn;
    const userInfo = app.globalData.userInfo || {};

    // 加载练习统计
    const stats = wx.getStorageSync('userStats') || {
      totalHours: 0,
      totalDays: 0,
      avgScore: 0,
      bestScore: 0,
    };

    // 根据练习时间确定等级
    let levelText = '初学者';
    if (stats.totalHours >= 500) levelText = '大师';
    else if (stats.totalHours >= 200) levelText = '高级';
    else if (stats.totalHours >= 50) levelText = '中级';
    else if (stats.totalHours >= 10) levelText = '入门';

    this.setData({ isLoggedIn, userInfo, stats, levelText });
  },

  handleLogin() {
    wx.getUserProfile({
      desc: '用于展示个人信息',
      success: (res) => {
        app.globalData.userInfo = res.userInfo;
        app.globalData.isLoggedIn = true;
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          isLoggedIn: true,
          userInfo: res.userInfo,
        });
        // 调用后端登录
        app.login().then(() => {
          wx.showToast({ title: '登录成功', icon: 'success' });
        });
      },
      fail: () => {
        wx.showToast({ title: '登录取消', icon: 'none' });
      },
    });
  },

  goToHistory() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToProgress() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToCollection() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToGoals() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToSettings() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToAbout() {
    wx.showModal({
      title: '古筝学习助手',
      content: '版本 1.0.0\n\nAI 驱动的古筝学习辅助工具，通过视频和音频智能分析，为您提供专业的练习指导。',
      showCancel: false,
    });
  },

  goToFeedback() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
});
