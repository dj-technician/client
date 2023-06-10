import { Application, Container } from "pixi.js";
import { DebugContainer } from "../../DebugContainer";
import { MusicListContainer } from "./MusicListContainer";
import { Key, Keyboard } from "../common/Keyboard";
import { MusicDetailContainer } from "./MusicDetailContainer";
import { Howler } from "howler";

export class MusicSelectManager {
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
  bmsHeaders;
  currentIndex = 0;

  constructor(ctx, vue, bmsHeaders, sounds, debugMode) {
    this.ctx = ctx;
    this.debugMode = debugMode;
    this.bmsHeaders = bmsHeaders;
    this.sounds = sounds;
    this.vue = vue;
    this.init();
  }

  init = () => {
    this.app = new Application({
      view: this.ctx,
      resolution: 1,
      antialias: true,
      backgroundColor: 0x000000,
      width: this.ctx.width,
      height: this.ctx.height,
      forceCanvas: false,
    });

    this.containers = [
      new DebugContainer(this),
      new MusicDetailContainer(this),
      new MusicListContainer(this),
    ];

    this.container = new Container();
    this.container.x = this.x;
    this.container.y = this.y;
    this.container.scale.x = this.ctx.width / this.gameWidth;
    this.container.scale.y = this.ctx.height / this.gameHeight;
    this.app.stage.addChild(this.container);
    this.containers.forEach((con) => {
      this.container.addChild(con.container);
    });

    this.initKeys();
    this.app.ticker.add(this.update);
  };

  initKeys = () => {
    this.keyboard = new Keyboard(
      100,
      new Key(
        "ArrowUp",
        () => {
          this.currentIndex =
            this.currentIndex === 0
              ? this.bmsHeaders.length - 1
              : this.currentIndex - 1;
          this.handleCurrentChanged();
        },
        () => {}
      ),
      new Key(
        "ArrowDown",
        () => {
          this.currentIndex = (this.currentIndex + 1) % this.bmsHeaders.length;
          this.handleCurrentChanged();
        },
        () => {}
      ),
      new Key(
        "Enter",
        () => {
          this.enterGame();
        },
        () => {}
      )
    );
  };

  handleCurrentChanged = () => {
    this.sounds["beep"].play();
    this.containers[2].showOnlyInList();
    this.containers[1].showDetailView();
  };

  enterGame = () => {
    this.sounds["select"].play();
    setTimeout(() => {
      Howler.unload();
      this.vue.$router.replace({
        name: "game",
        query: {
          id: this.bmsHeaders[this.currentIndex]['id']
        }
        // params: { "id": this.currentIndex },
      });
    }, 500);
  };

  updateTimeAndFps = (now) => {
    if (!this.startTime) {
      this.startTime = now;
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

  update = () => {
    const now = performance.now();
    this.updateTimeAndFps(now);
    for (let i = 0; i < this.containers.length; i++) {
      this.containers[i].update(now);
    }
  };
}