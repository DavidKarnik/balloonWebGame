// Script for balloon service

import {dealDamage} from "./healthService.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // context of canvas

const balloonRadius = 30;

// seznam všech balloons
export let balloons = [];
let exceptionPoppedBalloon = false;

// requestanimationframe() fasting exception
let upravaRychlosti = 1
// rychlost vykreslování
let speed = 1

/**
 * Create new Balloon and save to the array
 */
export function createBalloon() {
    // const x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
    // const y = canvas.height + balloonRadius;
    const x = 0 - balloonRadius;
    const y = canvas.height / 2 + balloonRadius;
    const type = 1; // Typ balonku... určuje rychlost, kterou se balónky pohybují
    balloons.push({x, y, type});
}

/**
 * Draw Balloon to canvas
 * @param x - x coordination of balloon
 * @param y - y coordination of balloon
 */
export function drawBalloon(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, balloonRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

/**
 * Funkce pro výpočet y-ové pozice balónku na zakroucené trase
 * @param x - x coordination of balloon
 * @return y - by sinus fn(x)
 */
export function calculateBalloonYPosition(x) {
    // Zde změňte rozsah sinusového pohybu
    const amplitude = 200; // Amplituda sinusového pohybu
    const frequency = 0.01; // Frekvence sinusového pohybu
    return window.innerHeight / 2 + amplitude * Math.sin(frequency * x);
}


/**
 * Funkce pro vykreslení VŠECH balonu do canvasu (z pole balloons[])
 */
export function drawAllBalloons() {
    for (let i = 0; i < balloons.length; i++) {
        exceptionPoppedBalloon = false;
        // calculate position of balloon by function
        balloons[i].y = calculateBalloonYPosition(balloons[i].x);
        // TODO upravaRychlosti
        // balloons[i].x += (balloons[i].speed * upravaRychlosti);
        balloons[i].x += (speed * upravaRychlosti);
        drawBalloon(balloons[i].x, balloons[i].y);

        // Exception - balloon[i] already deleted in this loop -> undefined ------------------------
        if (!exceptionPoppedBalloon) {
            // Detekce kolize balonku se stěnou
            if (balloons[i].x >= canvas.width) {
                balloons.splice(i, 1);
                i--; // o balonek méně
                dealDamage(10);
                // console.log("balloon touch wall!")
            }
        }
    }
}

/**
 * Clear balloons[] array -> restart -> no balloons
 */
export function clearBalloons() {
    balloons = []
}

/**
 * Funkce pro nastavení upravaRychlosti kvůli requestAnimationFrame()
 * @param number - číslo pro úpravu rychlosti (newSpeed = speed * number)
 */
export function setUpravaRychlosti(number) {
    upravaRychlosti = number;
}

/**
 * Funkce pro set up rychlosti - zrychlování/zpomalování vykreslování
 * @param number - speed
 */
export function setSpeed(number) {
    speed = number;
}