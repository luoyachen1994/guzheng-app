/**
 * 视频服务 - 处理视频录制及手部动作识别相关逻辑
 */

const { wxPromise } = require('../utils/util');

/**
 * 上传视频文件到服务器进行手部动作分析
 * @param {string} filePath - 视频文件临时路径
 * @param {object} options - 额外参数
 * @returns {Promise<object>} 分析结果
 */
async function analyzeVideo(filePath, options = {}) {
  const app = getApp();

  // TODO: 替换为真实的服务端地址
  const uploadUrl = `${app.globalData.apiBaseUrl}/api/analyze/video`;

  try {
    const uploadRes = await wxPromise(wx.uploadFile, {
      url: uploadUrl,
      filePath: filePath,
      name: 'video',
      formData: {
        songId: options.songId || '',
        duration: options.duration || 0,
        cameraPosition: options.cameraPosition || 'front',
      },
    });

    const result = JSON.parse(uploadRes.data);
    return result;
  } catch (err) {
    console.error('视频分析失败', err);
    throw err;
  }
}

/**
 * 综合分析（视频 + 音频）
 * @param {string} videoPath - 视频文件路径
 * @param {string} audioPath - 音频文件路径
 * @param {object} options - 额外参数
 * @returns {Promise<object>} 综合分析结果
 */
async function analyzeCombined(videoPath, audioPath, options = {}) {
  const app = getApp();
  const uploadUrl = `${app.globalData.apiBaseUrl}/api/analyze/combined`;

  try {
    // 并行上传视频和音频
    // 注：微信小程序 uploadFile 不支持多文件，这里分步上传
    // 实际项目中可以考虑先获取上传凭证再上传
    const [videoRes, audioRes] = await Promise.all([
      wxPromise(wx.uploadFile, {
        url: `${uploadUrl}/video`,
        filePath: videoPath,
        name: 'video',
        formData: { sessionId: options.sessionId || '' },
      }),
      wxPromise(wx.uploadFile, {
        url: `${uploadUrl}/audio`,
        filePath: audioPath,
        name: 'audio',
        formData: { sessionId: options.sessionId || '' },
      }),
    ]);

    // 触发综合分析
    const analyzeRes = await wxPromise(wx.request, {
      url: `${uploadUrl}/analyze`,
      method: 'POST',
      data: {
        sessionId: options.sessionId,
        songId: options.songId || '',
      },
    });

    return analyzeRes.data;
  } catch (err) {
    console.error('综合分析失败', err);
    throw err;
  }
}

/**
 * 抽帧压缩视频（减小上传体积）
 * 注：小程序原生能力有限，可考虑使用插件
 * @param {string} filePath
 * @returns {Promise<string>} 压缩后的文件路径
 */
async function compressVideo(filePath) {
  try {
    const res = await wxPromise(wx.compressVideo, {
      src: filePath,
      quality: 'medium',
    });
    return res.tempFilePath;
  } catch (err) {
    console.warn('视频压缩失败，使用原始文件', err);
    return filePath;
  }
}

module.exports = {
  analyzeVideo,
  analyzeCombined,
  compressVideo,
};
