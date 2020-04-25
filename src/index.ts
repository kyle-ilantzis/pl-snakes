import * as draw from './draw';
import { Snake } from './snake';

var canvas: any,
    ctx: CanvasRenderingContext2D,
    worldSize: draw.WorldSize,
    gameNowMillis: number,
    snake: Snake;

const updateWorld = (ellapsedMillis: number) => {
    snake.update(ellapsedMillis);
}

const drawWorld = () => {
    // clear the world
    draw.drawSquare(ctx, "black", 0, 0, worldSize.width, worldSize.height);

    snake.draw(ctx);
}

const gameLoop = () => {
    const now = Date.now();
    const ellapsedMillis = now - gameNowMillis;
    gameNowMillis = now

    updateWorld(ellapsedMillis);
    drawWorld();
    window.setTimeout(gameLoop, 16)
}

window.onload = () => {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    worldSize = draw.worldSize(canvas);
    snake = new Snake(0, 0, worldSize);
    
    gameNowMillis = Date.now()
    gameLoop();
}