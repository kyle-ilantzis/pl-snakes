import * as draw from './draw';
import * as game from './game';
import { CherryManager } from './cherries';

export enum SnakeState {
  alive,
  dead
}
export class Snake implements game.GameEntity {
  public cherryManager: CherryManager;

  public state: SnakeState;
  public point: draw.Point;
  
  direction: { x: number, y: number };
  ellapsedMillisSum: number;
  tickRateMillis: number;

  public body: Array<draw.Point> = [];

  constructor(public worldSize: draw.WorldSize) {
    this.state = SnakeState.alive;
    this.point = {
      x: Math.round( worldSize.width / 2 ),
      y: Math.round( worldSize.height / 2 )
    }
    this.direction = { x: 0, y: 1 };
    this.ellapsedMillisSum = 0;
    this.tickRateMillis = 250;
  }

  occupies(point: draw.Point): boolean {
    return this.point.x == point.x && this.point.y == point.y;
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
      let previousPoint = { x: this.point.x, y: this.point.y };

      // to the head
      this.point.x += this.direction.x;
      this.point.y += this.direction.y;

      // to the rest of the body
      for (let i = 0; i < this.body.length; i++) {
        const part = this.body[i];
        const partX = part.x;
        const partY = part.y;
        part.x = previousPoint.x;
        part.y = previousPoint.y;
        previousPoint.x = partX;
        previousPoint.y = partY;
      }

      // check if dead because out of bounds
      this.markDeadIfOutOfBounds();
      if (this.isDead()) {
        return;
      }

      this.markDeadIfEatSelf();
      if (this.isDead()) {
        return;
      }

      // eat cherry if on it
      if (this.cherryManager?.cherry?.point?.x == this.point.x && this.cherryManager?.cherry?.point?.y == this.point.y) {
        this.cherryManager?.cherry?.markEaten();
        this.body.push(previousPoint);
      }
  }

  draw(gameCtx: game.GameContext) {
      draw.drawPixel(gameCtx, "green", this.point.x, this.point.y);
      for (const part of this.body) {
        draw.drawPixel(gameCtx, "green", part.x, part.y);
      }
  }

  private markDeadIfOutOfBounds() {
    if (this.point.x < 0) {
      this.state = SnakeState.dead;
      this.point.x = 0;
    }
    if (this.point.x >= this.worldSize.width) {
        this.state = SnakeState.dead;
        this.point.x = this.worldSize.width - 1;
    }
    if (this.point.y < 0) {
      this.state = SnakeState.dead;
      this.point.y = 0;
    }
    if (this.point.y >= this.worldSize.height) {
        this.state = SnakeState.dead;
        this.point.y = this.worldSize.height - 1;
    }
  }

  private markDeadIfEatSelf() {
    for (let i = 0; i < this.body.length; i++) {
      const part = this.body[i];
      if (part.x == this.point.x && part.y == this.point.y) {
        this.state = SnakeState.dead;
        break;
      }
    }
  }

  private isDead(): boolean {
    return this.state == SnakeState.dead;
  }
}