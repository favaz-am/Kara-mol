# 🧠 Kara AI - Backend Server

This directory contains the Python backend server for Kara AI. It manages real-time, low-latency voice streaming, AI model routing, and WebSocket communication with the Electron/React desktop client using the Pipecat framework.

## 🛠️️ Tech Stack
* **Language:** Python 3.10+ (Developed on Python 3.13)
* **AI & Voice Framework:** Pipecat (`pipecat-ai`)
* **Communication:** WebSockets
* **Environment Management:** `python-dotenv`, `venv`

## ⚙️ Development Setup

### Prerequisites
* Python 3.10 or higher installed on your machine
* Valid API keys for the configured LLM, STT (Speech-to-Text), and TTS (Text-to-Speech) services

### 1. Create a Virtual Environment
Open a terminal, navigate to the `backend` directory, and create an isolated Python environment:

```bash
cd backend
python -m venv venv