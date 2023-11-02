import {calculateBalloonYPosition} from "./balloonService.js";
import {addPointToNonPlaceAbleArray} from "./entityService.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const pathTile = new Image();
pathTile.src = 'img/pathTitle.png';
// pathTile.src = 'img/castle1.png';

// const pattern = ctx.createPattern(pathTile, "repeat");

// Velikost dlaždice cesty
const tileSize = 50;

/**
 * Draw Path for graphical visualisation
 */
export function drawPath() {
    let x = 0, y = 180;
    let pathWidth = canvas.width + (0.01 * canvas.width);
    for (let i = 0; i <= pathWidth; i += 10) {
        // same function as for balloons
        y = calculateBalloonYPosition(i) - (tileSize / 2);
        x = i - (tileSize / 2);
        ctx.drawImage(pathTile, x, y, tileSize, tileSize); // Vykreslit dlaždici
        // !!! be carefull ... Add points to entity notPlaceAble arr
        addPointToNonPlaceAbleArray(x, y);
    }
    ctx.stroke();
}

/**
 * Draw simple Path line for graphical visualisation
 */
export function drawPathSimpleLine() {
    let x = 0, y = 180;
    let pathWidth = canvas.width + (0.01 * canvas.width);
    for (let i = 0; i <= pathWidth; i += 10) {
        // place the cursor from the point the line should be started
        ctx.moveTo(x, y);
        x = i;
        y = calculateBalloonYPosition(x);
        ctx.lineWidth = 2;
        ctx.lineTo(x, y);
        addPointToNonPlaceAbleArray(x, y);
    }
    ctx.stroke();
}

export function maskMap() {
    let thickness = 25;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    ctx.beginPath();

    for (let x = 0; x <= canvasWidth + 10; x += 10) {
        const y = calculateBalloonYPosition(x) - thickness;

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    // Vykreslení dolní hrany lichoběžníku
    for (let x = canvasWidth + 10; x >= -10; x -= 10) {
        const y = calculateBalloonYPosition(x) + thickness;

        ctx.lineTo(x, y);
    }

    // Uzavření cesty
    ctx.closePath();

    // Vyplnění lichoběžníku žlutou barvou
    ctx.fillStyle = '#e0a502';
    ctx.fill();
}

// Add Points ----------------------------
function addPointsOnSimplePath() {
    let pathWidth = canvas.width + (0.01 * canvas.width);
    for (let i = 0; i <= pathWidth; i += 10) {
        addPointToNonPlaceAbleArray(i, calculateBalloonYPosition(i));
    }
}

// Add Points ----------------------------
addPointsOnSimplePath()