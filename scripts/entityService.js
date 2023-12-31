// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna ("turret"/"sentry")

import {balloons} from "./balloonService.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shopEntity = [
    // {x, y, size of square}
];

let entities = [
    // {x,y,range,type,level,damage,fireRate}
    // entity.type...
    // 0 - 
    // 1 -
    // 2 -
    // 3 -
];

// const projectileRadius = 5;

export let projectiles = [];

const shootIntervalIds = [];

let myMouseX = null;
let myMouseY = null;

// for track points where entity can not be placed
const pathNonPlaceAblePoints = [];

/**
 * Draw entity buy square menu
 * @param ctxMain - canvas context
 * @param canvasMain - canvas
 */
export function drawBuyMenu(ctxMain, canvasMain) {
    const squareSize = 150; // Velikost čtverce
    const padding = 40; // Odsazení mezi čtverci

    // Vypočítat pozice čtverců pro zarovnání doprostřed
    const totalWidth = squareSize * 4;
    const startSquareX = ((canvasMain.width - totalWidth) / 2) - (padding * 2);

    const ballColors = ['green', 'blue', 'orange', 'black'];

    let price = 10;
    // nákupní lišta (Čtverce)
    for (let i = 0; i < 4; i++) {
        // odsazení
        let x = startSquareX + i * (squareSize + padding); // Aktualizovat pozici pro každý čtverec
        let y = canvasMain.height - squareSize - 10;

        drawSquare(ctxMain, x, y, squareSize, ballColors[i]);
        shopEntity.push({x, y, squareSize});

        // draw price
        ctx.font = '30px Arial';
        ctx.fillStyle = 'green';
        let priceX = x + (squareSize / 2) - 25
        let priceY = y + (squareSize) - 5
        ctx.fillText('' + price + ' $', priceX, priceY);
        price += 10;
    }

    // Vykreslení entit na nákupním menu
    // for (let i = 0; i < entities.length; i++) {
    //     const entity = entities[i];
    //     // Zde můžete vykreslit entitu na nákupním menu
    //     ctxShop.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
    // }
}

/**
 * Draw shop square
 * @param ctxMain - canvas context
 * @param x - square coordination X
 * @param y - square coordination Y
 * @param size - size of square (one side)
 * @param ballColor - color of entity (in the middle of square)
 */
function drawSquare(ctxMain, x, y, size, ballColor) {
    ctxMain.fillStyle = 'white'; // Barva vnitřku čtverce
    ctxMain.strokeStyle = 'black'; // Barva obrysu čtverce
    ctxMain.lineWidth = 2; // Šířka čáry obrysu

    ctxMain.beginPath();
    ctxMain.rect(x, y, size, size);
    ctxMain.fill();
    ctxMain.stroke();

    // Nakreslit míček do středu čtverce
    const ballSize = size / 4; // Velikost míčku
    const ballX = x + size / 2; // X pozice středu čtverce
    const ballY = y + size / 2; // Y pozice středu čtverce

    ctxMain.fillStyle = ballColor; // Barva míčku (nastavte různé barvy podle vašich preferencí)
    ctxMain.beginPath();
    ctxMain.arc(ballX, ballY, ballSize, 0, 2 * Math.PI);
    ctxMain.fill();
}

let selectedEntity = null; // Vybraná entita z nákupního menu

/**
 *  Události pro kliknutí na nákupním menu a placement Entity ("Sentry")
 */
canvas.addEventListener('click', (event) => {
    const mouseX = event.clientX //- canvas.getBoundingClientRect().left;
    const mouseY = event.clientY //- canvas.getBoundingClientRect().getBoundingClientRect().top;

    // Pokud je vybrána entita, umístěte ji na pozici kliku na hlavním plátně
    if (selectedEntity != null) {
        // new Entity placed
        let x = mouseX;
        let y = mouseY;
        // Can be entity place ? -> no -> return and do nothing
        if (!canBeEntityPlace(x, y)) {
            return;
        }
        let type = selectedEntity;
        // range by type
        let range = 0;
        switch (type) {
            case 0:
                range = 80
                break;
            case 1:
                range = 100
                break;
            case 2:
                range = 120
                break;
            case 3:
                range = 150
                break;
            default :
                range = 0
                break;
        }
        let isShooting = false
        entities.push({x, y, type, range, isShooting});
        // reset
        selectedEntity = null;
    }
    // else if (isEntityClicked()) -> selectedEntity se přepíše
    else if (isEntityClicked(mouseX, mouseY)) {
        //
    }
});

