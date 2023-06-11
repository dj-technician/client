import { Application } from "pixi.js";
import { BmsContainer } from "./BmsContainer";
import { DebugContainer } from "../../DebugContainer";

export class GameManager {
  // common variable
  x = 0;
  y = 0;
  debugMode = false;
  gameWidth = 1920;
  gameHeight = 1080;
  startTime;
  elapsedTime = 0;
  lastFrameTime;
  fps = 0;
  elapsedFrameCount = 0;

  // game variable
  key;
  bms;
  speed;

  // game resources
  bmsSounds;

  constructor(ctx, key, bms, bmsSounds, debugMode) {
    this.ctx = ctx;
    this.key = key;
    this.bms = bms;
    this.bmsSounds = bmsSounds;
    this.debugMode = debugMode;
    this.init();
  }

  init = () => {
    this.app = new Application({
      view: this.ctx,
      resolution: 1,
      autoDensity: true,
      backgroundColor: 0x000000,
      width: this.ctx.width,
      height: this.ctx.height,
      antialias: true,
      forceCanvas: false,
    });
    this.containers = [new DebugContainer(this), new BmsContainer(this)];
    this.x = this.app.renderer.width / 2 - this.gameWidth / 2;
    this.y = this.app.renderer.height / 2 - this.gameHeight / 2;
    this.app.ticker.add(this.update);
  };

  updateTimeAndFps = (now) => {
    if (!this.startTime) {
      this.startTime = 0;
    }
    if (!this.lastFrameTime) {
      this.lastFrameTime = now;
    }
    this.elapsedTime = now - this.startTime;

    if (now - this.lastFrameTime > 1000) {
      const deltaTime = (now - this.lastFrameTime) / this.elapsedFrameCount;
      this.fps = Math.round(1000 / deltaTime);
      this.elapsedFrameCount = 0;
      this.lastFrameTime = now;
    } else {
      this.elapsedFrameCount++;
    }
  };

  update = (deltaTime) => {
    const now = performance.now();
    this.updateTimeAndFps(now);
    for (let i = 0; i < this.containers.length; i++) {
      this.containers[i].update(now);
    }
  };
}
