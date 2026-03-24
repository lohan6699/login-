<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Brawl Stars Mini - Com Mapa e Paredes</title>
  <style>
    body { margin:0; background:#111; overflow:hidden; touch-action:none; font-family: Arial, sans-serif; }
    canvas { display:block; margin:0 auto; background:#2a5; }
    #joystick {
      position: absolute; bottom: 30px; left: 30px;
      width: 130px; height: 130px;
      background: rgba(255,255,255,0.25);
      border: 3px solid rgba(255,255,255,0.6);
      border-radius: 50%;
      display: none;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    #fire {
      position: absolute; bottom: 40px; right: 40px;
      width: 90px; height: 90px;
      background: rgba(255,50,50,0.5);
      border: 4px solid #ff0;
      border-radius: 50%;
      display: none;
      font-size: 40px;
      align-items: center;
      justify-content: center;
      color: white;
      text-shadow: 0 0 10px black;
    }
    #score {
      position: absolute; top: 15px; left: 20px;
      color: white; font-size: 28px; font-weight: bold;
      text-shadow: 2px 2px 4px black;
    }
    #superBar {
      position: absolute; top: 55px; left: 20px;
      width: 220px; height: 20px;
      background: rgba(0,0,0,0.6);
      border: 3px solid #00ffff;
      border-radius: 10px;
      overflow: hidden;
    }
    #superFill {
      width: 0%; height: 100%;
      background: linear-gradient(90deg, #00ffff, #0088ff);
    }
    #superText {
      position: absolute; top: 80px; left: 20px;
      color: #00ffff; font-size: 18px; font-weight: bold;
      text-shadow: 0 0 8px #00ffff;
      opacity: 0;
      transition: opacity 0.4s;
    }
  </style>
</head>
<body>

  <div id="score">Score: 0</div>
  <div id="superBar"><div id="superFill"></div></div>
  <div id="superText">SUPER PRONTO!</div>

  <canvas id="game"></canvas>
  <div id="joystick"></div>
  <div id="fire">🔫</div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    let player = { x: 400, y: 300, size: 28, speed: 4.5, color: '#00aaff', health: 100, angle: 0 };

    let bullets = [], enemies = [], particles = [], score = 0, superCharge = 0;
    let isSuperReady = false;
    let keys = {};
    let mouseX = 400, mouseY = 300;
    let lastShot = 0;
    const shootCooldown = 220;

    let joystickActive = false, joystickX = 0, joystickY = 0, joyCenterX = 0, joyCenterY = 0;

    const scoreDiv = document.getElementById('score');
    const superFill = document.getElementById('superFill');
    const superText = document.getElementById('superText');

    // ====================== PAREDES ======================
    const walls = [
      {x: 200, y: 180, w: 400, h: 25},   // horizontal superior
      {x: 200, y: 395, w: 400, h: 25},   // horizontal inferior
      {x: 180, y: 200, w: 