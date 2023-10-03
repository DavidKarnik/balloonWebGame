const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const balloonRadius = 30;
const projectileRadius = 5;

let balloons = [];
let projectiles = [];
let score = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createBalloon() {
    const x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
    const y = canvas.height + balloonRadius;
    const dy = -2; // Rychlost, kterou balónky stoupají nahoru
    balloons.push({ x, y, dy });
}

function createProjectile(x, y) {
    projectiles.push({ x, y });
}

function drawBalloon(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, balloonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawProjectile(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, projectileRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function updateGameArea() {
    if (score > 10) {
        // Hra se zastaví, pokud je skóre větší než 10
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vykreslit balónky
    for (let i = 0; i < balloons.length; i++) {
        balloons[i].y += balloons[i].dy;
        drawBalloon(balloons[i].x, balloons[i].y);

        // Detekce kolize s projektily
        for (let j = 0; j < projectiles.length; j++) {
            const dx = balloons[i].x - projectiles[j].x;
            const dy = balloons[i].y - projectiles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < balloonRadius + projectileRadius) {
                // smazat konkretní entity z pole .splice(index od, kolik)
                balloons.splice(i, 1);
                projectiles.splice(j, 1);
                score++;
                i--; // o balonek méně
                break;
            }
        }
    }

    // Vykreslit projektily
    for (let i = 0; i < projectiles.length; i++) {
        // x souřadnice se nemění, pouze stoupá nahoru po y
        projectiles[i].y -= 5; // Rychlost projektilu
        drawProjectile(projectiles[i].x, projectiles[i].y);
    }

    // Vytvoření nového balónku každých 1000 ms
    // setInterval(createBalloon, 1000);
    // Vytvořit nový balónek s pravděpodobností 2 % v každém snímku
    if (Math.random() < 0.02) {
        createBalloon();
    }

    // Write score info
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 40);

    requestAnimationFrame(updateGameArea); // "nekonečná" smyčka
}

canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    createProjectile(x, y);
});

updateGameArea();
