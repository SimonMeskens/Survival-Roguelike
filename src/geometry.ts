export interface Point {
   x: number;
   y: number;
}

export interface Point3D extends Point {
   z: number;
}

export interface Rectangle extends Point {
   width: number;
   height: number;
}

export const isOverlap = (
   {
      x: x1,
      y: y1,
      width: w1 = 0,
      height: h1 = 0
   }: { x: number; y: number; width?: number; height?: number },
   {
      x: x2,
      y: y2,
      width: w2 = 0,
      height: h2 = 0
   }: { x: number; y: number; width?: number; height?: number }
) => x1 <= x2 + w2 && x1 + w1 >= x2 && y1 <= y2 + h2 && y1 + h1 >= y2;
