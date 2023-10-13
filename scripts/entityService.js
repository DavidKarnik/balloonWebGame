// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna ("turret"/"sentry")

const shopCanvas = document.getElementById('gameCanvas');
const ctxShop = shopCanvas.getContext('2d'); // context of canvas

shopCanvas.width = window.innerWidth;
shopCanvas.height = window.innerHeight;

let shopEntity = [
    // {x, y, size of square}
];

let entities = [
    // {x,y,range,type,level,damage,fireRate}
    // {}
];

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

    // nákupní lišta (Čtverce)
    for (let i = 0; i < 4; i++) {
        // odsazení
        let x = startSquareX + i * (squareSize + padding); // Aktualizovat pozici pro každý čtverec
        let y = canvasMain.height - squareSize - 10;

        drawSquare(ctxMain, x, y, squareSize, ballColors[i]);

        shopEntity.push({x, y, squareSize});
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
shopCanvas.addEventListener('click', (event) => {
    const mouseX = event.clientX //- shopCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY //- shopCanvas.getBoundingClientRect().top;


    // Pokud je vybrána entita, umístěte ji na pozici kliku na hlavním plátně
    if (selectedEntity != null) {
        // new Entity placed
        let x = mouseX;
        let y = mouseY;
        let type = selectedEntity;
        entities.push({x, y, type});
        // reset
        selectedEntity = null;
    }
    // Zde můžete zjistit, která entita byla vybrána na základě pozice kliku
    else if (isEntityClicked(mouseX, mouseY)) {
        // selectedEntity = entities[/* index vybrané entity */];
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
        // shopCanvas.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
        // Nakreslit entitu
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}