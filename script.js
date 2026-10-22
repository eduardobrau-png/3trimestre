const canvas = document.getElementById("footballGame");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const gameContainer = document.getElementById("game-container");

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

// Configurações do Jogador
let player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    width: 80,
    height: 15,
    color: "#2196f3"
};

// Configurações do Gol
let goal = {
    x: canvas.width / 4,
    y: 0,
    width: canvas.width / 2,
    height: 15
};

// Lógica para ativar/desativar Tela Cheia ao clicar no botão
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        // Se não estiver em tela cheia, ativa no container do jogo
        gameContainer.requestFullscreen().catch(err => {
            alert(`Erro ao tentar ativar tela cheia: ${err.message}`);
        });
    } else {
        // Se já estiver em tela cheia, sai dela
        document.exitFullscreen();
    }
});

// Movimentação ajustada para calcular a posição do mouse corretamente em qualquer tamanho de tela
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    
    // Esse cálculo corrige a proporção caso o canvas seja esticado na tela cheia
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    
    player.x = mouseX - player.width / 2;

    // Limites das laterais
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

// Movimento por toque no celular
canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    
    player.x = touchX - player.width / 2;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
});

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedY = 4;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

function update() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX = -ball.speedX;
    }

    if (ball.y - ball.radius < 0) {
        if (ball.x > goal.x && ball.x < goal.x + goal.width) {
            score++;
            scoreDisplay.textContent = score;
            resetBall();
        } else {
            ball.speedY = -ball.speedY;
        }
    }

    if (ball.y + ball.radius > player.y && 
        ball.y - ball.radius < player.y + player.height &&
        ball.x > player.x && 
        ball.x < player.x + player.width) {
        
        ball.speedY = -Math.abs(ball.speedY);
        ball.speedY -= 0.2;
        ball.speedX += (ball.speedX > 0 ? 0.2 : -0.2);
    }

    if (ball.y - ball.radius > canvas.height) {
        score = 0;
        scoreDisplay.textContent = score;
        resetBall();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linhas do campo
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Gol adversário
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bola
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
