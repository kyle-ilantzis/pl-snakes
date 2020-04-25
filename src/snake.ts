import * as draw from './draw';
import * as game from './game';

export class Snake {
  ellapsedMillisSum: number
  tickRateMillis: number

  constructor(public x: number, public y: number, public worldSize: draw.WorldSize) {
    this.ellapsedMillisSum = 0;
    this.tickRateMillis = 700;
  }

  update(gameCtx: game.GameContext) {
      this.ellapsedMillisSum += gameCtx.ellapsedMillis;

      if (this.ellapsedMillisSum < this.tickRateMillis) {
        return;
      }

      this.ellapsedMillisSum -= this.tickRateMillis;

      this.y = this.y + 1;
      if (this.y > this.worldSize.height) {
          this.y = 0;
      }
  }

  draw(ctx: CanvasRenderingContext2D) {
      draw.drawPixel(ctx, "green", this.x, this.y);
  }
}