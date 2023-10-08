// uložení životů, vykreslení health baru, vykreslení "tower" (tower defense)

const image = new Image();
image.src = '/img/castle1.jpg';

const maxHealth = 100;
let healthDown = 0;

export function drawCastle(ctx) {
    // Nakreslit obrázek na canvas
    ctx.drawImage(image, 0, 0, 451, 282);
}

export function drawHealthBar(ctx, x, y) {
    // console.log('maxHealth: ' + maxHealth)
    // console.log('healthDown: ' + healthDown)

    let barWidth = 200; // Šířka health baru
    let barHeight = 20; // Výška health baru

    // Zdraví po odečtení healthDown
    let newHealth = maxHealth - healthDown;
    let newHealthWidth = (newHealth / 100) * barWidth;

    // Pozice X health baru
    let barX = x;

    // Pozice Y health baru
    let barY = y;

    // Vykreslit pozadí health baru (šedou čáru)
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Vykreslit aktuální health (obarvený health bar)
    ctx.fillStyle = `rgb(${0}, ${200}, ${0})`;
    ctx.fillRect(barX, barY, newHealthWidth, barHeight);
}

export function dealDamage(number) {
    healthDown += number;
}

export function setHealthDown(number) {
    healthDown = number;
}

export function getMaxHealth() {
    return maxHealth;
}

export function getCurrentHealth() {
    return (maxHealth - healthDown);
}