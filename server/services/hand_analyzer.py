"""
手部分析服务 - 基于 MediaPipe Hands 的手型检测与评估
"""
import numpy as np
import math
import logging

logger = logging.getLogger(__name__)

# MediaPipe 和 OpenCV 作为可选依赖
try:
    import mediapipe as mp
    import cv2
    mp_hands = mp.solutions.hands
    MEDIAPIPE_AVAILABLE = True
    logger.info("MediaPipe 加载成功")
except ImportError as e:
    MEDIAPIPE_AVAILABLE = False
    logger.warning(f"MediaPipe 不可用，手部分析将返回降级结果: {e}")
except RuntimeError as e:
    MEDIAPIPE_AVAILABLE = False
    logger.warning(f"MediaPipe 运行时错误，手部分析将返回降级结果: {e}")


def analyze_hands(frame_paths: list[str]) -> dict:
    """
    分析多帧图片中的手部姿态

    返回:
        {
            "handDetected": bool,
            "frameCount": int,
            "detectedFrames": int,
            "overallScore": int,
            "issues": [...],
            "handPoints": [...]     # 关键帧的手部关键点
        }
    """
    if not frame_paths:
        return {
            "handDetected": False,
            "frameCount": 0,
            "detectedFrames": 0,
            "overallScore": 0,
            "issues": [{"severity": "error", "title": "无视频帧",
                        "description": "未提取到视频帧", "suggestion": "请重新录制视频"}],
            "handPoints": []
        }

    if not MEDIAPIPE_AVAILABLE:
        return {
            "handDetected": False,
            "frameCount": len(frame_paths),
            "detectedFrames": 0,
            "overallScore": 0,
            "issues": [{"severity": "info", "title": "手部分析暂不可用",
                        "description": "MediaPipe 未安装或不兼容当前环境",
                        "suggestion": "请在 Linux 服务器上部署以启用手部分析"}],
            "handPoints": []
        }

    all_issues = []
    hand_points_samples = []
    detected_count = 0
    angle_records = []

    with mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=2,
        min_detection_confidence=0.5
    ) as hands:
        for i, frame_path in enumerate(frame_paths):
            img = cv2.imread(frame_path)
            if img is None:
                continue

            # BGR → RGB
            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb)

            if results.multi_hand_landmarks:
                detected_count += 1

                for hand_idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                    # 提取关键点坐标
                    landmarks = []
                    for lm in hand_landmarks.landmark:
                        landmarks.append({
                            "x": round(lm.x, 4),
                            "y": round(lm.y, 4),
                            "z": round(lm.z, 4)
                        })

                    # 分析手指角度
                    angles = _calculate_finger_angles(hand_landmarks)
                    angle_records.append(angles)

                    # 每 10 帧采样一次关键点用于前端展示
                    if i % 10 == 0:
                        handedness = "unknown"
                        if results.multi_handedness:
                            handedness = results.multi_handedness[hand_idx].classification[0].label
                        hand_points_samples.append({
                            "frameIndex": i,
                            "hand": handedness,
                            "landmarks": landmarks
                        })

    frame_count = len(frame_paths)
    detection_rate = detected_count / frame_count if frame_count > 0 else 0

    # 评估手型
    if len(angle_records) > 0:
        issues, angle_score = _evaluate_hand_form(angle_records)
        all_issues.extend(issues)
    else:
        angle_score = 0

    # 检测率也影响评分
    if detection_rate < 0.3:
        all_issues.append({
            "severity": "warning",
            "title": "手部检测率低",
            "description": f"仅在 {detection_rate*100:.0f}% 的画面中检测到手部",
            "suggestion": "请确保摄像头能清晰拍到双手，光线充足"
        })

    # 综合评分
    detection_score = min(100, int(detection_rate * 100))
    overall = int(angle_score * 0.7 + detection_score * 0.3) if detected_count > 0 else 0

    return {
        "handDetected": detected_count > 0,
        "frameCount": frame_count,
        "detectedFrames": detected_count,
        "overallScore": overall,
        "issues": all_issues,
        "handPoints": hand_points_samples[:20]  # 限制返回数量
    }


def _calculate_finger_angles(hand_landmarks) -> dict:
    """计算各手指的弯曲角度"""
    lm = hand_landmarks.landmark

    # 手指关节索引: [指尖, DIP, PIP, MCP]
    fingers = {
        "thumb":  [4, 3, 2, 1],
        "index":  [8, 7, 6, 5],
        "middle": [12, 11, 10, 9],
        "ring":   [16, 15, 14, 13],
        "pinky":  [20, 19, 18, 17],
    }

    angles = {}
    for name, indices in fingers.items():
        tip = np.array([lm[indices[0]].x, lm[indices[0]].y, lm[indices[0]].z])
        dip = np.array([lm[indices[1]].x, lm[indices[1]].y, lm[indices[1]].z])
        pip = np.array([lm[indices[2]].x, lm[indices[2]].y, lm[indices[2]].z])

        # 计算 DIP 关节处的角度
        v1 = tip - dip
        v2 = pip - dip
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8)
        angle = math.degrees(math.acos(np.clip(cos_angle, -1, 1)))
        angles[name] = round(angle, 1)

    return angles


def _evaluate_hand_form(angle_records: list[dict]) -> tuple[list, int]:
    """评估手型是否符合古筝演奏标准"""
    issues = []

    # 汇总各手指平均角度
    finger_names = ["thumb", "index", "middle", "ring", "pinky"]
    avg_angles = {}
    for name in finger_names:
        values = [r[name] for r in angle_records if name in r]
        if values:
            avg_angles[name] = np.mean(values)

    score = 100

    # 古筝演奏手型标准（简化版）：
    # - 手指自然弯曲，DIP 关节角度约 140-170°
    # - 大指角度约 130-160°
    for name, avg in avg_angles.items():
        if name == "thumb":
            ideal_min, ideal_max = 130, 160
        else:
            ideal_min, ideal_max = 140, 170

        if avg < ideal_min - 15:
            score -= 10
            issues.append({
                "severity": "warning",
                "title": f"{'大指' if name == 'thumb' else _finger_cn(name)}过度弯曲",
                "description": f"平均角度 {avg:.0f}°，建议保持 {ideal_min}-{ideal_max}°",
                "suggestion": "放松手指，保持自然弯曲的半握拳状态"
            })
        elif avg > ideal_max + 15:
            score -= 10
            issues.append({
                "severity": "warning",
                "title": f"{'大指' if name == 'thumb' else _finger_cn(name)}过于伸直",
                "description": f"平均角度 {avg:.0f}°，建议保持 {ideal_min}-{ideal_max}°",
                "suggestion": "手指应自然弯曲，避免僵直"
            })

    score = max(0, min(100, score))
    return issues, score


def _finger_cn(name: str) -> str:
    """手指英文名转中文"""
    mapping = {
        "index": "食指",
        "middle": "中指",
        "ring": "无名指",
        "pinky": "小指",
        "thumb": "大指",
    }
    return mapping.get(name, name)
