# Kara AI - Desktop Client

This directory contains the frontend client for Kara AI, an interactive, voice-reactive desktop assistant. It is built using Electron, React, Vite, and React Three Fiber to create a frameless, transparent application window housing a 3D avatar.

## 🛠️ Tech Stack
* **Core:** React 18, TypeScript, Vite
* **Desktop Packaging:** Electron, electron-builder
* **3D Rendering:** Three.js, React Three Fiber, `@react-three/drei`
* **Voice Integration:** `@pipecat-ai/client-react`

## ⚙️ Development Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* A running instance of the Kara AI backend (see the root README for backend setup)

### Installation
1. Open a terminal and navigate to this `frontend` directory.
2. Install the required dependencies:
   ```bash
   npm install