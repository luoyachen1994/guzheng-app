"""
古筝练习助手 - Python 后端服务
"""
import os
import shutil
import tempfile
import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.video_processor import extract_audio, extract_frames, get_video_duration
from services.audio_analyzer import analyze_audio
from services.hand_analyzer import analyze_hands

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 临时文件目录
UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "guzheng_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("古筝分析服务启动")
    yield
    # 清理临时文件
    if os.path.exists(UPLOAD_DIR):
        shutil.rmtree(UPLOAD_DIR, ignore_errors=True)
    logger.info("古筝分析服务关闭")


app = FastAPI(title="古筝练习助手 API", version="1.0.0", lifespan=lifespan)

# CORS 配置 - 允许小程序访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "guzheng-analyzer"}


@app.post("/api/analyze/video")
async def analyze_video(
    file: UploadFile = File(...),
    songId: str = Form(default=""),
):
    """
    接收视频文件，执行综合分析（音频 + 手型）
    """
    # 验证文件类型
    allowed_types = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(400, f"不支持的文件类型: {file.content_type}")

    # 保存上传的视频
    task_id = f"task_{int(time.time() * 1000)}"
    task_dir = os.path.join(UPLOAD_DIR, task_id)
    os.makedirs(task_dir, exist_ok=True)

    video_path = os.path.join(task_dir, "input.mp4")
    try:
        with open(video_path, "wb") as f:
            content = await file.read()
            f.write(content)

        logger.info(f"[{task_id}] 视频已保存: {len(content)} bytes")

        # 获取视频时长
        duration = get_video_duration(video_path)
        logger.info(f"[{task_id}] 视频时长: {duration:.1f}s")

        # 1. 提取音频
        audio_path = os.path.join(task_dir, "audio.wav")
        extract_audio(video_path, audio_path)

        # 2. 抽帧
        frames_dir = os.path.join(task_dir, "frames")
        frames = extract_frames(video_path, frames_dir, fps=2)

        # 3. 音频分析
        audio_result = {}
        try:
            audio_result = analyze_audio(audio_path)
            logger.info(f"[{task_id}] 音频分析完成: 综合 {audio_result.get('overallScore', 0)} 分")
        except Exception as e:
            logger.error(f"[{task_id}] 音频分析失败: {e}")
            audio_result = {
                "pitchAccuracy": 0, "rhythmAccuracy": 0, "dynamics": 0,
                "overallScore": 0, "pitchCurve": [], "beatAlignment": [],
                "issues": [{"severity": "error", "title": "音频分析失败",
                           "description": str(e), "suggestion": "请重新录制"}]
            }

        # 4. 手部分析
        hand_result = {}
        try:
            hand_result = analyze_hands(frames)
            logger.info(f"[{task_id}] 手部分析完成: {hand_result.get('overallScore', 0)} 分")
        except Exception as e:
            logger.error(f"[{task_id}] 手部分析失败: {e}")
            hand_result = {
                "handDetected": False, "frameCount": 0, "detectedFrames": 0,
                "overallScore": 0, "issues": [{"severity": "error", "title": "手部分析失败",
                                                "description": str(e), "suggestion": "请重新录制"}],
                "handPoints": []
            }

        # 5. 合并结果
        all_issues = audio_result.get("issues", []) + hand_result.get("issues", [])

        # 综合评分：音频 60% + 手型 40%
        overall = int(
            audio_result.get("overallScore", 0) * 0.6 +
            hand_result.get("overallScore", 0) * 0.4
        )

        result = {
            "success": True,
            "data": {
                "taskId": task_id,
                "duration": round(duration, 1),
                "overallScore": overall,
                "pitchAccuracy": audio_result.get("pitchAccuracy", 0),
                "rhythmAccuracy": audio_result.get("rhythmAccuracy", 0),
                "dynamics": audio_result.get("dynamics", 0),
                "handScore": hand_result.get("overallScore", 0),
                "handDetected": hand_result.get("handDetected", False),
                "pitchCurve": audio_result.get("pitchCurve", []),
                "beatAlignment": audio_result.get("beatAlignment", []),
                "handPoints": hand_result.get("handPoints", []),
                "issues": all_issues,
            }
        }

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[{task_id}] 分析失败: {e}")
        raise HTTPException(500, f"分析失败: {str(e)}")
    finally:
        # 清理临时文件
        shutil.rmtree(task_dir, ignore_errors=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
