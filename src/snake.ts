import * as draw from './draw';
import * as game from './game';

export enum SnakeState {
  alive,
  dead
}
export class Snake implements game.GameEntity {
  public state: SnakeState;
  public x: number; 
  public y: number;
  
  direction: { x: number, y: number };
  ellapsedMillisSum: number;
  tickRateMillis: number;

  constructor(public worldSize: draw.WorldSize) {
    this.state = SnakeState.alive;
    this.x = Math.round( worldSize.width / 2 );
    this.y = Math.round( worldSize.height / 2 );
    this.direction = { x: 0, y: 1 };
    this.ellapsedMillisSum = 0;
    this.tickRateMillis = 700;
  }

  update(gameCtx: game.GameContext) {
      if (this.state == SnakeState.dead) {
        return;
      }

      // update the direction
      if (gameCtx.inputs.many()) {
        return;
      }
      if (gameCtx.inputs.up) this.direction = { x: 0, y: -1 };
      if (gameCtx.inputs.down) this.direction = { x: 0, y: 1 };
      if (gameCtx.inputs.left) this.direction = { x: -1, y: 0 };
      if (gameCtx.inputs.right) this.direction = { x: 1, y: 0 };

      // if ellapsed time span is under tick, skip update
      this.ellapsedMillisSum += gameCtx.ellapsedMillis;
      if (this.ellapsedMillisSum < this.tickRateMillis) {
        return;
      }
      this.ellapsedMillisSum -= this.tickRateMillis;

      // apply the direction
      this.x += this.direction.x;
      this.y += this.direction.y;

      // check if dead because out of bounds
      if (this.x < 0) {
        this.state = SnakeState.dead;
        this.x = 0;
      }
      if (this.x >= this.worldSize.width) {
          this.state = SnakeState.dead;
          this.x = this.worldSize.width - 1;
      }
      if (this.y < 0) {
        this.state = SnakeState.dead;
        this.y = 0;
      }
      if (this.y >= this.worldSize.height) {
          this.state = SnakeState.dead;
          this.y = this.worldSize.height - 1;
      }
  }

  draw(gameCtx: game.GameContext) {
      draw.drawPixel(gameCtx, "green", this.x, this.y);
  }
}