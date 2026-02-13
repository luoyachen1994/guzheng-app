App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    // API 基础配置
    apiBaseUrl: '',
    // 练习统计
    todayPracticeMinutes: 0,
    totalPracticeDays: 0,
  },

  onLaunch() {
    // 初始化云开发（如使用微信云开发）
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true,
      });
    }

    // 检查登录状态
    this.checkLoginStatus();

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.isLoggedIn = true;
      this.globalData.userInfo = wx.getStorageSync('userInfo');
    }
  },

  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 将 code 发送到后端换取 session
            // TODO: 接入实际后端登录接口
            resolve(res.code);
          } else {
            reject(new Error('登录失败'));
          }
        },
        fail: reject,
      });
    });
  },
});
