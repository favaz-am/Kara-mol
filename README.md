# 🤖 Kara AI - Interactive Desktop Companion

Kara is a voice-reactive, 3D desktop AI assistant designed to float seamlessly on your screen. Built as a collaborative full-stack application, it features a conditional glassmorphic interface that transitions into a frameless, transparent 3D viewport with an audio-reactive status ring.

## ✨ Features
* **Frameless 3D Viewport:** Kara floats directly on your desktop without traditional application window borders.
* **Voice-Reactive Avatar:** Powered by React Three Fiber, the 3D model features cinematic lighting and a dynamic *Detroit: Become Human* inspired status ring that reacts to local audio levels.
* **Real-time AI Audio:** Low-latency voice streaming handled by a Python backend using Pipecat and WebSockets.
* **Cross-Platform Desktop App:** Packaged natively as a standalone executable using Electron.

## 📂 Repository Structure
This project is organized as a monorepo containing both the frontend desktop client and the backend AI server.

```text
kara-mol/
├── frontend/             # React, Vite, Three.js, and Electron client
├── backend/              # Python, Pipecat AI logic, and WebSocket server
└── README.md