export const GAME_WORLD_PIXEL = 10;

export interface WorldSize { 
  width: number;
  height: number;
}

export const worldSize = (canvas: any): WorldSize => {
  return {
    width: Math.round( canvas.width / GAME_WORLD_PIXEL ), 
    height: Math.round( canvas.height / GAME_WORLD_PIXEL )
  }
}

export const drawSquare = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = color
  const canvasX = x * GAME_WORLD_PIXEL
  const canvasY = y * GAME_WORLD_PIXEL
  const canvasW = w * GAME_WORLD_PIXEL
  const canvasH = h * GAME_WORLD_PIXEL
  ctx.fillRect(canvasX, canvasY, canvasW, canvasH);
}

export const drawPixel = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number) => {
  ctx.fillStyle = color
  const canvasX = x * GAME_WORLD_PIXEL
  const canvasY = y * GAME_WORLD_PIXEL
  ctx.fillRect(canvasX, canvasY, GAME_WORLD_PIXEL, GAME_WORLD_PIXEL);
}