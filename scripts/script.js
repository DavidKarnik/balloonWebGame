import {
    doLogicForGraphicRepresentation,
    drawBuyMenu, drawEntities, startShootingFunction, stopShootingFunction
} from './entityService.js';
import {dealDamage, drawCastle, drawHealthBar, getCurrentHealth, resetHealth} from "./healthService.js";
import {
    drawAllBalloons,
    calculateBalloonYPosition,
    createBalloon,
    balloons,
    clearBalloons,
    setUpravaRychlosti
} from "./balloonService.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const projectileRadius = 5;
let projectiles = [];

// Player score
// TODO add buy logic for entities
let cash = 30;

let level = 5;

let gameRunning = false
let gameOver = false

// Canvas parameters
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Projectile starting position
let startX = canvas.width / 2;
let startY = canvas.height;

let balloonCount = 1

// requestanimationframe() fasting exception
let zakladniIntervalOpakovani = 1000 / 60;
let casPoslednihoOpakovani = 0;
let dobaOdPoslednihoOpakovani = 0;

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
    //
    // Pokud je requestAnimationFrame() rychlejší nebo pomalejší
    // než předpokládáme, přizpůsobíme posun tak, aby byl vždy stejný.
    fixGameSpeed()

    // GAME variables -------------------------------------------------------------------------------
    let xH = canvas.width / 2; // Pozice X health baru
    let yH = 30; // Pozice Y health baru

    // GAME END conditions --------------------------------------------------------------------------
    // Hra se zastaví, životy jsou === 0
    if (getCurrentHealth() === 0) {
        // výsledný healtBar
        drawHealthBar(ctx, xH, yH)
        stopShootingFunction();
        gameOver = true
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
    drawAllBalloons()

    // start async function
    startShootingFunction()


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

    // Vykreslit projektily ------------------------------------------------------------------------
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].x += projectiles[i].vecX;
        projectiles[i].y += projectiles[i].vecY;
        drawProjectile(projectiles[i].x, projectiles[i].y);
    }

    // TODO - Create new Balloon logic
    // Vytvoření nového balónku --------------------------------------------------------------------
    // setInterval(createBalloon, 1000);
    // Vytvořit nový balónek s pravděpodobností 2 % v každém snímku
    if (Math.random() < 0.02 && balloonCount <= (level * 10)) {
        createBalloon();
        balloonCount++;
    }

    // Write score info ----------------------------------------------------------------------------
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Cash: ' + cash, 20, 40);

    printWave(ctx, canvas, level);

    // pokud je entita z shopu nakliknuta, vykreslí se její grafická reprezentace
    doLogicForGraphicRepresentation()

    // ---------------------------------------------------------------------------------------------
    requestAnimationFrame(updateGameArea); // "nekonečná" smyčka, refresh by fps rate
    // Warning: Be sure to always use the first argument (or some other method for getting the current time)
    // to calculate how much the animation will progress in a frame — otherwise the animation will run faster
    // on high refresh-rate screens. For ways to do that, see the examples below.
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
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

function nextWaveButton() {
    // Zde můžete provést akce pro novou vlnu hry
    console.log("Clicked Next Wave button");
    // Například spustit novou vlnu balónků, resetovat hru, atd.
    if (!gameRunning &&
        !gameOver) {
        console.log("Game Start");
        // restart, play
        // gameRunning = true
        balloonCount = 1
        clearBalloons()
        resetHealth()
        updateGameArea();
    }
}

// Připojení funkce k tlačítku po načtení stránky
document.addEventListener("DOMContentLoaded", function () {
    const nextWaveButtonElement = document.getElementById("nextWaveButton");

    if (nextWaveButtonElement) {
        nextWaveButtonElement.addEventListener("click", nextWaveButton);
    }
});

function fixGameSpeed() {
    if (casPoslednihoOpakovani) {
        dobaOdPoslednihoOpakovani = Date.now() - casPoslednihoOpakovani;
        // console.log("speed = " + (dobaOdPoslednihoOpakovani / zakladniIntervalOpakovani))
        setUpravaRychlosti(dobaOdPoslednihoOpakovani / zakladniIntervalOpakovani);
    }
    casPoslednihoOpakovani = Date.now();
}