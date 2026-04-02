# Onboarding Lite Life

A premium dark-themed AI fitness app built with React Native and Expo. Features personalized workout plans, real-time pose detection with form tracking, and body-part-specific exercise programs.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native | 0.81.4 |
| Platform | Expo (Router) | ~54.0.33 |
| State | Legend State | ^3.0.0-beta.43 |
| Backend | Supabase | ^2.58.0 |
| Storage | MMKV | ^4.1.2 |
| Animations | Reanimated | ~4.1.1 |
| UI | Lucide Icons, SVG, Body Highlighter | — |

### Design System

| Token | Value |
|---|---|
| Background | `#0A0A0A` |
| Accent (Lime) | `#CDFC00` |
| Heading Font | Audiowide |
| Body Font | Averta |

---

## AI Pose Detection Stack

Real-time exercise form tracking using the device camera. The pipeline processes each camera frame through an ML model to detect 33 body landmarks, smooths the data, calculates joint angles, and counts reps.

### Architecture

```
Camera Hardware
    │
    ▼
react-native-vision-camera v4.7.3          ← Camera capture + Frame Processor API
    │
    ▼
react-native-worklets-core v1.6.3          ← JS worklet runtime for Frame Processors
    │
    ▼
Custom Expo Module: pose-detector           ← Native Frame Processor Plugin (~200-300 LOC)
    │  wraps Google MLKit Pose Detection         Kotlin (Android) + Swift (iOS)
    │  returns 33 landmarks per frame
    │
    ▼
One Euro Filter (oneEuroFilter.ts)          ← Jitter reduction (Casiez et al. CHI 2012)
    │  adaptive smoothing: filters noise
    │  when still, passes fast movements
    │
    ▼
poseMath.ts                                 ← Joint angle calculation from 33 landmarks
    │  calculateAngle, validateForm,
    │  isFacingCamera, isSideView
    │
    ▼
repCounter.ts                               ← Temporal state machine for rep detection
    │  IDLE → ECCENTRIC → CONCENTRIC
    │  → REP_COMPLETE → loop
    │
    ▼
exerciseConfigs.ts                          ← Per-exercise rules (angle ranges, landmarks)
    │  squat, pushUp, lunge, plank, bicepCurl
    │
    ▼
UI Overlay                                  ← Real-time feedback, rep count, form cues
```

### Why This Stack

| Component | Choice | Why |
|---|---|---|
| Camera | `react-native-vision-camera` | 454K downloads/week, ~1ms Frame Processor overhead, actively maintained by mrousavy/Margelo |
| ML Model | Google MLKit Pose Detection | Google-maintained, 33 landmarks (same BlazePose model as MediaPipe), ~30 FPS on base SDK, bundled model — no .tflite file management |
| Worklets | `react-native-worklets-core` | Required by VisionCamera Frame Processors, 138K downloads/week, maintained by same team |
| Smoothing | One Euro Filter | Industry standard for real-time landmark smoothing, used internally by MediaPipe and ARKit |
| Pose Logic | Custom pure functions | Zero dependencies, input-source agnostic, already coded for 33-landmark format |

### What We Rejected (and Why)

| Option | Reason for rejection |
|---|---|
| `react-native-mediapipe` | 312 downloads/week, 37 open issues (crashes, build failures), not migrated to new RN architecture, last real commit 7+ months ago |
| `react-native-vision-camera-v3-pose-detection` | Abandoned — 1 contributor, last updated 2+ years ago, requires outdated worklets-core 0.4.0 |
| `react-native-fast-tflite` + BlazePose .tflite | Google now distributes BlazePose as .task bundles, not standalone .tflite — sourcing the model is fragile, manual tensor parsing required |
| MoveNet (via TFLite) | Only 17 keypoints (COCO format) — our entire poseMath.ts is built for 33 landmarks |
| Kalidokit / VRM Avatars / Three.js | Overengineered — app uses a 2D muscle highlighter, not 3D avatars |

### Package Changes Required

| Action | Package | From | To |
|---|---|---|---|
| **Add** | `react-native-vision-camera` | — | ^4.7.3 |
| **Add** | `react-native-worklets-core` | — | ^1.6.3 |
| **Update** | `react-native-worklets` | 0.5.1 | ^0.7.4 |
| **Remove** | `expo-camera` | ~17.0.8 | — |
| **Create** | Local Expo Module (`pose-detector`) | — | `npx create-expo-module --local` |
| **Add** | Babel plugin | — | `["react-native-worklets-core/plugin"]` |

### Important Notes

- **Expo Go will not work.** VisionCamera and custom native modules require `npx expo prebuild` + dev client builds (`npx expo run:android` / `npx expo run:ios`).
- **Two worklet babel plugins coexist.** Both `react-native-reanimated/plugin` and `react-native-worklets-core/plugin` must be in `babel.config.js`. Reanimated plugin goes first.
- **VisionCamera V5** is in active development (sponsor-only). When it goes public, `react-native-worklets` (SWM) will replace `react-native-worklets-core` (Margelo). Plan for future migration but don't block on it.

### 33 Landmark Indices (shared by MLKit + MediaPipe)

```
 0  Nose                 17  Left Pinky
 1  Left Eye (inner)     18  Right Pinky
 2  Left Eye             19  Left Index
 3  Left Eye (outer)     20  Right Index
 4  Right Eye (inner)    21  Left Thumb
 5  Right Eye            22  Right Thumb
 6  Right Eye (outer)    23  Left Hip
 7  Left Ear             24  Right Hip
 8  Right Ear            25  Left Knee
 9  Mouth (left)         26  Right Knee
10  Mouth (right)        27  Left Ankle
11  Left Shoulder        28  Right Ankle
12  Right Shoulder       29  Left Heel
13  Left Elbow           30  Right Heel
14  Right Elbow          31  Left Foot Index
15  Left Wrist           32  Right Foot Index
16  Right Wrist
```

---

## Project Structure

```
app/                    Expo Router screens
  (tabs)/               Main tab navigation (home, workout, analysis, profile)
  exercises/            Exercise detail, mode selection, workout plans
  onboarding/           Onboarding flow (gender, age, fitness level, body parts)
components/             Shared UI components
constants/              Design tokens (colors, spacing, typography)
context/                React context providers
data/                   Types, Supabase client, workout data, sync
hooks/                  Custom hooks (auth, onboarding, workout, network)
services/               Business logic
  pose/                 Pose detection services (poseMath, repCounter, exerciseConfigs)
  filters/              Signal processing (One Euro Filter)
store/                  Legend State observables
assets/                 Fonts, images, SVGs, video
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (Expo Go — no pose detection)
npx expo start

# Build dev client (required for pose detection)
npx expo prebuild
npx expo run:android   # or npx expo run:ios
```
