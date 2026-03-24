<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Brawl Stars Mini</title>
  <style>
    body { margin:0; background:#111; overflow:hidden; touch-action:none; }
    canvas { display:block; margin:0 auto; background:#2a5; }
    #joystick {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 120px;
      height: 120px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: none;
    }
    #fire {
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      background: rgba(255,0,0,0.4);
      border-radius: 50%;
      display: none;
    }
  </style>
</head>
<body>

  <canvas id="game"></canvas>

  <!-- Joystick virtual (para celular) -->
  <div id="joystick"></div>
  <div id="fire">🔫</div>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // Jogador
    let player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 25,
      speed: 4,
      color: '#00f',
      angle: 0,
      health: 100
    };

    let bullets = [];
    let enemies = [];
    let keys = {};
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // Controles touch
    let joystickActive = false;
    let joystickX = 0, joystickY = 0;
    let joyCenterX = 0, joyCenterY = 0;
    let firePressed = false;

    // Cria inimigos
    function spawnEnemy() {
      enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 22,
        speed: 1.5,
        color: '#f00',
        health: 50
      });
    }

    // Atira
    function shoot() {
      const dx = mouseX - player.x;
      const dy = mouseY - player.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      bullets.push({
        x: player.x,
        y: player.y,
        vx: (dx / dist) * 10,
        vy: (dy / dist) * 10,
        size: 8,
        life: 60
      });
    }

    // Loop principal
    function gameLoop() {
      // Limpa tela
      ctx.fillStyle = '#2a5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Movimento do jogador (teclado)
      let dx = 0, dy = 0;
      if (keys['w'] || keys['ArrowUp']) dy -= 1;
      if (keys['s'] || keys['ArrowDown']) dy += 1;
      if (keys['a'] || keys['ArrowLeft']) dx -= 1;
      if (keys['d'] || keys['ArrowRight']) dx += 1;

      // Movimento pelo joystick (touch)
      if (joystickActive) {
        dx += joystickX;
        dy += joystickY;
      }

      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx*dx + dy*dy);
        player.x += (dx / len) * player.speed;
        player.y += (dy / len) * player.speed;
      }

      // Limita jogador na tela
      player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
      player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

      // Desenha jogador
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      ctx.fillStyle = player.color;
      ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.size/4, -5, 15, 10); // "arma"
      ctx.restore();

      // Balas
      for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life--;

        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI*2);
        ctx.fill();

        if (b.life <= 0 || b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
          bullets.splice(i, 1);
        }
      }

      // Inimigos
      for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];

        // Move inimigo na direção do jogador
        const edx = player.x - e.x;
        const edy = player.y - e.y;
        const elen = Math.sqrt(edx*edx + edy*edy) || 1;
        e.x += (edx / elen) * e.speed;
        e.y += (edy / elen) * e.speed;

        // Desenha inimigo
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size/2, 0, Math.PI*2);
        ctx.fill();

        // Colisão com balas
        for (let j = bullets.length - 1; j >= 0; j--) {
          let b = bullets[j];
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.size/2 + b.size) {
            e.health -= 25;
            bullets.splice(j, 1);
          }
        }

        if (e.health <= 0) {
          enemies.splice(i, 1);
          continue;
        }

        // Colisão com jogador
        const pdist = Math.hypot(player.x - e.x, player.y - e.y);
        if (pdist < player.size/2 + e.size/2) {
          player.health -= 0.5; // dano por segundo
        }
      }

      // Vida do jogador
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Vida: ${Math.max(0, Math.floor(player.health))}`, 20, 40);

      if (player.health <= 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        return;
      }

      // Gera inimigos aos poucos
      if (Math.random() < 0.02 && enemies.length < 8) spawnEnemy();

      requestAnimationFrame(gameLoop);
    }

    // ====================== CONTROLES ======================

    // Teclado
    window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    // Mouse / toque para mirar e atirar
    function updateAim(x, y) {
      mouseX = x;
      mouseY = y;
      player.angle = Math.atan2(y - player.y, x - player.x);
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      updateAim(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('click', () => shoot());

    // Touch para celular
    const joystickDiv = document.getElementById('joystick');
    const fireDiv = document.getElementById('fire');

    // Mostra controles touch em dispositivos móveis
    if ('ontouchstart' in window) {
      joystickDiv.style.display = 'block';
      fireDiv.style.display = 'block';
    }

    // Joystick touch
    joystickDiv.addEventListener('touchstart', e => {
      e.preventDefault();
      joystickActive = true;
      const rect = joystickDiv.getBoundingClientRect();
      joyCenterX = rect.left + 60;
      joyCenterY = rect.top + 60;
    });

    window.addEventListener('touchmove', e => {
      if (!joystickActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      let dx = touch.clientX - joyCenterX;
      let dy = touch.clientY - joyCenterY;
      const dist = Math.min(50, Math.hypot(dx, dy));
      const angle = Math.atan2(dy, dx);
      joystickX = Math.cos(angle) * (dist / 50);
      joystickY = Math.sin(angle) * (dist / 50);
    });

    window.addEventListener('touchend', () => {
      joystickActive = false;
      joystickX = joystickY = 0;
    });

    // Botão de atirar
    fireDiv.addEventListener('touchstart', e => {
      e.preventDefault();
      firePressed = true;
      shoot();
    });
    fireDiv.addEventListener('touchend', () => firePressed = false);

    // Toque direto na tela também atira (opcional)
    canvas.addEventListener('touchstart', e => {
      const rect = canvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      updateAim(tx, ty);
      shoot();
    });

    // Inicia o jogo
    for (let i = 0; i < 3; i++) spawnEnemy();
    gameLoop();
  </script>
</body>
</html>