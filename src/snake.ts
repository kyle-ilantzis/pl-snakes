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

  inputDirection: draw.Point;
  ellapsedMillisSum: number;
  tickRateMillis: number;

  direction: draw.Point;
  previousPoint: draw.Point;
  body: Array<draw.Point>;

  constructor(public worldSize: draw.WorldSize) {
    this.state = SnakeState.alive;
    this.point = {
      x: Math.round( worldSize.width / 2 ),
      y: Math.round( worldSize.height / 2 )
    }

    this.ellapsedMillisSum = 0;
    this.tickRateMillis = 250;

    this.direction = { x: 0, y: 1 };
    this.previousPoint = this.point;
    this.body = [];
  }

  occupies(point: draw.Point): boolean {
    const pointOccupies = this.point.x == point.x && this.point.y == point.y;
    return pointOccupies || this.bodyOccupies(point);
  }

  update(gameCtx: game.GameContext) {
      if (this.state == SnakeState.dead) {
        return;
      }

      this.processInputDirection(gameCtx);

      // if ellapsed time span is under tick, skip update
      this.ellapsedMillisSum += gameCtx.ellapsedMillis;
      if (this.ellapsedMillisSum < this.tickRateMillis) {
        return;
      }
      this.ellapsedMillisSum -= this.tickRateMillis;

      this.updateDirectionIfNecessary();
      this.applyDirection();

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
        this.body.push(this.previousPoint);
      }
  }

  draw(gameCtx: game.GameContext) {
      draw.drawPixel(gameCtx, "green", this.point.x, this.point.y);
      for (const part of this.body) {
        draw.drawPixel(gameCtx, "green", part.x, part.y);
      }
  }

  private bodyOccupies(point: draw.Point): boolean {
    for (let i = 0; i < this.body.length; i++) {
      const part = this.body[i];
      if (part.x == point.x && part.y == point.y) {
        return true;
      }
    }
    return false;
  }
  
  private processInputDirection(gameCtx: game.GameContext) {
      if (!gameCtx.inputs.many()) {
        if (gameCtx.inputs.up) this.inputDirection = { x: 0, y: -1 };
        if (gameCtx.inputs.down) this.inputDirection = { x: 0, y: 1 };
        if (gameCtx.inputs.left) this.inputDirection = { x: -1, y: 0 };
        if (gameCtx.inputs.right) this.inputDirection = { x: 1, y: 0 };
      }
  }

  private updateDirectionIfNecessary() {
    if (!this.inputDirection) {
      return;
    }

    if (this.inputDirection.x == 1 && this.direction.x == -1 ||
      this.inputDirection.x == -1 && this.direction.x == 1 ||
      this.inputDirection.y == 1 && this.direction.y == -1 ||
      this.inputDirection.y == -1 && this.direction.y == 1) {
        return;
    }

    this.direction = this.inputDirection;
  }

  private applyDirection() {
      this.previousPoint = { x: this.point.x, y: this.point.y };

      // to the head
      this.point.x += this.direction.x;
      this.point.y += this.direction.y;

      // to the rest of the body
      for (let i = 0; i < this.body.length; i++) {
        const part = this.body[i];
        const partX = part.x;
        const partY = part.y;
        part.x = this.previousPoint.x;
        part.y = this.previousPoint.y;
        this.previousPoint.x = partX;
        this.previousPoint.y = partY;
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
    if (this.bodyOccupies(this.point)) {
      this.state = SnakeState.dead;
    }
  }

  private isDead(): boolean {
    return this.state == SnakeState.dead;
  }
}