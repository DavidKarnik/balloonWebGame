import {drawBuyMenu, drawEntities} from './entityService.js';
import {dealDamage, drawCastle, drawHealthBar, getCurrentHealth} from "./healthService.js"; // Import funkce

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const balloonRadius = 30;
const projectileRadius = 5;

let balloons = [];
let projectiles = [];

export

// Player score
// TODO add buy logic for entities
let cash = 0;

let level = 0;

// Canvas parameters
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Projectile starting position
let startX = canvas.width / 2;
let startY = canvas.height;

/**
 * Create new Balloon and save to the array
 */
function createBalloon() {
    // const x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
    // const y = canvas.height + balloonRadius;
    const x = 0 - balloonRadius;
    const y = canvas.height / 2 + balloonRadius;
    const speed = -1; // Rychlost, kterou se balónky pohybují
    balloons.push({x, y, speed});
}

/**
 * Create new Projectile and save to the array
 * @param x - x start coordination
 * @param y - y start coordination
 * @param vecX - x coordination of vector for movement
 * @param vecY - y coordination of vector for movement
 */
function createProjectile(x, y, vecX, vecY) {
    // x, y - start position
    // vecX, vecY - movement vector
    projectiles.push({x, y, vecX, vecY});
}

/**
 * Draw Balloon to canvas
 * @param x - x coordination of balloon
 * @param y - y coordination of balloon
 */
function drawBalloon(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, balloonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

/**
 * Funkce pro výpočet y-ové pozice balónku na zakroucené trase
 * @param x - x coordination of balloon
 * @return y - by sinus fn(x)
 */
function calculateBalloonYPosition(x) {
    // Zde změňte rozsah sinusového pohybu
    const amplitude = 200; // Amplituda sinusového pohybu
    const frequency = 0.01; // Frekvence sinusového pohybu
    return window.innerHeight / 2 + amplitude * Math.sin(frequency * x);
}

/**
 * Draw Projectile to canvas
 * @param x - x coordination of projectile
 * @param y - y coordination of projectile
 */
function drawProjectile(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, projectileRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

/**
 * Draw Path for graphical visualisation
 */
function drawPath() {
    let counter = 0, x = 0, y = 180;
    //100 iterations
    const increase = 90 / 180 * Math.PI / 10;
    let i;
    let pathWidth = canvas.width + (0.01 * canvas.width);
    for (i = 0; i <= pathWidth; i += 10) {
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

function printWave(ctx, canvas, level) {
    let x = canvas.width - 130;
    let y = 40;
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Wave: ' + level, x, y);
}

/**
 * Main function for Refresh Game Canvas and all data
 */
function updateGameArea() {
    // GAME variables -------------------------------------------------------------------------------
    let xH = canvas.width / 2; // Pozice X health baru
    let yH = 30; // Pozice Y health baru


    // GAME END conditions --------------------------------------------------------------------------
    // Hra se zastaví, pokud je skóre větší než 10
    // Hra se zastaví, životy jsou === 0
    if (cash > 10 ||
        getCurrentHealth() === 0) {
        // výsledný healtBar
        drawHealthBar(ctx, xH, yH)
        return;
    }

    // Refresh window parameters if changed
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Refresh Balloon starting position
    startX = canvas.width / 2;
    startY = canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawPath -------------------------------------------------------------------------------------
    drawPath();

    // drawSquare (shop) ----------------------------------------------------------------------------
    drawBuyMenu(ctx, canvas)

    drawEntities(ctx)

    // drawCastle and HealthBar ---------------------------------------------------------------------
    drawHealthBar(ctx, xH, yH)

    // Vykreslit balónky ----------------------------------------------------------------------------
    let exceptionPoppedBalloon = false;
    for (let i = 0; i < balloons.length; i++) {
        exceptionPoppedBalloon = false;
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
                cash++;
                i--; // o balonek méně
                exceptionPoppedBalloon = true;
                break;
            }
        }

        // Exception - balloon[i] already deleted in this loop -> undefined ------------------------
        if (!exceptionPoppedBalloon) {
            // Detekce kolize balonku se stěnou
            if (balloons[i].x >= canvas.width) {
                balloons.splice(i, 1);
                i--; // o balonek méně
                dealDamage(10);
                // console.log("balloon touch wall!")
            }
        }

        // Projectile touch the wall ? -------------------------------------------------------------
        for (let j = 0; j < projectiles.length; j++) {
            // Detekce kolize projectile se stěnou (right, bottom, left, up)
            if (projectiles[j].x > canvas.width ||
                projectiles[j].y > canvas.height ||
                projectiles[j].x < 0 ||
                projectiles[j].y < 0) {
                projectiles.splice(j, 1);
                // console.log("projectiles touch wall!")
            }
        }
    }

    // Vykreslit projektily ------------------------------------------------------------------------
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].x += projectiles[i].vecX;
        projectiles[i].y += projectiles[i].vecY;
        drawProjectile(projectiles[i].x, projectiles[i].y);
    }

    // Vytvoření nového balónku --------------------------------------------------------------------
    // setInterval(createBalloon, 1000);
    // Vytvořit nový balónek s pravděpodobností 2 % v každém snímku
    if (Math.random() < 0.02) {
        createBalloon();
    }

    // Write score info ----------------------------------------------------------------------------
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Cash: ' + cash, 20, 40);

    printWave(ctx, canvas, level);


    // ---------------------------------------------------------------------------------------------
    requestAnimationFrame(updateGameArea); // "nekonečná" smyčka, refresh by fps rate
}

/**
 * Create Projectile by Mouse Click event
 */
canvas.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // výpočet lineární transformace pro pohyb projektilu

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

// play --------------------------------------------------------------------------------------------
updateGameArea();
