# VigilAI - YOLOv11 Multi-Threat Surveillance Platform

> [!NOTE]
> Combines custom multi-dataset YOLOv11 object and hazard detection with a decoupled multi-threaded OpenCV capture pipeline, Flask REST/MJPEG backend (`:5431`), and React + TypeScript monitoring console (`vigilai-ui/`).

## Overview & Threat Taxonomy

VigilAI supports both standard safety-equipment models and a unified **8-class combined surveillance model** trained across three merged datasets (`HackByte_Dataset`, `FireSmokeNEWdataset`, and `violence-detection-dataset`):

| Dataset Source | Detected Classes | Bounding Box Encoding |
|---|---|---|
| **HackByte Safety** | `FireExtinguisher`, `ToolBox`, `OxygenTank` | Red / Blue / Green overlays |
| **Fire & Smoke** | `fire`, `smoke`, `other` | Orange-Red / Gray / Cyan overlays |
| **Behavioral Safety** | `violence`, `non-violence` | Dark Red alert / Green clearance |

## Asynchronous Capture & Inference Architecture

To prevent blocking PyTorch forward passes from stalling the live webcam feed, `flask_api.py` isolates camera frame acquisition, YOLOv11 inference, and MJPEG HTTP streaming across lock-synchronized threads.

```mermaid
sequenceDiagram
  autonumber
  participant Cam as OpenCV VideoCapture (60 FPS)
  participant Lock as Frame Lock Buffer
  participant Inf as YOLOv11 Inference Thread
  participant Flask as Flask MJPEG & REST (:5431)
  participant UI as React + Vite Console

  UI->>Flask: POST /api/detect/start (camera_index, conf_threshold, model_size)
  Flask->>Inf: Spawn daemon inference_loop()
  loop Every Frame
    Cam->>Lock: Write latest_raw_frame
    Inf->>Lock: Copy latest_raw_frame safely
    Inf->>Inf: vigilai.predict(frame, conf) -> Bounding Boxes
    Inf-->>Flask: Update shared current_detections
    Flask->>Flask: Annotate frame + expose MJPEG stream
  end
  UI->>Flask: Poll /api/status, /api/logs & render live video feed
```

## Multi-Dataset Training & Evaluation Pipeline

```mermaid
flowchart LR
  D1["HackByte_Dataset"] --> Merge["CombinedDatasetTrainer (train_combined_model.py)"]
  D2["FireSmokeNEWdataset.v1i.yolov9"] --> Merge
  D3["violence-detection-dataset"] --> Merge
  Merge --> Train["YOLOv11 Training (epochs, img_size=416/640, batch)"]
  Train --> Artifacts["runs/train/vigilai_yolov11/weights/best.pt + results.csv"]
  Artifacts --> Eval["/api/evaluate & /api/training-results"]
  Eval --> Metrics["Precision, Recall, mAP50, mAP50-95, Loss Curves"]
  Artifacts --> Live["Live Surveillance Detector"]
```

## Model Variant Profiles

`/api/models` introspects trained checkpoints and exposes parameter scale and CPU inference latency telemetry to the UI:

| Checkpoint Variant | Parameters | CPU Latency | Primary Tradeoff |
|---|---|---|---|
| `yolo11n.pt` (Nano) | 2.6M | ~1.2 ms | Maximum frame throughput on edge CPUs |
| `yolo11s.pt` (Small) | 9.4M | ~2.1 ms | Balanced speed and recall |
| `yolo11m.pt` (Medium) | 20.1M | ~4.5 ms | Default VigilAI deployment checkpoint |
| `yolo11l.pt` (Large) | 25.3M | ~6.8 ms | Higher precision for dense scenes |
| `yolo11x.pt` (X-Large) | 48.1M | ~12.3 ms | Peak detection fidelity |

## Flask REST Control Plane

| Endpoint | Method | Role |
|---|---|---|
| `/api/status` | `GET` | Reports `Idle`, `Training`, or `Detecting` state |
| `/api/logs` | `GET` | Streams ring-buffered timestamped training & detection logs |
| `/api/train` | `POST` | Starts standard or combined 3-dataset training thread |
| `/api/detect/start` | `POST` | Launches multi-threaded camera capture & YOLOv11 prediction |
| `/api/training-results/<path>` | `GET` | Parses `results.csv` epoch metrics (`mAP50`, box/cls/dfl losses) |
| `/api/evaluation-results/<path>` | `GET` | Returns saved `results.json` evaluation benchmarks |

## CLI & Programmatic Usage

```bash
# Extract dataset, train combined model, and start live detection
python vigilai.py --mode extract
python vigilai.py --mode train --epochs 100 --batch 32 --img-size 640
python vigilai.py --mode detect --model runs/train/vigilai_yolov11/weights/best.pt --conf 0.6
```

```python
import cv2
from vigilai import VigilAI

vigilai = VigilAI(use_combined_model=True)
vigilai.load_model("runs/train/vigilai_yolov11/weights/best.pt")
annotated_frame, detections = vigilai.detect_objects(cv2.imread("sample_frame.webp"))
```
