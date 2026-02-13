/**
 * 音频服务 - 处理音频录制、播放及分析相关逻辑
 */

const { wxPromise } = require('../utils/util');

/**
 * 录音配置（古筝音频优化参数）
 */
const RECORD_OPTIONS = {
  duration: 300000,       // 最长5分钟
  sampleRate: 44100,      // 44.1kHz 采样率，保证音质
  numberOfChannels: 1,    // 单声道
  encodeBitRate: 192000,  // 192kbps
  format: 'mp3',
};

/**
 * 上传音频文件到服务器进行分析
 * @param {string} filePath - 音频文件临时路径
 * @param {object} options - 额外参数（曲目ID等）
 * @returns {Promise<object>} 分析结果
 */
async function analyzeAudio(filePath, options = {}) {
  const app = getApp();

  // TODO: 替换为真实的服务端地址
  const uploadUrl = `${app.globalData.apiBaseUrl}/api/analyze/audio`;

  try {
    // 上传音频文件
    const uploadRes = await wxPromise(wx.uploadFile, {
      url: uploadUrl,
      filePath: filePath,
      name: 'audio',
      formData: {
        songId: options.songId || '',
        duration: options.duration || 0,
      },
    });

    const result = JSON.parse(uploadRes.data);
    return result;
  } catch (err) {
    console.error('音频分析失败', err);
    throw err;
  }
}

/**
 * 获取音频的基本频谱信息（本地简单分析）
 * 注意：复杂的音频分析需要在服务端完成
 * @param {string} filePath
 * @returns {object} 基本音频信息
 */
function getAudioInfo(filePath) {
  return new Promise((resolve, reject) => {
    const ctx = wx.createInnerAudioContext();
    ctx.src = filePath;
    ctx.onCanplay(() => {
      resolve({
        duration: ctx.duration,
        filePath: filePath,
      });
      ctx.destroy();
    });
    ctx.onError((err) => {
      reject(err);
      ctx.destroy();
    });
  });
}

module.exports = {
  RECORD_OPTIONS,
  analyzeAudio,
  getAudioInfo,
};