/**
 * Funkce pro zjištění, zda byla entita v nákupním menu kliknuta
 * @param mouseX - mouse position X
 * @param mouseY - mouse position Y
 * @return {boolean} - was any entity clicked ?
 */
function isEntityClicked(mouseX, mouseY) {
    for (let i = 0; i < shopEntity.length; i++) {
        const entity = entities[i];
        // Zde můžete prověřit, zda je klik na pozici entity v nákupním menu
        if (
            mouseX >= shopEntity[i].x &&
            mouseX <= shopEntity[i].x + shopEntity[i].squareSize &&
            mouseY >= shopEntity[i].y &&
            mouseY <= shopEntity[i].y + shopEntity[i].squareSize
        ) {
            selectedEntity = i; // number of selected entity
            return true; // Kliknuto na entitu
        }
    }
    return false; // Kliknuto mimo entity
}

/**
 * Draw entities -> draw all "Sentry"
 * @param ctx - canvas context
 */
export function drawEntities(ctx) {
    // Vykreslení entit na hlavním plátně
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        let color = 'white'
        let radius = 20;
        // Zde můžete vykreslit entity na hlavním plátně
        switch (entity.type) {
            case 0:
                color = 'green'
                break;
            case 1:
                color = 'blue'
                break;
            case 2:
                color = 'yellow'
                break;
            case 3:
                color = 'black'
                break;
            default :
                color = 'white'
                break;
        }
        // canvas.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
        // Nakreslit entitu
        //range
        drawRange(ctx, entity.x, entity.y, entity.range);
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

/**
 * Draw entity range
 * @param ctx - canvas context
 * @param x - coordination center x
 * @param y - coordination center y
 * @param range - range - r of circle
 */
function drawRange(ctx, x, y, range) {
    // Nakreslit range entity - čárkovaně
    ctx.beginPath();
    ctx.arc(x, y, range, 0, 2 * Math.PI, false); // Vykreslení prázdného kruhu
    ctx.lineWidth = 2; // Šířka čáry
    ctx.strokeStyle = 'grey'; // Barva čar
    ctx.setLineDash([8, 15]); // Čárkovaný obrys
    ctx.stroke(); // Vykreslení obrysu
    ctx.closePath();
    ctx.setLineDash([]); // Resetovat čárkovaný obrys pro další vykreslování
}

// Entity interaction

// export function drawEntityProjectile() {
//     for (let i = 0; i < entities.length; i++) {
//         const entity = entities[i]
//         console.log('i -> ' + i)
//         let closestBalloon = null;
//         let distanceClosest = 999;
//         for (let j = 0; j < balloons.length; j++) {
//             let distance = calculateDistance(balloons[j].x, balloons[j].y, entity.x, entity.y)
//             if (distance <= distanceClosest) {
//                 distanceClosest = distance;
//                 closestBalloon = j;
//             }
//         }
//
//         if (distanceClosest <= entity.range) {
//             // shoot balloon if not null
//             if (closestBalloon) {
//                 drawLine(ctx, entity.x, entity.y, balloons[closestBalloon].x, balloons[closestBalloon].y)
//                 balloons.splice(closestBalloon, 1);
//             }
//         }
//     }
// }

/**
 * Výpočet vzdálenosti mezi dvěma body v rovině.
 * @param {number} x1 - Souřadnice x prvního bodu
 * @param {number} y1 - Souřadnice y prvního bodu
 * @param {number} x2 - Souřadnice x druhého bodu
 * @param {number} y2 - Souřadnice y druhého bodu
 * @returns {number} - Vzdálenost mezi body (float)
 */
function calculateDistance(x1, y1, x2, y2) {
    // distance = √((x2 - x1)² + (y2 - y1)²)
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawLine(ctx, xStart, yStart, xEnd, yEnd) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
}

// ----------------------------------------------------------------------------------------------

/**
 * Zahájení asynchronní střelby, přidání střelby do pole intervalů
 */
export function startShootingFunction() {
// Spustit intervaly
    for (const entity of entities) {
        if (!entity.isShooting) {
            const intervalId = setInterval(() => {
                shootEntity(entity);
            }, 1000);
            shootIntervalIds.push(intervalId); // Uložit ID intervalu do pole
            entity.isShooting = true;
        }
    }
}

/**
 * Funkce pro střelbu jedné entity - asynchronní
 * @param entity - Entity object
 * @return {Promise<void>}
 */
async function shootEntity(entity) {
    let closestBalloon = null;
    let distanceClosest = 999;
    // Find the closest balloon
    for (let j = 0; j < balloons.length; j++) {
        let distance = calculateDistance(balloons[j].x, balloons[j].y, entity.x, entity.y);
        if (distance <= distanceClosest) {
            distanceClosest = distance;
            closestBalloon = j;
        }
    }
    // Is the closest balloon in range ?
    if (distanceClosest <= entity.range) {
        // Střelba balónu, pokud není null
        if (closestBalloon !== null) {
            drawLine(ctx, entity.x, entity.y, balloons[closestBalloon].x, balloons[closestBalloon].y);
            // console.log("shoot")
            balloons.splice(closestBalloon, 1);
        }
    }
}

/**
 * Smazání intervalů ze seznamu pro ukončení asynchronní střelby
 */
export function stopShootingFunction() {
    // Zastavit intervaly střelby a reset
    for (const intervalId of shootIntervalIds) {
        clearInterval(intervalId);
    }
    for (const entity of entities) {
        entity.isShooting = false
    }
}

// mouse moves over canvas -> draw how would entity look like
/**
 * EventListener pro zjištění aktuální pozice myši
 */
canvas.addEventListener('mousemove', (event) => {
    myMouseX = event.x;
    myMouseY = event.y;
});

/**
 * Funkce pro dočasnou grafickou reprezentaci umístění entity
 */
export function doLogicForGraphicRepresentation() {
    // Pokud je vybrána entita, vykreslit dočasnou entitu jako grafickou reprezentaci
    if (selectedEntity != null && myMouseX != null && myMouseY != null) {
        // console.log("logic !")
        let radius = 20;
        let type = selectedEntity;
        // range and color by type
        let range;
        let color;
        switch (type) {
            case 0:
                range = 80
                color = 'green'
                break;
            case 1:
                range = 100
                color = 'blue'

                break;
            case 2:
                range = 120
                color = 'yellow'

                break;
            case 3:
                range = 150
                color = 'black'

                break;
            default :
                range = 0
                color = 'grey'
                break;
        }
        // Can be entity place ? -> no ? -> Red color
        if (!canBeEntityPlace(myMouseX, myMouseY)) {
            color = 'red'
            // console.log("Entity can not be placed !")
        }
        // draw entity
        drawRange(ctx, myMouseX, myMouseY, range);
        ctx.beginPath();
        ctx.arc(myMouseX, myMouseY, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

// TODO Can be entity places ?
// Can not be placed because :
// - placing on balloon route
// - placing on Entity shop
// TODO fix responsive entity shop (update coordinates of *clicked shop ?* )
// - placing too close to the other placed entity

// TODO save array of unplaceable points <-

export function addPointToNonPlaceAbleArray(x, y) {
    const point = {x, y}; // Vytvořte objekt s x a y souřadnicemi
    // Zkontrolujte, zda bod již existuje v poli pathPoints
    if (!isPointInArray(pathNonPlaceAblePoints, point)) {
        pathNonPlaceAblePoints.push(point); // Přidejte tento objekt do pole pathPoints, pokud je jedinečný
    }
}

function isPointInArray(arr, point) {
    // Kontrola, zda bod již existuje v poli
    return arr.some(existingPoint => existingPoint.x === point.x && existingPoint.y === point.y);
    // arr.some(callback(a,b),args) -> je metoda, která se používá k ověření, zda alespoň jeden prvek pole splňuje
    // určitou podmínku, která je definována jako funkce.
}

/**
 * Funkce pro ověření umístění entity
 * @param x - souřadnice x pro umísťovanou entitu
 * @param y - souřadnice y pro umísťovanou entitu
 * @return {boolean} - (true/false) mohu/nemohu Entitu umístit
 */
function canBeEntityPlace(x, y) {
    let minOffset = 40;
    // nemohu položit entitu na jinou už položenou entitu
    for (const entity of entities) {
        const distance = Math.sqrt((x - entity.x) ** 2 + (y - entity.y) ** 2);
        if (distance < minOffset) {
            return false; // Entity je příliš blízko
        }
    }

    // Projdeme všechny body, kde nelze umisťovat entity
    for (const nonPlaceablePoint of pathNonPlaceAblePoints) {
        const distance = Math.sqrt((x - nonPlaceablePoint.x) ** 2 + (y - nonPlaceablePoint.y) ** 2);
        if (distance < minOffset) {
            return false;
        }
    }

    return true; // Entity může být umístěna
}