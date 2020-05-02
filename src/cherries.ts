import * as draw from './draw';
import * as game from './game';
import * as logger from './logger';
import { SnakeState, Snake } from './snake';

export class CherryManager implements game.GameEntity {
  public cherry: Cherry;

  constructor(public snake: Snake) {}

  update(gameCtx: game.GameContext) {
    if (this.snake.state == SnakeState.dead) {
      return;
    }

    if (this.cherry?.state == CherryState.eaten) {
      this.cherry = null;
    }

    if (!this.cherry) {
      this.spawnCherry(gameCtx);
    }

    this.cherry?.update(gameCtx);
  }

  draw(gameCtx: game.GameContext) {
    this.cherry?.draw(gameCtx);
  }

  private spawnCherry(gameCtx: game.GameContext) {
    const x = Math.round( gameCtx.worldSize.width * Math.random() )
    const y = Math.round( gameCtx.worldSize.height * Math.random() )

    const point = {x, y}

    if (this.snake.occupies(point)) {
      logger.verbose('CherryManager.spawnCherry failed');
      return;
    }

    this.cherry = new Cherry(point);
  }
}

export enum CherryState {
  alive,
  eaten
}

export class Cherry implements game.GameEntity {
  public state: CherryState;
  
  constructor(public point: draw.Point) {
    this.state = CherryState.alive;
  }

  update(gameCtx: game.GameContext) {
  }

  draw(gameCtx: game.GameContext) {
    if (this.state == CherryState.eaten) {
      return
    }

    draw.drawPixel(gameCtx, "red", this.point.x, this.point.y);
  }

  markEaten() {
    this.state = CherryState.eaten;
  }
}