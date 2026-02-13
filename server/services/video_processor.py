"""
视频处理服务 - FFmpeg 提取音频和抽帧
"""
import subprocess
import os
import tempfile
import logging

logger = logging.getLogger(__name__)


def extract_audio(video_path: str, output_path: str = None) -> str:
    """从视频中提取音频为 WAV 格式"""
    if output_path is None:
        output_path = os.path.splitext(video_path)[0] + ".wav"

    cmd = [
        "ffmpeg", "-i", video_path,
        "-vn",                    # 不要视频
        "-acodec", "pcm_s16le",   # 16-bit PCM
        "-ar", "44100",           # 44.1kHz 采样率
        "-ac", "1",               # 单声道
        "-y",                     # 覆盖输出
        output_path
    ]

    try:
        subprocess.run(cmd, capture_output=True, check=True, timeout=60)
        logger.info(f"音频提取成功: {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        logger.error(f"音频提取失败: {e.stderr.decode()}")
        raise RuntimeError(f"音频提取失败: {e.stderr.decode()}")


def extract_frames(video_path: str, output_dir: str = None, fps: int = 2) -> list[str]:
    """从视频中按指定帧率抽帧"""
    if output_dir is None:
        output_dir = tempfile.mkdtemp(prefix="frames_")

    os.makedirs(output_dir, exist_ok=True)
    output_pattern = os.path.join(output_dir, "frame_%04d.jpg")

    cmd = [
        "ffmpeg", "-i", video_path,
        "-vf", f"fps={fps}",     # 每秒抽取帧数
        "-q:v", "2",             # JPEG 质量
        "-y",
        output_pattern
    ]

    try:
        subprocess.run(cmd, capture_output=True, check=True, timeout=120)
    except subprocess.CalledProcessError as e:
        logger.error(f"抽帧失败: {e.stderr.decode()}")
        raise RuntimeError(f"抽帧失败: {e.stderr.decode()}")

    # 收集生成的帧文件路径
    frames = sorted([
        os.path.join(output_dir, f)
        for f in os.listdir(output_dir)
        if f.startswith("frame_") and f.endswith(".jpg")
    ])

    logger.info(f"抽帧完成: {len(frames)} 帧")
    return frames


def get_video_duration(video_path: str) -> float:
    """获取视频时长（秒）"""
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        video_path
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, check=True, timeout=10)
        return float(result.stdout.decode().strip())
    except (subprocess.CalledProcessError, ValueError) as e:
        logger.error(f"获取视频时长失败: {e}")
        return 0.0
