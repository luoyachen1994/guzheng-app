#!/usr/bin/env python3
"""
生成简单的节拍器音效文件
使用纯Python，不需要额外依赖
"""

import wave
import struct
import math

def generate_beep(filename, frequency=440, duration=0.1, sample_rate=44100, volume=0.5):
    """
    生成简单的正弦波音频文件

    :param filename: 输出文件名
    :param frequency: 频率（Hz）
    :param duration: 持续时间（秒）
    :param sample_rate: 采样率
    :param volume: 音量 (0.0-1.0)
    """
    num_samples = int(sample_rate * duration)

    # 生成正弦波样本
    samples = []
    for i in range(num_samples):
        # 生成正弦波
        t = i / sample_rate
        sample = volume * math.sin(2 * math.pi * frequency * t)

        # 添加淡入淡出效果（避免爆音）
        fade_samples = int(sample_rate * 0.01)  # 10ms淡入淡出
        if i < fade_samples:
            sample *= i / fade_samples
        elif i > num_samples - fade_samples:
            sample *= (num_samples - i) / fade_samples

        # 转换为16位整数
        sample_int = int(sample * 32767)
        samples.append(struct.pack('<h', sample_int))

    # 写入WAV文件
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # 单声道
        wav_file.setsampwidth(2)  # 16位
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b''.join(samples))

    print(f'✅ 已生成: {filename}')

def main():
    print('🎵 开始生成节拍器音效文件...\n')

    # 木鱼音效 - 低频短促
    print('📦 生成木鱼音效...')
    generate_beep('wooden/strong.wav', frequency=600, duration=0.08, volume=0.6)
    generate_beep('wooden/weak.wav', frequency=1200, duration=0.05, volume=0.4)

    # 古筝音效 - 中频
    print('\n🎻 生成古筝音效...')
    generate_beep('guzheng/strong.wav', frequency=523, duration=0.1, volume=0.6)
    generate_beep('guzheng/weak.wav', frequency=523, duration=0.06, volume=0.4)

    # 电子音效 - 高频清脆
    print('\n⚡ 生成电子音效...')
    generate_beep('electronic/strong.wav', frequency=880, duration=0.08, volume=0.6)
    generate_beep('electronic/weak.wav', frequency=1760, duration=0.05, volume=0.4)

    print('\n✨ 所有音效文件生成完成！')
    print('\n📝 文件列表:')
    print('  - wooden/strong.wav (木鱼强拍)')
    print('  - wooden/weak.wav (木鱼弱拍)')
    print('  - guzheng/strong.wav (古筝强拍)')
    print('  - guzheng/weak.wav (古筝弱拍)')
    print('  - electronic/strong.wav (电子强拍)')
    print('  - electronic/weak.wav (电子弱拍)')

if __name__ == '__main__':
    main()
