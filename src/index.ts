import { render, Camera } from "./renderer";
import { KeyMap, handleInput, playerCamera } from "./game";

// Setup

const $canvas = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = (() => {
   const context = $canvas.getContext("2d");

   if (context === null) throw new Error("No context!");
   else return context as CanvasRenderingContext2D;
})();

$canvas.width = 576;
$canvas.height = 576;
$canvas.style.position = "absolute";
$canvas.style.top = "0";
$canvas.style.left = "0";
$canvas.style.bottom = "0";
$canvas.style.right = "0";
$canvas.style.margin = "auto";
ctx.imageSmoothingEnabled = false;

document.body.appendChild($canvas);

// Input
// TODO: clean up buffering code, optimize?

const keysDown: { [key: number]: boolean } = Object.create(null);
const keysUp: typeof keysDown = Object.create(null);

window.addEventListener("keydown", e => {
   if (e.keyCode in KeyMap) {
      keysDown[e.keyCode] = true;
      e.preventDefault();
   }
});
window.addEventListener("keyup", e => {
   if (e.keyCode in KeyMap) {
      keysUp[e.keyCode] = true;
      e.preventDefault();
   }
});

let prevInput = 0;

const input = () => {
   const delta = time.curTime - prevInput;

   let keyPressed = false;

   for (let keyCode in KeyMap) {
      if (!isNaN(Number(keyCode))) {
         if (delta < time.animResolution) {
            keysDown[keyCode] = keysUp[keyCode] ? false : keysDown[keyCode];
            keysUp[keyCode] = false;
            keyPressed = false;
         } else {
            keyPressed = keysDown[keyCode] || keyPressed;
         }
      }
   }

   if (keyPressed) {
      const turnTaken = handleInput(
         Object.assign(Object.create(null), keysDown)
      );

      if (turnTaken) prevInput = time.curTime;
   }
};

// FPS Counter

declare class Stats {
   dom: Node;
   update: () => void;
}

const stats = new Stats();
document.body.appendChild(stats.dom);

// Render Loop

const time = {
   start: 0,
   prevTime: 0,
   curTime: performance.now(),
   animCounter: 0,
   animState: 0,
   animResolution: 500
};

const camera = (camera => {
   camera.canvas = $canvas;
   return camera;
})((playerCamera as any) as Camera);

requestAnimationFrame(function loop() {
   if (time.start === 0) time.start = performance.now();
   time.curTime = performance.now();
   const deltaTime = time.curTime - time.prevTime;

   time.animCounter += deltaTime;
   time.animState = Math.floor(time.animCounter / time.animResolution);

   input();

   if (time.prevTime !== 0) {
      render({
         camera,
         animState: time.animState
      });
   }

   stats.update();
   requestAnimationFrame(loop);
   time.prevTime = time.curTime;
});
