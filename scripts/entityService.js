// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna

const shopCanvas = document.getElementById('shopCanvas');
const ctxShop = shopCanvas.getContext('2d'); // context of canvas

shopCanvas.width = window.innerWidth;
shopCanvas.height = window.innerHeight;

let entities = [
    // {x,y,range,type,level,damage,fireRate}
];

export function drawBuyMenu(ctxMain, canvasMain) {
    const squareSize = 150; // Velikost čtverce
    const padding = 40; // Odsazení mezi čtverci

    // Vypočítat pozice čtverců pro zarovnání doprostřed
    const totalWidth = squareSize * 4;
    const startSquareX = ((canvasMain.width - totalWidth) / 2) - (padding * 2);

    // nákupní lišta (Čtverce)
    for (let i = 0; i < 4; i++) {
        // odsazení
        let xPadd = startSquareX + i * (squareSize + padding); // Aktualizovat pozici pro každý čtverec
        drawSquare(ctxMain, xPadd, canvasMain.height - squareSize - 10, squareSize);
    }
}

function drawSquare(ctxMain, x, y, size) {
    ctxMain.fillStyle = 'white'; // Barva vnitřku čtverce
    ctxMain.strokeStyle = 'black'; // Barva obrysu čtverce
    ctxMain.lineWidth = 2; // Šířka čáry obrysu

    ctxMain.beginPath();
    ctxMain.rect(x, y, size, size);
    ctxMain.fill();
    ctxMain.stroke();
}

shopCanvas.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

});
