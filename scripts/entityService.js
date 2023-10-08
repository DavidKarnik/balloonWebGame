// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna

let entities = [
    // {x,y,range,type,level,damage,fireRate}
];

export function drawBuyMenu(ctx, canvas) {
    const squareSize = 150; // Velikost čtverce
    const padding = 40; // Odsazení mezi čtverci

    // Vypočítat pozice čtverců pro zarovnání doprostřed
    const totalWidth = squareSize * 4;
    const startSquareX = ((canvas.width - totalWidth) / 2) - (padding * 2);

    // nákupní lišta (Čtverce)
    for (let i = 0; i < 4; i++) {
        // odsazení
        let xPadd = startSquareX + i * (squareSize + padding); // Aktualizovat pozici pro každý čtverec
        drawSquare(ctx, xPadd, canvas.height - squareSize - 10, squareSize);
    }
}

function drawSquare(ctx, x, y, size) {
    ctx.fillStyle = 'white'; // Barva vnitřku čtverce
    ctx.strokeStyle = 'black'; // Barva obrysu čtverce
    ctx.lineWidth = 2; // Šířka čáry obrysu

    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.stroke();
}


