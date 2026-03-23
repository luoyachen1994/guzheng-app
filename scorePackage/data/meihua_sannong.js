// scorePackage/data/meihua_sannong.js
// 《梅花三弄》古琴曲 邱大成移植
// 1=G，BPM=48（慢板），中段♩=80
// 只录右手旋律声部（上行谱）
// duration: 全音符=4, 二分=2, 四分=1, 八分=0.5, 十六分=0.25
// 附点：如附点四分=1.5, 附点八分=0.75
// pitch: '0'休止符, 数字为简谱音, 'h'前缀高八度, 'l'后缀低八度

const MEIHUA_SANNONG = {
  title: '梅花三弄',
  composer: '古琴曲',
  arranger: '邱大成移植',
  bpm: 48,
  timeSignature: [4, 4],
  key: 'G',
  audioSrc: 'http://47.96.88.249:8000/static/audio/meihua_sannong.mp3',
  sections: [
    {
      name: '引子',
      measures: [
        // 第1行：散板引子，按4拍一小节均分
        // 2 1 1 1 1  2 1
        {
          id: 0,
          notes: [
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
          ]
        },
        // 1 1 1 3 2  1·2 3
        {
          id: 1,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '3',  duration: 1 },
          ]
        },
        // 2·3 5  3·2 1 6
        {
          id: 2,
          notes: [
            { pitch: '2',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '5',  duration: 1 },
            { pitch: '3',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
          ]
        },
        // 6/4: 1· 6 1 2 1  高6·  —
        {
          id: 3,
          notes: [
            { pitch: '1',  duration: 1.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: 'h6', duration: 1.5 },
            { pitch: '0',  duration: 1.5 },
          ]
        },
      ]
    },
    {
      name: '第一段',
      measures: [
        // 第2行开始：旋律主题
        // 1  2  1  6
        {
          id: 4,
          notes: [
            { pitch: '1',  duration: 1 },
            { pitch: '2',  duration: 1 },
            { pitch: '1',  duration: 1 },
            { pitch: '6',  duration: 1 },
          ]
        },
        // 5 6 2 2  2·3 6
        {
          id: 5,
          notes: [
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '6',  duration: 1 },
          ]
        },
        // 3  3  3·
        {
          id: 6,
          notes: [
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1.5 },
            { pitch: '0',  duration: 0.5 },
          ]
        },
        // 3 2  1  1  2  1  6·
        {
          id: 7,
          notes: [
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 1 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
            { pitch: '6',  duration: 1.5 },
          ]
        },
        // 第3行：5 6 2 2  2·3 6
        {
          id: 8,
          notes: [
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '6',  duration: 1 },
          ]
        },
        // 3  3  3·  3·
        {
          id: 9,
          notes: [
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1.5 },
            { pitch: '3',  duration: 1.5 },
          ]
        },
        // 2 1  6  1  高1  高6 1 1 1 1
        {
          id: 10,
          notes: [
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '6',  duration: 1 },
            { pitch: '1',  duration: 0.5 },
            { pitch: 'h1', duration: 0.5 },
            { pitch: 'h6', duration: 0.5 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
          ]
        },
        // 第4行：6 1  1 2 1 6  5 6 1  1
        {
          id: 11,
          notes: [
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
            { pitch: '1',  duration: 0.5 },
          ]
        },
        // 2 2  1·1 1 2  2 3 2 1  1 2 3 5/2 2
        {
          id: 12,
          notes: [
            { pitch: '2',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
          ]
        },
        // 5/2  2/3  1 5 6 1  1
        {
          id: 13,
          notes: [
            { pitch: '5',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
          ]
        },
      ]
    },
    {
      name: '第二段（一弄）',
      measures: [
        // 第5行：1 2 3 2·1 6 1  渐慢
        {
          id: 14,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '2',  duration: 0.75 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '6',  duration: 1 },
            { pitch: '1',  duration: 1 },
          ]
        },
        // 6/4: 高1 — — —
        {
          id: 15,
          notes: [
            { pitch: 'h1', duration: 4 },
            { pitch: '0',  duration: 2 },
          ]
        },
        // ♩=80: 1 5 5  5· 3 2
        {
          id: 16,
          notes: [
            { pitch: '1',  duration: 1 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 1.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 1 5 5  5· 3 2
        {
          id: 17,
          notes: [
            { pitch: '1',  duration: 1 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 1.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 5/4: 1 2 1 2 3 5 5 5 —
        {
          id: 18,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '0',  duration: 0.5 },
          ]
        },
        // 5  6·5 3  3  3 —
        {
          id: 19,
          notes: [
            { pitch: '5',  duration: 1 },
            { pitch: '6',  duration: 0.75 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '0',  duration: 1 },
          ]
        },
        // 4/4: 5 1  6·5 3  3· 2 1· 2
        {
          id: 20,
          notes: [
            { pitch: '5',  duration: 1 },
            { pitch: '1',  duration: 1 },
            { pitch: '6',  duration: 0.75 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 1.5 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 5/4: 1 2 3 6 5 5  5· 3 2
        {
          id: 21,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 4/4: 1 2 3  2  5  3·2 1 6 1· 高6 1  2 1· 1 —
        {
          id: 22,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
          ]
        },
        {
          id: 23,
          notes: [
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.75 },
            { pitch: 'h6', duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '0',  duration: 1 },
          ]
        },
      ]
    },
    {
      name: '第三段（二弄）',
      measures: [
        // 第8行 1· 2  6 1 6 5  3
        {
          id: 24,
          notes: [
            { pitch: '1',  duration: 1.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '3',  duration: 1 },
          ]
        },
        // 3·2 3 3·2 1 2 1 6
        {
          id: 25,
          notes: [
            { pitch: '3',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
          ]
        },
        // 5 6 1  1  1·1 2 3
        {
          id: 26,
          notes: [
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
            { pitch: '1',  duration: 1 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
          ]
        },
        // 3· 3 3 3 3 3 3 5
        {
          id: 27,
          notes: [
            { pitch: '3',  duration: 1.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
          ]
        },
        // 1 2 6 5 5  3 5 3 2
        {
          id: 28,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 1 2 3 5 3 2  2  2
        {
          id: 29,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 1 },
          ]
        },
        // 3· 3  5  6  6·
        {
          id: 30,
          notes: [
            { pitch: '3',  duration: 1.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '6',  duration: 1.5 },
            { pitch: '6',  duration: 0.5 },
          ]
        },
        // 高1 6 1 6 1 6 5 3 5 2  3
        {
          id: 31,
          notes: [
            { pitch: 'h1', duration: 0.5 },
            { pitch: '6',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '6',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '6',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 1 },
          ]
        },
      ]
    },
    {
      name: '第四段（三弄）',
      measures: [
        // 高1 6 1 2  3 5 6·5 3  2 3 5 3 2  2 2
        {
          id: 32,
          notes: [
            { pitch: 'h1', duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '6',  duration: 0.75 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 0.5 },
          ]
        },
        {
          id: 33,
          notes: [
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '2',  duration: 1 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
          ]
        },
        // 3· 3  5  6  6
        {
          id: 34,
          notes: [
            { pitch: '3',  duration: 1.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '6',  duration: 1 },
            { pitch: '6',  duration: 1 },
          ]
        },
        // 高6 7 6 7  6 1 2
        {
          id: 35,
          notes: [
            { pitch: 'h6', duration: 0.25 },
            { pitch: 'h7', duration: 0.25 },
            { pitch: 'h6', duration: 0.25 },
            { pitch: 'h7', duration: 0.25 },
            { pitch: 'h6', duration: 0.5 },
            { pitch: 'h1', duration: 0.5 },
            { pitch: 'h2', duration: 0.5 },
            { pitch: '0',  duration: 1 },
          ]
        },
        // 5/4: 1 2 3 6 5 5  5· 3 2
        {
          id: 36,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '5',  duration: 1 },
            { pitch: '5',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 5  6·5 3  3  3 —
        {
          id: 37,
          notes: [
            { pitch: '5',  duration: 1 },
            { pitch: '6',  duration: 0.75 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '3',  duration: 1 },
            { pitch: '0',  duration: 1 },
          ]
        },
        // 4/4: 5 1  6·5 3  3· 2 1· 2
        {
          id: 38,
          notes: [
            { pitch: '5',  duration: 1 },
            { pitch: '1',  duration: 1 },
            { pitch: '6',  duration: 0.75 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 1.5 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
          ]
        },
        // 1 1 5 1  5 5 2 5 5 5  2 5 3 3 1 3  1 3
        {
          id: 39,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '5',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '5',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '1',  duration: 0.25 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '3',  duration: 0.5 },
          ]
        },
      ]
    },
    {
      name: '尾声',
      measures: [
        // 页3（同发来的第一张图）
        // 2 1 1 1 1  2 1
        {
          id: 40,
          notes: [
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 1 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
          ]
        },
        // 1 1 1 3 2  1·2 3
        {
          id: 41,
          notes: [
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '3',  duration: 1 },
          ]
        },
        // 2·3 5  3·2 1 6
        {
          id: 42,
          notes: [
            { pitch: '2',  duration: 0.75 },
            { pitch: '3',  duration: 0.25 },
            { pitch: '5',  duration: 1 },
            { pitch: '3',  duration: 0.75 },
            { pitch: '2',  duration: 0.25 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '6',  duration: 0.5 },
          ]
        },
        // 6/4: 1· 6 1 2 1  高6·  —（渐慢）
        {
          id: 43,
          notes: [
            { pitch: '1',  duration: 1.5 },
            { pitch: '6',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: '2',  duration: 0.5 },
            { pitch: '1',  duration: 0.5 },
            { pitch: 'h6', duration: 1.5 },
            { pitch: '0',  duration: 1.5 },
          ]
        },
        // 4/4: 5· 1· —  收尾
        {
          id: 44,
          notes: [
            { pitch: '5',  duration: 1.5 },
            { pitch: '0',  duration: 0.5 },
            { pitch: '1',  duration: 1.5 },
            { pitch: '0',  duration: 0.5 },
            { pitch: '0',  duration: 2 },
          ]
        },
      ]
    },
  ]
}

module.exports = MEIHUA_SANNONG
