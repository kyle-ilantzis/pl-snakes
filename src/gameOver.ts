import * as draw from './draw';
import * as game from './game';
import { SnakeState, Snake } from './snake';

export class GameOver implements game.GameEntity {
  constructor(public snake: Snake) {}

  update(gameCtx: game.GameContext) {}

  draw(gameCtx: game.GameContext) {
    if (this.snake.state != SnakeState.dead) {
      return;
    }

    const font = "32px Open Sans";
    const text = "GAME OVER";
    
    const textMeasure = draw.meaureText(gameCtx, font, text);

    const x = Math.round( gameCtx.worldSize.width / 2 - textMeasure.w / 2 )
    const y = Math.round( gameCtx.worldSize.height / 2 - textMeasure.h / 2 )

    draw.drawText(gameCtx, font, "red", text, x, y);
  }
}