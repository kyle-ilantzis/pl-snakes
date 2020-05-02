import * as draw from './draw';
import * as game from './game';
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
    const spot = this.findAvailableCherrySpot(gameCtx);
    if (!spot) { 
      return;
    }

    this.cherry = new Cherry(spot);
  }

  private findAvailableCherrySpot(gameCtx: game.GameContext): draw.Point {
    for(let i = 0; i < 4; i++) {
      
      const x = Math.round( gameCtx.worldSize.width * Math.random() )
      const y = Math.round( gameCtx.worldSize.height * Math.random() )
      
      const point = {x, y}
      
      if (this.snake.occupies(point)) {
        continue;
      }

      return point;
    }

    return null;
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