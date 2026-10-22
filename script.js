const canvas = document.getElementById("footballGame");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

let score = 0;

// Configurações da Bola
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    speedX: 4,
    speedY: 4,
    color: "#ffffff"
};

// Configurações do Jogador (Barra preta/azul na parte inferior)
let player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    width: 80,
    height: 15,
    color: "#0d47a1"
};

// Configurações do Gol (Na parte superior da tela)
let goal = {
    x: canvas.width / 4,
    y: 0,
    width: canvas.width / 2,
    height: 15
};

// Movimentação do jogador usando o movimento do mouse
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    // Centraliza o jogador na posição X do mouse
    player.x = e.clientX - rect.left - player.width / 2;

    // Impede o jogador de sair das laterais do campo
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

// Suporte para telas de celular (Toque)
canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    player.x = touch.clientX - rect.left - player.width / 2;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

// Reinicia a bola após um gol ou quando ela sai do campo
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedY = 4; // Volta a ir para baixo
    // Direção aleatória na horizontal
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

// Atualiza a lógica de física do jogo
function update() {
    // Movimenta a bola
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Colisão da bola com as paredes laterais (esquerda e direita)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX = -ball.speedX;
    }

    // Colisão com a parede superior (mas fora do gol)
    if (ball.y - ball.radius < 0) {
        // Se estiver dentro da largura do gol, é GOOOOL!
        if (ball.x > goal.x && ball.x < goal.x + goal.width) {
            score++;
            scoreDisplay.textContent = score;
            resetBall();
        } else {
            // Se bater na parede superior fora do gol, ela rebate
            ball.speedY = -ball.speedY;
        }
    }

    // Colisão com o jogador
    if (ball.y + ball.radius > player.y && 
        ball.y - ball.radius < player.y + player.height &&
        ball.x > player.x && 
        ball.x < player.x + player.width) {
        
        // Inverte a direção vertical
        ball.speedY = -Math.abs(ball.speedY);
        // Aumenta ligeiramente a velocidade para o jogo ficar desafiador
        ball.speedY -= 0.2;
        ball.speedX += (ball.speedX > 0 ? 0.2 : -0.2);
    }

    // Se o jogador deixar a bola passar (Saiu por baixo)
    if (ball.y - ball.radius > canvas.height) {
        // Reseta o placar e reinicia
        score = 0;
        scoreDisplay.textContent = score;
        resetBall();
    }
}

// Desenha os elementos na tela
function draw() {
    // Limpa o campo para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linhas do campo de futebol (Apenas visual)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 3;
    // Linha do meio de campo
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    // Círculo central
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Desenha o Gol adversário (Rede Branca)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Desenha o Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Desenha a Bola de Futebol
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Loop principal do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();

