<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Squirtle CSS</title>
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
    }

    .squirtle {
      position: relative;
      width: 220px;
      height: 260px;
    }

    /* Cabeça */
    .head {
      width: 160px;
      height: 140px;
      background: #4a90e2;
      border-radius: 50% 50% 40% 40%;
      position: absolute;
      top: 20px;
      left: 30px;
      border: 5px solid #2c5aa0;
      box-shadow: inset 0 10px 20px #6ab7f5;
    }

    /* Barriga / corpo */
    .body {
      width: 180px;
      height: 140px;
      background: #4a90e2;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      left: 20px;
      border: 5px solid #2c5aa0;
      box-shadow: inset 0 -10px 30px #6ab7f5;
    }

    /* Rabo */
    .tail {
      width: 90px;
      height: 90px;
      background: #4a90e2;
      border-radius: 50% 50% 50% 0;
      position: absolute;
      bottom: 30px;
      left: -30px;
      border: 5px solid #2c5aa0;
      border-right: none;
      border-bottom: none;
      transform: rotate(-35deg);
    }

    .tail::before {
      content: "";
      width: 60px;
      height: 60px;
      background: #4a90e2;
      border: 5px solid #2c5aa0;
      border-radius: 50%;
      position: absolute;
      bottom: -15px;
      right: -10px;
      transform: rotate(60deg);
    }

    /* Olhos */
    .eye {
      width: 42px;
      height: 50px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 50px;
      border: 4px solid #2c5aa0;
    }
    .eye.left  { left: 45px; }
    .eye.right { right: 45px; }

    .pupil {
      width: 22px;
      height: 26px;
      background: #2c5aa0;
      border-radius: 50%;
      position: absolute;
      top: 12px;
      left: 10px;
    }
    .pupil::after {
      content: "";
      width: 10px;
      height: 10px;
      background: black;
      border-radius: 50%;
      position: absolute;
      top: 6px;
      right: 4px;
    }

    /* Boca / expressão */
    .mouth {
      width: 60px;
      height: 30px;
      border-bottom: 5px solid #2c5aa0;
      border-radius: 0 0 50% 50%;
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
    }

    /* Casco (parte de cima) */
    .shell-top {
      width: 190px;
      height: 110px;
      background: #f4a460;
      border: 5px solid #8b5a2b;
      border-radius: 50% 50% 40% 40%;
      position: absolute;
      bottom: 60px;
      left: 15px;
    }

    /* Detalhes do casco */
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
      width: 170px;
      height: 50px;
      background: #cd853f;
      border: 5px solid #8b5a2b;
      border-radius: 50%;
      position: absolute;
      bottom: 10px;
      left: 25px;
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