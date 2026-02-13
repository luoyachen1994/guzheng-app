// 云函数 - getReport
// 获取练习报告

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/**
 * 获取练习报告详情
 *
 * @param {object} event
 * @param {string} event.reportId - 报告ID
 * @returns {object} 报告详情
 */
exports.main = async (event, context) => {
  const { reportId } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  try {
    const db = cloud.database();

    if (reportId) {
      // 获取单个报告
      const res = await db.collection('practice_records')
        .where({ _id: reportId, openid })
        .get();

      if (res.data.length === 0) {
        return { success: false, error: '报告不存在' };
      }

      return { success: true, data: res.data[0] };
    }

    // 获取最近报告列表
    const res = await db.collection('practice_records')
      .where({ openid })
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    return { success: true, data: res.data };
  } catch (err) {
    console.error('获取报告失败', err);
    return { success: false, error: err.message };
  }
};
