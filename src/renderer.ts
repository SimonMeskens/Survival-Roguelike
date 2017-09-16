import { Sprite, SpriteEntity, isSpriteEntity } from "./sprite";
import { Scene } from "./scene";
import { Rectangle, isOverlap, Point3D } from "./geometry";
import { isTangibleEntity, Entity } from "./entity";

export interface Camera extends Rectangle {
   scene: Scene;
   canvas: HTMLCanvasElement;
   tileSize: number;
}

const drawSprite = (
   ctx: CanvasRenderingContext2D,
   sprite: Sprite,
   tileSize: number,
   dstX: number,
   dstY: number
) => {
   ctx.drawImage(
      sprite.image,
      sprite.x * sprite.tileSize,
      sprite.y * sprite.tileSize,
      sprite.width * sprite.tileSize,
      sprite.height * sprite.tileSize,
      dstX * tileSize,
      dstY * tileSize,
      sprite.width * tileSize,
      sprite.height * tileSize
   );
};

const drawEntity = (
   ctx: CanvasRenderingContext2D,
   entity: SpriteEntity<string>,
   animation: number,
   tileSize: number,
   dstX: number,
   dstY: number
) => {
   const sprite = Array.isArray(entity.sprite)
      ? entity.sprite[animation % entity.sprite.length]
      : entity.sprite;
   drawSprite(ctx, sprite, tileSize, dstX, dstY);
};

export const render = ({
   ctx,
   camera,
   animState
}: {
   ctx: CanvasRenderingContext2D;
   camera: Camera;
   animState: number;
}) => {
   ctx.imageSmoothingEnabled = false;

   ctx.fillStyle = "black";
   ctx.fillRect(0, 0, camera.canvas.width, camera.canvas.height);

   const sprites: {
      [key: number]: Entity<
         string,
         { sprite: Sprite | Sprite[]; location: Point3D }
      >[];
   } = Object.create(null);

   for (const node of camera.scene.nodes) {
      const entity = node.entity;
      if (
         isSpriteEntity(entity) &&
         isTangibleEntity(entity) &&
         isOverlap(camera, entity.location)
      ) {
         sprites[entity.location.z] = sprites[entity.location.z] || [];

         sprites[entity.location.z].push(entity);
      }
   }

   for (const z in sprites) {
      for (const sprite of sprites[z]) {
         drawEntity(
            ctx,
            sprite,
            animState,
            camera.tileSize,
            sprite.location.x - camera.x,
            sprite.location.y - camera.y
         );
      }
   }
};
