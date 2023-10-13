// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna

const shopCanvas = document.getElementById('gameCanvas');
const ctxShop = shopCanvas.getContext('2d'); // context of canvas

shopCanvas.width = window.innerWidth;
shopCanvas.height = window.innerHeight;

let shopEntity = []; // {x, y, size of square}

let entities = [
    // {x,y,range,type,level,damage,fireRate}
    // {}
];

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
        // shopEntity[i] = {xPadd, yHelp, squareSize}; // x, y, size of square
        shopEntity.push({x, y, squareSize});
        // console.log('shopEntity created -> ' + xPadd, yHelp, squareSize)
        // shopEntity created -> 793 675 150
        // shopEntity created -> 223 675 150
        // shopEntity created -> 413 675 150
        // shopEntity created -> 603 675 150
    }

    // entity
    // Vykreslení entit na nákupním menu
    // for (let i = 0; i < entities.length; i++) {
    //     const entity = entities[i];
    //     // Zde můžete vykreslit entitu na nákupním menu
    //     ctxShop.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
    // }
}

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

// Přidání události pro kliknutí na nákupním menu
shopCanvas.addEventListener('click', (event) => {
    const mouseX = event.clientX //- shopCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY //- shopCanvas.getBoundingClientRect().top;

    // console.log('mouseX -> ' + mouseX)
    // console.log('mouseY -> ' + mouseY)

    // Pokud je vybrána entita, umístěte ji na pozici kliku na hlavním plátně
    if (selectedEntity != null) {
        // new Entity placed
        let x = mouseX;
        let y = mouseY;
        let type = selectedEntity;
        entities.push({x, y, type});
        // reset
        selectedEntity = null;
        // const newEntity = {
        //     x: mouseX,
        //     y: mouseY,
        //     type: selectedEntity
        //     // Další vlastnosti entity
        // }
    }
    // Zde můžete zjistit, která entita byla vybrána na základě pozice kliku
    else if (isEntityClicked(mouseX, mouseY)) {
        // selectedEntity = entities[/* index vybrané entity */];
    }
});
//
// // Přidání události pro kliknutí na hlavním plátně
// mainCanvas.addEventListener('click', (event) => {
//     const mouseX = event.clientX - mainCanvas.getBoundingClientRect().left;
//     const mouseY = event.clientY - mainCanvas.getBoundingClientRect().top;
//
//     // Pokud je vybrána entita, umístěte ji na pozici kliku na hlavním plátně
//     if (selectedEntity) {
//         const newEntity = {
//             x: mouseX,
//             y: mouseY,
//             // Další vlastnosti entity
//         };
//
//         entities.push(newEntity); // Přidat entitu do seznamu entit na hlavním plátně
//         selectedEntity = null; // Vybraná entita byla umístěna
//     }
// });
//
// // Funkce pro zjištění, zda byla entita v nákupním menu kliknuta
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

export function drawEntities(ctx) {
    // Vykreslení entit na hlavním plátně
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        let color = 'white'
        let radius = 20;
        // Zde můžete vykreslit entity na hlavním plátně
        switch (entity.type){
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
        // Nakreslit míček do středu čtverce
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}
//
// // Hlavní herní smyčka
// function gameLoop() {
//     // Vykreslení nákupního menu
//     drawBuyMenu();
//
//     // Vykreslení entit na hlavním plátně
//     for (let i = 0; i < entities.length; i++) {
//         const entity = entities[i];
//         // Zde můžete vykreslit entity na hlavním plátně
//         ctxMain.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
//     }
//
//     // Další herní logika
//
//     // requestAnimationFrame(gameLoop);
// }

// Spuštění herní smyčky
// gameLoop();
