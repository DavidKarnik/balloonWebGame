// Script pro logiku a operace entit (nákup, placement, akce)
// entita -> samostatná střílna

// let entities = [];
// // let projectiles = [];
// const squareSize = 50; // Velikost čtverce
//
// // Vypočítat pozice čtverců pro zarovnání doprostřed
// const canvasWidth = canvas.width;
// const totalWidth = squareSize * 4;
// const startX = (canvasWidth - totalWidth) / 2;

// for picture and select
// entityService.js

export function drawSquare(ctx, x, y, size) {
    ctx.fillStyle = 'white'; // Barva vnitřku čtverce
    ctx.strokeStyle = 'black'; // Barva obrysu čtverce
    ctx.lineWidth = 2; // Šířka čáry obrysu

    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fill();
    ctx.stroke();
}

