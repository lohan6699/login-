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
      {x: 180, y: 200, w: 25, h: 200},   // vertical esquerda
      {x: 595, y: 200, w: 25, h: 200}    // vertical direita
    ];

    function rectCollide(a, b) {
      return !(a.x + a.size/2 < b.x || a.x - a.size/2 > b.x + b.w ||
               a.y + a.size/2 < b.y || a.y - a.size/2 > b.y + b.h);
    }

    function spawnEnemy() {
      let x, y;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } while (walls.some(w => rectCollide({x, y, size: 30}, w)));

      enemies.push({
        x: x < 100 ? -40 : canvas.width + 40,
        y: y,
        size: 24,
        speed: 1.7,
        color: '#ff4444',
        health: 65
      });
    }

    function shoot(isSuper = false) {
      const now = Date.now();
      if (!isSuper && now - lastShot < shootCooldown) return;
      lastShot = now;

      const dx = mouseX - player.x;
      const dy = mouseY - player.y;
      const dist = Math.hypot(dx, dy) || 1;

      bullets.push({
        x: player.x,
        y: player.y,
        vx: (dx / dist) * (isSuper ? 14 : 11),
        vy: (dy / dist) * (isSuper ? 14 : 11),
        size: isSuper ? 13 : 7,
        life: isSuper ? 90 : 70,
        damage: isSuper ? 55 : 30,
        color: isSuper ? '#00ffff' : '#ffff00',
        isSuper: isSuper
      });

      if (isSuper) {
        superCharge = 0;
        isSuperReady = false;
        superFill.style.width = '0%';
        superText.style.opacity = '0';
        createExplosion(player.x, player.y, '#00ffff', 40);
      }
    }

    function createExplosion(x, y, color, count = 15) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 5;
        particles.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 32, color });
      }
    }

    function gameLoop() {
      ctx.fillStyle = '#2a5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenha paredes (estilo Brawl Stars)
      ctx.fillStyle = '#1e4d2b';
      ctx.strokeStyle = '#0f2a18';
      ctx.lineWidth = 6;
      walls.forEach(w => {
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.strokeRect(w.x, w.y, w.w, w.h);
      });

      // Movimento jogador + colisão com paredes
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;
      if (joystickActive) { dx += joystickX; dy += joystickY; }

      if (dx || dy) {
        const len = Math.hypot(dx, dy);
        const newX = player.x + (dx / len) * player.speed;
        const newY = player.y + (dy / len) * player.speed;

        let canMoveX = true, canMoveY = true;
        const tempPlayer = {x: newX, y: player.y, size: player.size};
        const tempPlayerY = {x: player.x, y: newY, size: player.size};

        walls.forEach(w => {
          if (rectCollide(tempPlayer, w)) canMoveX = false;
          if (rectCollide(tempPlayerY, w)) canMoveY = false;
        });

        if (canMoveX) player.x = newX;
        if (canMoveY) player.y = newY;
      }

      player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);

      // Desenha Jogador
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      ctx.fillStyle = player.color;
      ctx.beginPath(); ctx.arc(0,0,14,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(9,-7,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(9,7,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(11,-7,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(11,7,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ddd';
      ctx.fillRect(15, -7, 25, 14);
      ctx.restore();

      // Balas + colisão com paredes
      for (let i = bullets.length-1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.vx; b.y += b.vy; b.life--;

        // Colisão com paredes
        let hitWall = false;
        walls.forEach(w => {
          if (b.x > w.x && b.x < w.x + w.w && b.y > w.y && b.y < w.y + w.h) hitWall = true;
        });

        if (hitWall || b.life <= 0 || b.x < -50 || b.x > canvas.width+50 || b.y < -50 || b.y > canvas.height+50) {
          bullets.splice(i,1);
          continue;
        }

        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI*2); ctx.fill();
      }

      // Inimigos
      for (let i = enemies.length-1; i >= 0; i--) {
        let e = enemies[i];
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const d = Math.hypot(dx, dy) || 1;
        let newX = e.x + (dx/d) * e.speed;
        let newY = e.y + (dy/d) * e.speed;

        // Colisão inimigo com paredes
        let canMove = true;
        walls.forEach(w => {
          if (rectCollide({x: newX, y: newY, size: e.size}, w)) canMove = false;
        });
        if (canMove) {
          e.x = newX;
          e.y = newY;
        }

        // Desenha inimigo
        ctx.fillStyle = e.color;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.size/2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(e.x-7,e.y-6,5,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e.x+7,e.y-6,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(e.x-6,e.y-6,2.5,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e.x+8,e.y-6,2.5,0,Math.PI*2); ctx.fill();

        // Colisão com balas
        for (let j = bullets.length-1; j >= 0; j--) {
          let b = bullets[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.size/2 + b.size) {
            e.health -= b.damage || 30;
            bullets.splice(j,1);
            createExplosion(e.x, e.y, '#ffaa00', 10);

            if (b.isSuper) {
              // Dano em área do Super
              enemies.forEach(en => {
                if (Math.hypot(en.x - e.x, en.y - e.y) < 90) en.health -= 25;
              });
            }
          }
        }

        if (e.health <= 0) {
          score += 10;
          scoreDiv.textContent = `Score: ${score}`;
          superCharge = Math.min(100, superCharge + 15);
          superFill.style.width = superCharge + '%';

          if (superCharge >= 100 && !isSuperReady) {
            isSuperReady = true;
            superText.style.opacity = '1';
            setTimeout(() => superText.style.opacity = '0', 1800);
          }

          createExplosion(e.x, e.y, '#ff5500', 28);
          enemies.splice(i,1);
          continue;
        }

        if (Math.hypot(player.x - e.x, player.y - e.y) < 38) player.health -= 0.4;
      }

      // Partículas
      for (let i = particles.length-1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--; p.vx *= 0.94; p.vy *= 0.94;
        ctx.globalAlpha = p.life / 35;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x-3, p.y-3, 7, 7);
        if (p.life <= 0) particles.splice(i,1);
      }
      ctx.globalAlpha = 1;

      // Barra de vida
      const hw = (player.health / 100) * 300;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(324, 20, 304, 24);
      ctx.fillStyle = player.health > 35 ? '#00ff44' : '#ff0000';
      ctx.fillRect(326, 22, hw, 20);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Vida', 476, 18);

      if (player.health <= 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#ff3366';
        ctx.font = 'bold 70px Arial';
        ctx.fillText('GAME OVER', 400, 270);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, 400, 340);
        ctx.fillText('Toque na tela para jogar novamente', 400, 390);
        return;
      }

      if (Math.random() < 0.025 && enemies.length < 8) spawnEnemy();

      requestAnimationFrame(gameLoop);
    }

    // ====================== CONTROLES ======================
    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && isSuperReady) shoot(true);
    });
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    function updateAim(x, y) { mouseX = x; mouseY = y; }

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      updateAim(e.clientX - r.left, e.clientY - r.top);
    });
    canvas.addEventListener('click', () => shoot(false));

    if ('ontouchstart' in window) {
      document.getElementById('joystick').style.display = 'block';
      document.getElementById('fire').style.display = 'flex';
    }

    const joystickDiv = document.getElementById('joystick');
    joystickDiv.addEventListener('touchstart', e => {
      e.preventDefault();
      joystickActive = true;
      const r = joystickDiv.getBoundingClientRect();
      joyCenterX = r.left + 65; joyCenterY = r.top + 65;
    });

    window.addEventListener('touchmove', e => {
      if (!joystickActive) return;
      const t = e.touches[0];
      let dx = t.clientX - joyCenterX;
      let dy = t.clientY - joyCenterY;
      const dist = Math.min(55, Math.hypot(dx, dy));
      const ang = Math.atan2(dy, dx);
      joystickX = Math.cos(ang) * (dist / 55);
      joystickY = Math.sin(ang) * (dist / 55);
    });

    window.addEventListener('touchend', () => { joystickActive = false; joystickX = joystickY = 0; });

    let holdTimer = null;
    document.getElementById('fire').addEventListener('touchstart', e => {
      e.preventDefault();
      holdTimer = setTimeout(() => { if (isSuperReady) shoot(true); }, 160);
    });
    document.getElementById('fire').addEventListener('touchend', () => {
      clearTimeout(holdTimer);
      if (!isSuperReady) shoot(false);
    });

    canvas.addEventListener('touchstart', e => {
      const r = canvas.getBoundingClientRect();
      updateAim(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
      shoot(false);
    });

    function resetGame() {
      if (player.health > 0) return;
      player.x = 400; player.y = 300; player.health = 100;
      bullets = []; enemies = []; particles = [];
      score = 0; superCharge = 0; isSuperReady = false;
      scoreDiv.textContent = 'Score: 0';
      superFill.style.width = '0%';
      superText.style.opacity = '0';
      for (let i = 0; i < 4; i++) spawnEnemy();
    }

    canvas.addEventListener('click', resetGame);
    canvas.addEventListener('touchstart', resetGame);

    // Início
    for (let i = 0; i < 4; i++) spawnEnemy();
    gameLoop();
  </script>
</body>
</html>