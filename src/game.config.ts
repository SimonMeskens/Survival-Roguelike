const getImageFromId = (id: string): HTMLImageElement =>
   document.getElementById(id) as HTMLImageElement;

export const entities = {
   player: {
      id: "player" as "player",
      sprite: [
         {
            image: getImageFromId("resource-player0"),
            tileSize: 16,
            x: 2,
            y: 3,
            width: 1,
            height: 1
         },
         {
            image: getImageFromId("resource-player1"),
            tileSize: 16,
            x: 2,
            y: 3,
            width: 1,
            height: 1
         }
      ]
   },
   // Better way to handle tiles/tilesets?
   tiles: {
      grass: {
         id: "tiles/grass" as "tiles/grass",
         sprite: {
            image: getImageFromId("resource-floor"),
            tileSize: 16,
            x: 8,
            y: 7,
            width: 1,
            height: 1
         },
         collision: false
      },
      wall: {
         id: "tiles/wall" as "tiles/wall",
         sprite: {
            image: getImageFromId("resource-wall"),
            tileSize: 16,
            x: 3,
            y: 3,
            width: 1,
            height: 1
         },
         collision: true
      }
   }
};

export const map = [
   [
      "################",
      "#..............#",
      "#..............#",
      "#..............#",
      "#..............#",
      "#..............#",
      "#....######....#",
      "#....#....#....#",
      "#....#....#....#",
      "#....#....#....#",
      "#....##.###....#",
      "#..............#",
      "#..............#",
      "#..............#",
      "#..............#",
      "################"
   ],
   [
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "       @        ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                "
   ]
];

export const tiles: {
   [key: string]: string;
} = {
   "#": entities.tiles.wall.id,
   ".": entities.tiles.grass.id,
   "@": entities.player.id
};
