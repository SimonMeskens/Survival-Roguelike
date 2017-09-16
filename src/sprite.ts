import { Entity, createEntity } from "./entity";
import { Rectangle } from "./geometry";

export type Image = HTMLImageElement | HTMLCanvasElement | ImageBitmap;

export interface Sprite extends Rectangle {
   image: Image;
   tileSize: number;
}

export type SpriteEntity<Type extends string> = Entity<
   Type,
   {
      sprite: Sprite | Sprite[];
   }
>;

export function isSpriteEntity<Type extends string, Extension>(
   entity: Entity<string, Extension>
): entity is Entity<
   Type,
   Extension & {
      sprite: Sprite | Sprite[];
   }
> {
   return "sprite" in entity;
}

export const createSprite = <Type extends string>({
   id,
   sprite
}: {
   id: Type;
   sprite: Sprite | Sprite[];
}) => {
   let spriteCopy = null as any;

   if (Array.isArray(sprite)) {
      spriteCopy = sprite.slice();
      for (const i in sprite) {
         sprite[i] = Object.assign(Object.create(null) as {}, sprite[i]);
      }
   } else {
      spriteCopy = Object.assign(Object.create(null) as {}, sprite);
   }

   return createEntity(id, {
      sprite: spriteCopy
   }) as SpriteEntity<Type>;
};
