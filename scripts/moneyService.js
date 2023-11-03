let money = 0;

export function addMoney(number) {
    money += number
}
export function minusMoney(number) {
    if(number <= money) {
        money -= number
    }
}
export function resetMoney() {
    money = 0
}

export function getMoney() {
    return money
}

export function printMoney(ctx, x, y) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Money: ' + money + ' $', x, y);
}