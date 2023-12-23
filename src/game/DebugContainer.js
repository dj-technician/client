import { Container, Graphics, Text } from "pixi.js";
import { DEBUG_TEXT_STYLE } from "./consts/DebugConfig";
import * as GameUtils from "./utils/GameUtils";
import { BMS_WIDTH, BMS_X } from "./scene/game/BmsContainer";

export class DebugContainer {
  x = 0;
  y = 0;

  constructor(manager) {
    this.manager = manager;
    this.app = manager.app;
    this.init();
  }

  init = () => {
    this.x = this.app.renderer.width / 2 - this.manager.gameWidth / 2;
    this.y = this.app.renderer.height / 2 - this.manager.gameHeight / 2;
    this.initContainer();
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x + 500;
    this.container.y = this.y + 100;
    this.app.stage.addChild(this.container);

    // game area
    const gameArea = new Graphics();
    gameArea.beginFill(0x00ff7f, 0.04);
    gameArea.drawRect(0, 0, this.manager.gameWidth, this.manager.gameHeight);
    gameArea.endFill();
    this.container.addChild(gameArea);

    const keyText = new Text("key : " + this.manager.key, DEBUG_TEXT_STYLE);
    keyText.x = BMS_X + BMS_WIDTH + 20;
    keyText.y = 100;
    keyText.name = "debugKey";
    this.container.addChild(keyText);

    const startTime = new Text(
      "startTime : " + this.manager.startTime,
      DEBUG_TEXT_STYLE
    );
    startTime.x = BMS_X + BMS_WIDTH + 20;
    startTime.y = 120;
    startTime.name = "debugStartTime";
    this.container.addChild(startTime);

    const elapsedTime = new Text(
      "elapsedTime : " + this.manager.elapsedTime,
      DEBUG_TEXT_STYLE
    );
    elapsedTime.x = BMS_X + BMS_WIDTH + 20;
    elapsedTime.y = 140;
    elapsedTime.name = "debugCurrentTime";
    this.container.addChild(elapsedTime);

    const fps = new Text("fps : " + this.manager.fps, DEBUG_TEXT_STYLE);
    fps.x = BMS_X + BMS_WIDTH + 20;
    fps.y = 80;
    fps.name = "debugFps";
    this.container.addChild(fps);
  };

  update = (now) => {
    if (GameUtils.isDebug(this.manager)) {
      this.container.getChildByName("debugKey").text =
        "key : " + this.manager.key + " KEY";
      this.container.getChildByName("debugStartTime").text =
        "startTime : " + this.manager.startTime / 1000;
      this.container.getChildByName("debugCurrentTime").text =
        "elapsedTime : " + (this.manager.elapsedTime / 1000).toFixed(3) + " s";
      this.container.getChildByName("debugFps").text =
        "fps : " + this.manager.fps;
      this.container.visible = true;
      return;
    }
    this.container.visible = false;
  };
}
