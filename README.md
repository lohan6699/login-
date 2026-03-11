!<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Squirtle Animado CSS</title>
  <style>
    body {
      height: 100vh;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #a1d4ff;
      background: linear-gradient(to bottom, #a1d4ff 0%, #6ab7f5 100%);
      font-family: Arial, Helvetica, sans-serif;
      overflow: hidden;
    }

    .squirtle {
      position: relative;
      width: 240px;
      height: 280px;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-12px); }
    }

    /* Cabeça */
    .head {
      width: 170px;
      height: 145px;
      background: #4a90e2;
      border-radius: 50% 50% 40% 40%;
      position: absolute;
      top: 20px;
      left: 35px;
      border: 5px solid #2c5aa0;
      box-shadow: inset 0 10px 20px #6ab7f5;
      animation: head-sway 8s ease-in-out infinite;
      transform-origin: bottom center;
    }

    @keyframes head-sway {
      0%, 100% { transform: rotate(-2deg); }
      50%      { transform: rotate(2deg); }
    }

    /* Corpo */
    .body {
      width: 190px;
      height: 150px;
      background: #4a90e2;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      left: 25px;
      border: 5px solid #2c5aa0;
      box-shadow: inset 0 -10px 30px #6ab7f5;
      animation: breathe 7s ease-in-out infinite;
    }

    @keyframes breathe {
      0%, 100% { transform: scaleY(1); }
      50%      { transform: scaleY(1.04); }
    }

    /* Rabo */
    .tail {
      width: 100px;
      height: 100px;
      background: #4a90e2;
      border-radius: 50% 50% 50% 0;
      position: absolute;
      bottom: 35px;
      left: -35px;
      border: 5px solid #2c5aa0;
      border-right: none;
      border-bottom: none;
      transform-origin: top right;
      animation: wag 3.5s ease-in-out infinite;
    }

    @keyframes wag {
      0%, 100% { transform: rotate(-30deg); }
      50%      { transform: rotate(-45deg); }
    }

    .tail::before {
      content: "";
      width: 65px;
      height: 65px;
      background: #4a90e2;
      border: 5px solid #2c5aa0;
      border-radius: 50%;
      position: absolute;
      bottom: -18px;
      right: -12px;
      transform: rotate(60deg);
    }

    /* Olhos */
    .eye {
      width: 45px;
      height: 52px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 55px;
      border: 4px solid #2c5aa0;
      overflow: hidden;
    }
    .eye.left  { left: 50px; }
    .eye.right { right: 50px; }

    .pupil {
      width: 24px;
      height: 28px;
      background: #2c5aa0;
      border-radius: 50%;
      position: absolute;
      top: 12px;
      left: 10px;
      animation: blink 10s infinite;
      transform-origin: center;
    }

    @keyframes blink {
      0%, 4%, 8%, 92%, 96%, 100% { transform: scaleY(1); }
      5%, 95% { transform: scaleY(0.1); }
    }

    .pupil::after {
      content: "";
      width: 11px;
      height: 11px;
      background: black;
      border-radius: 50%;
      position: absolute;
      top: 7px;
      right: 5px;
    }

    /* Boca */
    .mouth {
      width: 65px;
      height: 32px;
      border-bottom: 5px solid #2c5aa0;
      border-radius: 0 0 50% 50%;
      position: absolute;
      top: 105px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* Casco */
    .shell-top {
      width: 200px;
      height: 115px;
      background: #f4a460;
      border: 5px solid #8b5a2b;
      border-radius: 50% 50% 40% 40%;
      position: absolute;
      bottom: 65px;
      left: 20px;
    }

    .shell-pattern {
      position: absolute;
      inset: 10px;
      background: 
        radial-gradient(circle at 30% 40%, #deb887 0%, #deb887 20%, transparent 21%),
        radial-gradient(circle at 70% 35%, #deb887 0%, #deb887 18%, transparent 19%),
        radial-gradient(circle at 50% 70%, #deb887 0%, #deb887 22%, transparent 23%);
      border-radius: inherit;
    }

    .shell-bottom {
      width: 180px;
      height: 55px;
      background: #cd853f;
      border: 5px solid #8b5a2b;
      border-radius: 50%;
      position: absolute;
      bottom: 15px;
      left: 30px;
    }
  </style>
</head>
<body>

<div class="squirtle">
  <div class="tail"></div>
  <div class="body"></div>
  <div class="shell-bottom"></div>
  <div class="shell-top">
    <div class="shell-pattern"></div>
  </div>
  <div class="head">
    <div class="eye left"><div class="pupil"></div></div>
    <div class="eye right"><div class="pupil"></div></div>
    <div class="mouth"></div>
  </div>
</div>

</body>
</html>