import { Application } from "pixi.js";
import { BmsContainer } from "./BmsContainer";
import { DebugContainer } from "../../DebugContainer";
import { Key, Keyboard } from "@/game/scene/common/Keyboard";

const GAME_READY = 0;
const GAME_PAUSE = 1;
const GAME_PLAYING = 2;
const GAME_END = 3;

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
  gameStatus = GAME_READY; // 0 : ready, 1 : pause, 2 : playing, 3: end

  // game variable
  key;
  bms;
  bmsHeader;
  bmsData;
  speed;

  // game resources
  bmsSounds;
  sounds;

  constructor(ctx, vue, key, bms, bmsSounds, sounds, debugMode) {
    this.ctx = ctx;
    this.key = key;
    this.bms = bms;
    this.vue = vue;
    this.bmsHeader = bms.bmsHeader;
    this.bmsData = bms.bmsData;
    this.bmsSounds = bmsSounds;
    this.sounds = sounds;
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

    this.initKeys();

    this.app.ticker.add(this.update);
  };

  initKeys = () => {
    this.keyboard = new Keyboard(
      100,
      new Key(
        "Enter",
        () => {
          this.toggleGameStatus();
        },
        () => {}
      )
    );
  };

  toggleGameStatus = () => {
    if (GAME_READY === this.gameStatus) {
      // start the game
      this.sounds["start"].play();
      this.gameStatus = GAME_PLAYING;
    } else if (GAME_PAUSE === this.gameStatus) {
      // resume the game
      this.sounds["start"].play();
      this.gameStatus = GAME_PLAYING;
    } else if (GAME_PLAYING === this.gameStatus) {
      // pause the game
      this.sounds["beep"].play();
      this.gameStatus = GAME_PAUSE;
    } else if (GAME_END === this.gameStatus) {
      // todo
    }
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

    if (GAME_PLAYING === this.gameStatus) {
      this.updateTimeAndFps(now);
      for (let i = 0; i < this.containers.length; i++) {
        this.containers[i].update(now);
      }
    }
  };
}
