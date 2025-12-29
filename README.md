# 🎮 Rock Paper Scissors Gesture Game

AI-powered rock-paper-scissors game using hand gesture recognition with TensorFlow.js

## 🚀 Quick Start

### Option 1: Play Online (Easiest)
Visit: **https://digitalmagiccasterdelorean.github.io/tm_posegame_p1/**

> Note: You need to enable GitHub Pages first (Settings → Pages → Select "main" branch)

### Option 2: Run Locally

#### Windows Users:
1. Double-click `Start_RPS_Game.bat`
2. Open browser to `http://localhost:8000`

#### Mac/Linux Users:
```bash
cd tm_posegame_p1
npx http-server -p 8000
```
Then open `http://localhost:8000` in your browser

## 🎯 How to Play

1. Click **"게임 시작"** (Start Game)
2. Allow webcam access
3. Follow the on-screen instructions
4. Show your hand gesture during "DRAW!!"
   - ✌️ 가위 (Scissors)
   - ✊ 바위 (Rock)
   - ✋ 보자기 (Paper)

## 📋 Requirements

- Modern web browser (Chrome, Edge, Firefox)
- Webcam
- For local server: Node.js (for npx http-server)

## 🛠️ Tech Stack

- TensorFlow.js (Image Recognition)
- Teachable Machine
- HTML/CSS/JavaScript
- No backend required!

## 📁 Project Structure

```
tm_posegame_p1/
├── RPS_tensorflow.js/     # TensorFlow.js model
├── css/style.css          # Game styling
├── js/
│   ├── imageEngine.js     # Image recognition
│   ├── gameEngine.js      # Game logic
│   ├── main.js           # Main controller
│   └── stabilizer.js     # Prediction stabilizer
├── index.html            # Game UI
├── Start_RPS_Game.bat    # Windows launcher
└── start_game_server.ps1 # Server script
```

## 📝 License

See GAME_RULE.md for game rules and project details.
