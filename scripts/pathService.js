import {calculateBalloonYPosition} from "./balloonService.js";
import {addPointToNonPlaceAbleArray} from "./entityService.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const pathTile = new Image();
pathTile.src = 'img/pathTitle.png';

// Velikost dlaždice cesty
const tileSize = 50;

/**
 * Draw Path for graphical visualisation
 */
export function drawPath() {
    let x = 0, y = 180;
    let pathWidth = canvas.width + (0.01 * canvas.width);
    for (let i = 0; i <= pathWidth; i += 10) {
        // place the cursor from the point the line should be started
        ctx.moveTo(x, y);
        x = i;
        // amplitude - same function as for balloons
        y = calculateBalloonYPosition(x);
        ctx.drawImage(pathTile, x, y, tileSize, tileSize); // Vykreslit dlaždici
        // !!! be carefull ... Add points to entity notPlaceAble arr
        addPointToNonPlaceAbleArray(x,y);
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
        addPointToNonPlaceAbleArray(x,y);
    }
    ctx.stroke();
}

