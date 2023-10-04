const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const balloonRadius = 30;
const projectileRadius = 5;

let balloons = [];
let projectiles = [];
let score = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Balloon starting position
const startX = canvas.width / 2;
const startY = canvas.height;

function createBalloon() {
    // const x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
    // const y = canvas.height + balloonRadius;
    const x = 0 + balloonRadius;
    const y = canvas.height / 2 + balloonRadius;
    const speed = -2; // Rychlost, kterou se balónky pohybují
    balloons.push({x, y, speed});
}

function createProjectile(x, y, vecX, vecY) {
    // x, y - start position
    // vecX, vecY - movement vector
    projectiles.push({x, y, vecX, vecY});
}

function drawBalloon(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, balloonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Funkce pro výpočet y-ové pozice balónku na zakroucené trase
function calculateBalloonYPosition(x) {
    // Například sinusová funkce pro zakroucený pohyb
    return window.innerHeight / 2 + Math.sin(x / 100) * 100;
}

function drawProjectile(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, projectileRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawPath() {
    let counter = 0, x = 0, y = 180;
    //100 iterations
    const increase = 90 / 180 * Math.PI / 10;
    let i;
    for (i = 0; i <= canvas.width; i += 10) {
        // place the cursor from the point the line should be started
        ctx.moveTo(x, y);
        x = i;
        // amplitude
        y = calculateBalloonYPosition(x);
        counter += increase;
        ctx.lineWidth = 2;
        // draw a line from current cursor position to the provided x,y coordinate
        ctx.lineTo(x, y);
        // alert(" x : " + x + " y : " + y);
    }
    // add stroke to the line -> draw
    ctx.stroke();
}

function updateGameArea() {
    if (score > 10) {
        // Hra se zastaví, pokud je skóre větší než 10
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPath();

    // Vykreslit balónky
    for (let i = 0; i < balloons.length; i++) {
        // calculate position of balloon by function
        balloons[i].y = calculateBalloonYPosition(balloons[i].x);
        balloons[i].x -= balloons[i].speed;
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

        projectiles[i].x += projectiles[i].vecX;
        projectiles[i].y += projectiles[i].vecY;
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
    ctx.fillText('Score: ' + score, 20, 40);

    requestAnimationFrame(updateGameArea); // "nekonečná" smyčka
}

canvas.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // lineární transformace pro pohyb projektilu

    // Výpočet směru pohybu projektilu
    const dx = mouseX - (canvas.width / 2); // Rozdíl x-ových souřadnic
    const dy = mouseY - canvas.height; // Rozdíl y-ových souřadnic
    const distance = Math.sqrt(dx * dx + dy * dy); // Vzdálenost mezi bodem střelby a myší

    // Normalizace směru na délku 1 a následná aktualizace polohy projektilu
    const speed = 5; // Rychlost pohybu projektilu
    const velocityX = (dx / distance) * speed;
    const velocityY = (dy / distance) * speed;

    // Projektil se pohybuje směrem k myši s rychlostí speed
    createProjectile(startX, startY, velocityX, velocityY);
});

updateGameArea(); // play
