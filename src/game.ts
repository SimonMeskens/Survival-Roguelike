import * as config from "./game.config";
import { createScene, addChild } from "./scene";
import { createSprite, SpriteEntity, Sprite } from "./sprite";
import { Point3D } from "./geometry";
import { extendEntity, Entity } from "./entity";

export const scene = createScene();

export const playerCamera = {
   scene: scene,
   tileSize: 48,
   x: 0,
   y: 0,
   width: 12,
   height: 12,
   focus: {
      width: 6,
      height: 6
   }
};

const tileEntities: { [N in string]: SpriteEntity<N> } = ((
   tiles: { [N in string]: Entity<N, { sprite: Sprite }> }
) => {
   const entities = {} as { [N in string]: SpriteEntity<N> };

   for (const name in tiles) {
      const entity = createSprite(tiles[name]);

      if (isCollidable(tiles[name])) {
         (entity as any).collision = (tiles[name] as any).collision;
      }

      entities[entity.id] = entity;
   }

   return entities;
})(config.entities.tiles);

const addTile = (name: string, location: Point3D) => {
   return extendEntity(addChild(scene.root, tileEntities[name]).entity, {
      location
   });
};

tileEntities.player = createSprite(config.entities.player);

let player: Entity<"player", { location: Point3D }> = null as any;

function isCollidable<Type extends string, Extension>(
   entity: Entity<Type, Extension>
): entity is Entity<Type, Extension & { collision: boolean }> {
   return "collision" in entity;
}

const collisionMap: boolean[][] = [];

for (let z = 0; z < config.map.length; z++) {
   for (let y = 0; y < config.map[z].length; y++) {
      for (let x = 0; x < config.map[z][y].length; x++) {
         const name = config.tiles[config.map[z][y][x]];

         const entity = addTile(name, {
            x,
            y,
            z
         });

         if (isCollidable(entity)) {
            if (!collisionMap[x]) {
               collisionMap[x] = [];
            }
            collisionMap[x][y] = entity.collision;
         }

         if (name === "player") {
            player = entity as any;
         }
      }
   }
}

playerCamera.x = Math.floor(player.location.x - playerCamera.width / 2);
playerCamera.y = Math.floor(player.location.y - playerCamera.height / 2);

export enum KeyMap {
   "left" = 37,
   "up" = 38,
   "right" = 39,
   "down" = 40
}

export const handleInput = (keysPressed: { [key: number]: boolean }) => {
   let turnTaken = false;
   let vecMovement: [number, number] = [0, 0];

   const collisionAt = (relX: number, relY: number) => {
      const newX = player.location.x + relX;
      const newY = player.location.y + relY;
      return collisionMap[newX] && collisionMap[newX][newY];
   };

   if (keysPressed[KeyMap.left] && !collisionAt(-1, 0)) vecMovement[0]--;
   if (keysPressed[KeyMap.up] && !collisionAt(0, -1)) vecMovement[1]--;
   if (keysPressed[KeyMap.right] && !collisionAt(1, 0)) vecMovement[0]++;
   if (keysPressed[KeyMap.down] && !collisionAt(0, 1)) vecMovement[1]++;

   // No diagonal movement
   if (Math.abs(vecMovement[0]) + Math.abs(vecMovement[1]) === 1) {
      player.location.x += vecMovement[0];
      player.location.y += vecMovement[1];

      const cameraMarginX = Math.floor(
         (playerCamera.width - playerCamera.focus.width) / 2
      );
      const cameraMarginY = Math.floor(
         (playerCamera.height - playerCamera.focus.height) / 2
      );
      if (
         player.location.x >=
         playerCamera.focus.width + playerCamera.x + cameraMarginX
      ) {
         playerCamera.x =
            player.location.x + 1 - playerCamera.focus.width - cameraMarginX;
      }
      if (
         player.location.y >=
         playerCamera.focus.height + playerCamera.y + cameraMarginY
      ) {
         playerCamera.y =
            player.location.y + 1 - playerCamera.focus.height - cameraMarginY;
      }
      if (player.location.x < playerCamera.x + cameraMarginX) {
         playerCamera.x = player.location.x - cameraMarginX;
      }
      if (player.location.y < playerCamera.y + cameraMarginY) {
         playerCamera.y = player.location.y - cameraMarginY;
      }

      turnTaken = true;
   }

   return turnTaken;
};
