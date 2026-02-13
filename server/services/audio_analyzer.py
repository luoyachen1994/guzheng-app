"""
音频分析服务 - 基于 librosa 的音准、节奏、力度分析
"""
import librosa
import numpy as np
import logging

logger = logging.getLogger(__name__)


def analyze_audio(audio_path: str) -> dict:
    """
    分析古筝演奏音频

    返回:
        {
            "pitchAccuracy": int,      # 音准评分 0-100
            "rhythmAccuracy": int,     # 节奏评分 0-100
            "dynamics": int,           # 力度评分 0-100
            "overallScore": int,       # 综合评分 0-100
            "pitchCurve": [...],       # 逐帧音高数据
            "beatAlignment": [...],    # 节拍时间点
            "issues": [...]            # 问题列表
        }
    """
    try:
        # 加载音频
        y, sr = librosa.load(audio_path, sr=44100, mono=True)
        duration = librosa.get_duration(y=y, sr=sr)
        logger.info(f"音频加载完成: {duration:.1f}秒, 采样率={sr}")

        # 1. 音准分析
        pitch_result = _analyze_pitch(y, sr)

        # 2. 节奏分析
        rhythm_result = _analyze_rhythm(y, sr)

        # 3. 力度分析
        dynamics_result = _analyze_dynamics(y, sr)

        # 4. 综合评分
        overall = int(
            pitch_result["score"] * 0.4 +
            rhythm_result["score"] * 0.35 +
            dynamics_result["score"] * 0.25
        )

        # 5. 汇总问题
        issues = pitch_result["issues"] + rhythm_result["issues"] + dynamics_result["issues"]

        return {
            "pitchAccuracy": pitch_result["score"],
            "rhythmAccuracy": rhythm_result["score"],
            "dynamics": dynamics_result["score"],
            "overallScore": overall,
            "pitchCurve": pitch_result["curve"],
            "beatAlignment": rhythm_result["beats"],
            "issues": issues,
            "duration": round(duration, 1),
        }

    except Exception as e:
        logger.error(f"音频分析失败: {e}")
        raise


def _analyze_pitch(y: np.ndarray, sr: int) -> dict:
    """音准分析 - 基频检测"""
    # 使用 pyin 算法检测基频（适合单音乐器）
    f0, voiced_flag, voiced_probs = librosa.pyin(
        y, fmin=librosa.note_to_hz("C2"),
        fmax=librosa.note_to_hz("C7"),
        sr=sr
    )

    # 过滤有效音高
    valid_f0 = f0[voiced_flag]

    if len(valid_f0) == 0:
        return {"score": 50, "curve": [], "issues": [
            {"severity": "warning", "title": "未检测到明显音高",
             "description": "录音中未检测到清晰的音高信息",
             "suggestion": "请确保录音环境安静，古筝靠近麦克风"}
        ]}

    # 将频率转换为最近的音符，计算偏差（音分）
    midi_notes = librosa.hz_to_midi(valid_f0)
    # 与最近整数 MIDI 音符的偏差
    deviations = np.abs(midi_notes - np.round(midi_notes)) * 100  # 转换为音分

    # 音准评分：偏差越小越好
    avg_deviation = np.mean(deviations)
    # 0 音分 → 100 分，50 音分 → 0 分
    score = max(0, min(100, int(100 - avg_deviation * 2)))

    # 生成音准曲线（每 0.5 秒一个数据点）
    times = librosa.times_like(f0, sr=sr)
    curve = []
    for i in range(len(f0)):
        if voiced_flag[i]:
            curve.append({
                "time": round(float(times[i]), 2),
                "frequency": round(float(f0[i]), 1),
                "note": librosa.hz_to_note(f0[i]),
                "cents_off": round(float(deviations[i] if i < len(deviations) else 0), 1)
            })

    # 降采样曲线数据（最多 200 个点）
    if len(curve) > 200:
        step = len(curve) // 200
        curve = curve[::step]

    # 检测问题段落
    issues = []
    if avg_deviation > 25:
        issues.append({
            "severity": "warning",
            "title": "音准偏差较大",
            "description": f"平均音准偏差 {avg_deviation:.0f} 音分",
            "suggestion": "建议搭配调音器逐音练习，注意左手按弦力度"
        })
    if avg_deviation > 40:
        issues[0]["severity"] = "error"

    return {"score": score, "curve": curve, "issues": issues}


def _analyze_rhythm(y: np.ndarray, sr: int) -> dict:
    """节奏分析 - 节拍检测与稳定性"""
    # 检测 onset（音符起始点）
    onset_frames = librosa.onset.onset_detect(y=y, sr=sr, units="frames")
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)

    if len(onset_times) < 3:
        return {"score": 60, "beats": [], "issues": [
            {"severity": "info", "title": "音符数量过少",
             "description": "检测到的音符数量不足，无法准确评估节奏",
             "suggestion": "建议录制更长的练习片段"}
        ]}

    # 计算相邻 onset 的时间间隔
    intervals = np.diff(onset_times)

    # 节奏稳定性：间隔的变异系数（CV）越小越稳定
    if np.mean(intervals) > 0:
        cv = np.std(intervals) / np.mean(intervals)
    else:
        cv = 1.0

    # CV 0 → 100 分，CV 1.0 → 0 分
    score = max(0, min(100, int(100 - cv * 100)))

    # 检测 tempo
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    if isinstance(tempo, np.ndarray):
        tempo = float(tempo[0])

    beats = [{"time": round(float(t), 2)} for t in onset_times[:100]]

    issues = []
    if cv > 0.3:
        issues.append({
            "severity": "warning",
            "title": "节奏不够稳定",
            "description": f"节拍间隔变化较大（变异系数 {cv:.2f}），预估速度 {tempo:.0f} BPM",
            "suggestion": "建议搭配节拍器从慢速开始练习，逐步提速"
        })
    if cv > 0.5:
        issues[0]["severity"] = "error"

    return {"score": score, "beats": beats, "issues": issues}


def _analyze_dynamics(y: np.ndarray, sr: int) -> dict:
    """力度分析 - 音量变化与控制"""
    # RMS 能量
    rms = librosa.feature.rms(y=y)[0]

    if len(rms) == 0 or np.max(rms) == 0:
        return {"score": 50, "issues": [
            {"severity": "warning", "title": "音量过低",
             "description": "录音音量极低",
             "suggestion": "请靠近麦克风录制"}
        ]}

    # 归一化 RMS
    rms_norm = rms / np.max(rms)

    # 力度评分基于：
    # 1. 动态范围（有高有低说明有表现力）
    dynamic_range = float(np.max(rms) - np.min(rms[rms > 0.01 * np.max(rms)])) / float(np.max(rms))

    # 2. 力度变化的平滑度（不要突变）
    rms_diff = np.abs(np.diff(rms_norm))
    smoothness = 1.0 - min(1.0, float(np.mean(rms_diff)) * 10)

    # 综合评分
    score = max(0, min(100, int(dynamic_range * 50 + smoothness * 50)))

    issues = []
    if dynamic_range < 0.3:
        issues.append({
            "severity": "info",
            "title": "力度变化不足",
            "description": "演奏力度较为平淡，缺少强弱对比",
            "suggestion": "注意乐句的强弱变化，练习渐强渐弱"
        })
    if smoothness < 0.4:
        issues.append({
            "severity": "warning",
            "title": "力度控制不稳",
            "description": "存在较多突然的力度变化",
            "suggestion": "注意触弦力度的均匀控制"
        })

    return {"score": score, "issues": issues}
