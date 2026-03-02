// scorePackage/data/meihua_sannong.js
// 《梅花三弄》简谱数据 - D调，4/4拍，BPM=76
// duration: 四分音符=1, 八分音符=0.5, 二分音符=2, 全音符=4, 附点四分=1.5
// pitch: 简谱数字，'0'为休止符，高八度加'h'前缀，低八度加'l'前缀

const MEIHUA_SANNONG = {
  title: '梅花三弄',
  composer: '传统古曲',
  arranger: '古琴改编',
  bpm: 76,
  timeSignature: [4, 4],
  key: 'D',
  // 音频文件放在 scorePackage/audio/meihua_sannong.mp3
  audioSrc: '/scorePackage/audio/meihua_sannong.mp3',
  sections: [
    {
      name: '引子',
      measures: [
        {
          id: 0,
          notes: [
            { pitch: '5', duration: 2, finger: '中' },
            { pitch: '3', duration: 1, finger: '食' },
            { pitch: '2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 1,
          notes: [
            { pitch: '1', duration: 2, finger: '大' },
            { pitch: '2', duration: 1, finger: '食' },
            { pitch: '3', duration: 1, finger: '中' },
          ]
        },
        {
          id: 2,
          notes: [
            { pitch: '5', duration: 1.5, finger: '中' },
            { pitch: '6', duration: 0.5, finger: '无名' },
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '3', duration: 1, finger: '食' },
          ]
        },
        {
          id: 3,
          notes: [
            { pitch: '2', duration: 2, finger: '食' },
            { pitch: '1', duration: 2, finger: '大' },
          ]
        },
      ]
    },
    {
      name: '一弄·叫月',
      measures: [
        {
          id: 4,
          notes: [
            { pitch: 'h1', duration: 2, finger: '大' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: '5', duration: 1, finger: '中' },
          ]
        },
        {
          id: 5,
          notes: [
            { pitch: '3', duration: 1, finger: '食' },
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: '5', duration: 1, finger: '中' },
          ]
        },
        {
          id: 6,
          notes: [
            { pitch: '3', duration: 2, finger: '食' },
            { pitch: '2', duration: 1, finger: '食' },
            { pitch: '1', duration: 1, finger: '大' },
          ]
        },
        {
          id: 7,
          notes: [
            { pitch: '2', duration: 1.5, finger: '食' },
            { pitch: '3', duration: 0.5, finger: '中' },
            { pitch: '2', duration: 2, finger: '食' },
          ]
        },
        {
          id: 8,
          notes: [
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: '6', duration: 1, finger: '无名' },
          ]
        },
        {
          id: 9,
          notes: [
            { pitch: '5', duration: 2, finger: '中' },
            { pitch: '3', duration: 1, finger: '食' },
            { pitch: '2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 10,
          notes: [
            { pitch: '1', duration: 2, finger: '大' },
            { pitch: '6l', duration: 1, finger: '无名' },
            { pitch: '5l', duration: 1, finger: '中' },
          ]
        },
        {
          id: 11,
          notes: [
            { pitch: '5l', duration: 4, finger: '中' },
          ]
        },
      ]
    },
    {
      name: '二弄·穿云',
      measures: [
        {
          id: 12,
          notes: [
            { pitch: 'h2', duration: 2, finger: '食' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: '6', duration: 1, finger: '无名' },
          ]
        },
        {
          id: 13,
          notes: [
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: '6', duration: 1, finger: '无名' },
          ]
        },
        {
          id: 14,
          notes: [
            { pitch: '5', duration: 1.5, finger: '中' },
            { pitch: '3', duration: 0.5, finger: '食' },
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
          ]
        },
        {
          id: 15,
          notes: [
            { pitch: 'h1', duration: 2, finger: '大' },
            { pitch: 'h2', duration: 2, finger: '食' },
          ]
        },
        {
          id: 16,
          notes: [
            { pitch: 'h3', duration: 2, finger: '中' },
            { pitch: 'h2', duration: 1, finger: '食' },
            { pitch: 'h1', duration: 1, finger: '大' },
          ]
        },
        {
          id: 17,
          notes: [
            { pitch: 'h2', duration: 1.5, finger: '食' },
            { pitch: 'h1', duration: 0.5, finger: '大' },
            { pitch: '6', duration: 2, finger: '无名' },
          ]
        },
        {
          id: 18,
          notes: [
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: 'h2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 19,
          notes: [
            { pitch: 'h1', duration: 4, finger: '大' },
          ]
        },
      ]
    },
    {
      name: '三弄·横江',
      measures: [
        {
          id: 20,
          notes: [
            { pitch: 'h5', duration: 2, finger: '中' },
            { pitch: 'h3', duration: 1, finger: '食' },
            { pitch: 'h2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 21,
          notes: [
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: 'h2', duration: 1, finger: '食' },
            { pitch: 'h3', duration: 1, finger: '中' },
            { pitch: 'h2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 22,
          notes: [
            { pitch: 'h1', duration: 1.5, finger: '大' },
            { pitch: '6', duration: 0.5, finger: '无名' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: 'h2', duration: 1, finger: '食' },
          ]
        },
        {
          id: 23,
          notes: [
            { pitch: 'h3', duration: 2, finger: '中' },
            { pitch: 'h5', duration: 2, finger: '中' },
          ]
        },
        {
          id: 24,
          notes: [
            { pitch: 'h6', duration: 2, finger: '无名' },
            { pitch: 'h5', duration: 1, finger: '中' },
            { pitch: 'h3', duration: 1, finger: '食' },
          ]
        },
        {
          id: 25,
          notes: [
            { pitch: 'h2', duration: 2, finger: '食' },
            { pitch: 'h1', duration: 2, finger: '大' },
          ]
        },
        {
          id: 26,
          notes: [
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: 'h1', duration: 1, finger: '大' },
            { pitch: 'h2', duration: 1, finger: '食' },
            { pitch: 'h3', duration: 1, finger: '中' },
          ]
        },
        {
          id: 27,
          notes: [
            { pitch: 'h2', duration: 1.5, finger: '食' },
            { pitch: 'h1', duration: 0.5, finger: '大' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: '5', duration: 1, finger: '中' },
          ]
        },
      ]
    },
    {
      name: '尾声',
      measures: [
        {
          id: 28,
          notes: [
            { pitch: '3', duration: 1, finger: '食' },
            { pitch: '5', duration: 1, finger: '中' },
            { pitch: '6', duration: 1, finger: '无名' },
            { pitch: '5', duration: 1, finger: '中' },
          ]
        },
        {
          id: 29,
          notes: [
            { pitch: '3', duration: 2, finger: '食' },
            { pitch: '2', duration: 1, finger: '食' },
            { pitch: '1', duration: 1, finger: '大' },
          ]
        },
        {
          id: 30,
          notes: [
            { pitch: '2', duration: 1, finger: '食' },
            { pitch: '1', duration: 1, finger: '大' },
            { pitch: '6l', duration: 2, finger: '无名' },
          ]
        },
        {
          id: 31,
          notes: [
            { pitch: '5l', duration: 4, finger: '中' },
          ]
        },
      ]
    },
  ]
}

module.exports = MEIHUA_SANNONG
