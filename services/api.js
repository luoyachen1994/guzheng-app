/**
 * API 请求封装
 */

const app = getApp();

/**
 * 通用请求方法
 */
function request(options) {
  const { url, method = 'GET', data = {}, header = {} } = options;
  const baseUrl = app.globalData.apiBaseUrl;
  const token = wx.getStorageSync('token');

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // Token 过期，重新登录
          wx.removeStorageSync('token');
          app.globalData.isLoggedIn = false;
          wx.showToast({ title: '请重新登录', icon: 'none' });
          reject(new Error('Unauthorized'));
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

// 快捷方法
const get = (url, data) => request({ url, method: 'GET', data });
const post = (url, data) => request({ url, method: 'POST', data });
const put = (url, data) => request({ url, method: 'PUT', data });
const del = (url, data) => request({ url, method: 'DELETE', data });

module.exports = {
  request,
  get,
  post,
  put,
  del,
};
