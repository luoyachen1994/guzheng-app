/**
 * 工具函数集
 */

/**
 * 格式化秒数为 mm:ss
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm') {
  const d = new Date(date);
  const map = {
    'YYYY': d.getFullYear(),
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'DD': d.getDate().toString().padStart(2, '0'),
    'HH': d.getHours().toString().padStart(2, '0'),
    'mm': d.getMinutes().toString().padStart(2, '0'),
    'ss': d.getSeconds().toString().padStart(2, '0'),
  };
  let result = format;
  for (const [key, value] of Object.entries(map)) {
    result = result.replace(key, value);
  }
  return result;
}

/**
 * 根据分数返回等级
 */
function getScoreLevel(score) {
  if (score >= 90) return { text: '优秀', class: 'excellent' };
  if (score >= 75) return { text: '良好', class: 'good' };
  if (score >= 60) return { text: '及格', class: 'fair' };
  return { text: '需加强', class: 'poor' };
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 */
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true });
}

function hideLoading() {
  wx.hideLoading();
}

/**
 * Promise 化 wx API
 */
function wxPromise(api, options = {}) {
  return new Promise((resolve, reject) => {
    api({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
}

module.exports = {
  formatTime,
  formatDate,
  getScoreLevel,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  wxPromise,
};
