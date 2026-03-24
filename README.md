<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Brawl Stars Mini - Melhorado</title>
  <style>
    body { margin:0; background:#111; overflow:hidden; touch-action:none; font-family: Arial, sans-serif; }
    canvas { display:block; margin:0 auto; background:#2a5; }
    #joystick {
      position: absolute;
      bottom: 30px;
      left: 30px;
      width: 130px;
      height: 130px;
      background: rgba(255,255,255,0.25);
      border: 3px solid rgba(255,255,255,0.6);
      border-radius: 50%;
      display: none;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    #fire {
      position: absolute;
      bottom: 40px;
      right: 40px;
      width: 90px;
      height: 90px;
      background: rgba(255,50,50,0.5);
      border: 4px solid #ff0;
      border-radius: 50%;
      display: none;
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-shadow: 0 0 10px black;
    }
    #score {
      position: absolute;
      top: 15px;
      left: 20px;
      color: white;
      font-size: 28px;
      font-weight: bold;
      text-shadow: 2px 2px 4px black;
    }
  </style>
</head>
<body>

  <div id="score">Score: 0</div>
  <canvas id="game"></canvas>

  <div id="joystick"></div>
  <div id="fire">🔫</div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    let player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 28,
      speed: 4.5,
      color: '#00aaff',
      health: 100,
      angle: 0
    };

    let bullets = [];
    let enemies = [];
    let particles = [];
    let score = 0;
    let keys = {};
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let lastShot = 0;
    const shootCooldown = 250; // ms

    // Controles touch
    let joystickActive = false;
    let joystickX = 0, joystickY = 0;
    let joyCenterX = 0, joyCenterY = 0;

    const joystickDiv = document.getElementById('joystick');
    const fireDiv = document.getElementById('fire');
    const scoreDiv = document.getElementById('score');

    function spawnEnemy() {
      const side = Math.random() < 0.5 ? -30 : canvas.width + 30;
      enemies.push({
        x: side,
        y: Math.random() * canvas.height,
        size: 24,
        speed: 1.8,
        color: '#ff4444',
        health: 60
      });
    }

    function shoot() {
      const now = Date.now();
      if (now - lastShot < shootCooldown) return;
      lastShot = now;

      const dx = mouseX - player.x;
      const dy = mouseY - player.y;
      const dist = Math.hypot(dx, dy) || 1;

      bullets.push({
        x: player.x,
        y: player.y,
        vx: (dx / dist) * 11,
        vy: (dy / dist) * 11,
        size: 7,
        life: 70
      });
    }

    function createParticles(x, y) {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 25 + Math.random() * 15,
          color: `hsl(${Math.random()*60}, 100%, 60%)`
        });
      }
    }

    function gameLoop() {
      ctx.fillStyle = '#2a5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Movimento jogador
      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      if (joystickActive) {
        dx += joystickX;
        dy += joystickY;
      }

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        player.x += (dx / len) * player.speed;
        player.y += (dy / len) * player.speed;
      }

      player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
      player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

      // Atualiza ângulo do jogador
      player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);

      // Desenha jogador (estilo mais Brawl Stars)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(0, 0, player.size/2, 0, Math.PI*2);
      ctx.fill();

      // Olhos
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(8, -8, 6, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, 8, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(10, -8, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(10, 8, 3, 0, Math.PI*2); ctx.fill();

      // Arma
      ctx.fillStyle = '#ddd';
      ctx.fillRect(12, -6, 22, 12);
      ctx.restore();

      // Balas
      for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life--;

        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
        ctx.fill();

        if (b.life <= 0 || b.x < -10 || b.x > canvas.width + 10 || b.y < -10 || b.y > canvas.height + 10) {
          bullets.splice(i, 1);
        }
      }

      // Inimigos
      for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];

        const edx = player.x - e.x;
        const edy = player.y - e.y;
        const elen = Math.hypot(edx, edy) || 1;
        e.x += (edx / elen) * e.speed;
        e.y += (edy / elen) * e.speed;

        // Desenha inimigo
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size/2, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(e.x - 7, e.y - 6, 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e.x + 7, e.y - 6, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(e.x - 6, e.y - 6, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(e.x + 8, e.y - 6, 2.5, 0, Math.PI*2); ctx.fill();

        // Colisão bala → inimigo
        for (let j = bullets.length - 1; j >= 0; j--) {
          let b = bullets[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < e.size/2 + b.size) {
            e.health -= 30;
            bullets.splice(j, 1);
            createParticles(e.x, e.y);
          }
        }

        if (e.health <= 0) {
          score += 10;
          scoreDiv.textContent = `Score: ${score}`;
          createParticles(e.x, e.y);
          enemies.splice(i, 1);
          continue;
        }

        // Colisão jogador → inimigo
        if (Math.hypot(player.x - e.x, player.y - e.y) < player.size/2 + e.size/2) {
          player.health -= 0.6;
        }
      }

      // Partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vx *= 0.96;
        p.vy *= 0.96;

        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 6, 6);

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      // Barra de vida
      const healthWidth = (player.health / 100) * 300;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(canvas.width/2 - 152, 20, 304, 24);
      ctx.fillStyle = player.health > 30 ? '#00ff44' : '#ff0000';
      ctx.fillRect(canvas.width/2 - 150, 22, healthWidth, 20);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Vida', canvas.width/2, 18);

      // Game Over
      if (player.health <= 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff3366';
        ctx.font = 'bold 70px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 40);

        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Score Final: ${score}`, canvas.width/2, canvas.height/2 + 30);
        ctx.fillText('Toque ou clique para jogar novamente', canvas.width/2, canvas.height/2 + 80);
        return;
      }

      // Spawn inimigos
      if (Math.random() < 0.025 && enemies.length < 10) spawnEnemy();

      requestAnimationFrame(gameLoop);
    }

    // ====================== CONTROLES ======================
    window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    function updateAim(x, y) {
      mouseX = x;
      mouseY = y;
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      updateAim(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('click', shoot);

    // Touch
    if ('ontouchstart' in window) {
      joystickDiv.style.display = 'block';
      fireDiv.style.display = 'flex';
    }

    joystickDiv.addEventListener('touchstart', e => {
      e.preventDefault();
      joystickActive = true;
      const rect = joystickDiv.getBoundingClientRect();
      joyCenterX = rect.left + 65;
      joyCenterY = rect.top + 65;
    });

    window.addEventListener('touchmove', e => {
      if (!joystickActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      let dx = touch.clientX - joyCenterX;
      let dy = touch.clientY - joyCenterY;
      const dist = Math.min(55, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      joystickX = Math.cos(angle) * (dist / 55);
      joystickY = Math.sin(angle) * (dist / 55);
    });

    window.addEventListener('touchend', () => {
      joystickActive = false;
      joystickX = joystickY = 0;
    });

    fireDiv.addEventListener('touchstart', e => {
      e.preventDefault();
      shoot();
    });

    canvas.addEventListener('touchstart', e => {
      const rect = canvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      updateAim(tx, ty);
      shoot();
    });

    // Reinicia após Game Over
    function resetGame() {
      if (player.health > 0) return;
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      player.health = 100;
      bullets = [];
      enemies = [];
      particles = [];
      score = 0;
      scoreDiv.textContent = 'Score: 0';
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