import * as draw from './draw';

export class GameInputs {
  constructor(
    public up: boolean = false,
    public down: boolean = false,
    public left: boolean = false,
    public right: boolean = false) {}

    count(): number {
      return (this.up ? 1 : 0) + (this.down ? 1 : 0) + (this.left ? 1 : 0) + (this.right ? 1 : 0);
    }

    any(): boolean {
      return this.count() > 0;
    }

    many(): boolean {
      return this.count() > 1;
    }
}

export class GameContext {
  constructor(public inputs: GameInputs,
              public gameNowMillis: number,
              public ellapsedMillis: number,
              public worldSize: draw.WorldSize,
              public ctx: CanvasRenderingContext2D) {}
}