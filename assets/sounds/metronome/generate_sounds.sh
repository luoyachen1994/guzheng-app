#!/bin/bash
# 生成简单的音效文件脚本
# 需要安装 sox: brew install sox

# 木鱼音效 - 低频短促
sox -n -r 44100 -c 1 wooden/strong.wav synth 0.08 sine 600 fade 0 0.08 0.02
sox -n -r 44100 -c 1 wooden/weak.wav synth 0.05 sine 1200 fade 0 0.05 0.01

# 古筝音效 - 中频
sox -n -r 44100 -c 1 guzheng/strong.wav synth 0.1 pluck 523 fade 0 0.1 0.03
sox -n -r 44100 -c 1 guzheng/weak.wav synth 0.06 pluck 523 fade 0 0.06 0.02

# 电子音效 - 高频清脆
sox -n -r 44100 -c 1 electronic/strong.wav synth 0.08 sine 880 fade 0 0.08 0.02
sox -n -r 44100 -c 1 electronic/weak.wav synth 0.05 sine 1760 fade 0 0.05 0.01

echo "音效文件生成完成！"
echo "转换为MP3格式..."

# 转换为MP3（更小的文件）
for dir in wooden guzheng electronic; do
  for file in $dir/*.wav; do
    ffmpeg -i "$file" -acodec libmp3lame -ab 32k "${file%.wav}.mp3" -y
    rm "$file"
  done
done

echo "所有音效已生成为MP3格式！"
