import * as draw from './draw';
import * as game from './game';
import * as logger from './logger';
import { Snake } from './snake';
import { GameOver } from './gameOver';
import { CherryManager } from './cherries';

var canvas: any,
    ctx: CanvasRenderingContext2D,
    gameCtx: game.GameContext,
    keydowns: Array<KeyboardEvent> = [];

const tick = () => {
    const now = Date.now();
    gameCtx.ellapsedMillis = now - gameCtx.gameNowMillis;
    gameCtx.gameNowMillis = now
}

const processInput = () => {
    const gameInputs = new game.GameInputs();

    for (const e of keydowns) {
        const up = e.key == "ArrowUp" || e.key == "w" || e.key == "W";
        const down = e.key == "ArrowDown" || e.key == "s" || e.key == "S";
        const left = e.key == "ArrowLeft" || e.key == "a" || e.key == "A";
        const right = e.key == "ArrowRight" || e.key == "d" || e.key == "D";

        gameInputs.up = gameInputs.up || up;
        gameInputs.down = gameInputs.down || down;
        gameInputs.left = gameInputs.left || left;
        gameInputs.right = gameInputs.right || right;
    }

    keydowns = [];

    gameCtx.inputs = gameInputs;

    if (gameInputs.any()) {
        logger.verbose('processInput', gameInputs);
    }
}

const updateWorld = () => {
    for (const gameEntity of gameCtx.entities) {
        gameEntity.update(gameCtx);
    }


}

const drawWorld = () => {
    // clear the world
    draw.drawSquare(gameCtx, "black", 0, 0, gameCtx.worldSize.width, gameCtx.worldSize.height);

    for (const gameEntity of gameCtx.entities) {
        gameEntity.draw(gameCtx);
    }
}

const gameLoop = () => {
    tick();
    processInput();
    updateWorld();
    drawWorld();
    window.setTimeout(gameLoop, 16)
}

window.onload = () => {
    document.onkeydown = (e) => {
        keydowns.push(e);
    }

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    
    const worldSize = draw.worldSize(canvas);

    const snake = new Snake(worldSize);
    const cherryManager = new CherryManager(snake);
    const gameOver = new GameOver(snake);

    snake.cherryManager = cherryManager;
    
    gameCtx = new game.GameContext(new game.GameInputs(),
                                   Date.now(),
                                   0,
                                   worldSize,
                                   ctx,
                                   [snake, cherryManager, gameOver]);
    gameLoop();
}