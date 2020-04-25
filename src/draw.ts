import { GameContext } from "./game";

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

export const drawSquare = (gameCtx: GameContext, color: string, x: number, y: number, w: number, h: number) => {
  gameCtx.ctx.fillStyle = color
  const canvasX = x * GAME_WORLD_PIXEL
  const canvasY = y * GAME_WORLD_PIXEL
  const canvasW = w * GAME_WORLD_PIXEL
  const canvasH = h * GAME_WORLD_PIXEL
  gameCtx.ctx.fillRect(canvasX, canvasY, canvasW, canvasH);
}

export const drawPixel = (gameCtx: GameContext, color: string, x: number, y: number) => {
  gameCtx.ctx.fillStyle = color
  const canvasX = x * GAME_WORLD_PIXEL
  const canvasY = y * GAME_WORLD_PIXEL
  gameCtx.ctx.fillRect(canvasX, canvasY, GAME_WORLD_PIXEL, GAME_WORLD_PIXEL);
}

export const meaureText = (gameCtx: GameContext, font: string, text: string): { w: number, h: number } => {
  gameCtx.ctx.font = font;
  const textMetrics = gameCtx.ctx.measureText(text);
  const w = Math.round(textMetrics.width / GAME_WORLD_PIXEL);
  const h = Math.round(textMetrics.actualBoundingBoxAscent / GAME_WORLD_PIXEL );
  return { w, h };
}

export const drawText = (gameCtx: GameContext, font: string, color: string, text:string, x: number, y: number) => {
  gameCtx.ctx.font = font;
  gameCtx.ctx.fillStyle = color;
  const canvasX = x * GAME_WORLD_PIXEL
  const canvasY = y * GAME_WORLD_PIXEL
  gameCtx.ctx.fillText(text, canvasX, canvasY);
}