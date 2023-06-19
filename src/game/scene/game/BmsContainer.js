import { Container, Graphics } from "pixi.js";
import * as GameUtils from "../../utils/GameUtils";
import {
  getBlockWidthByKey,
  getBlockXByKey,
  getCurrentKeyIndex,
  isSpace,
} from "../../utils/BmsUtils";
import { WHITE } from "../../consts/Color";

export const BOX_LINE_WIDTH = 2;
export const BOX_LINE_COLOR = WHITE;
export const BOX_LINE_ALPHA = 1;
export const GUIDE_LINE_WIDTH = 1;
export const GUIDE_LINE_COLOR = WHITE;
export const GUIDE_LINE_ALPHA = 0.15;

export const BMS_X = 200;
export const BMS_Y = 0;
export const BMS_WIDTH = 450;
export const BMS_HEIGHT = 800;
export const SCRATCH_RATIO = 0.16;
export const SPACE_RATIO = 0.15;

export class BmsContainer {
  x = 0;
  y = 0;
  latestBlockIndex = 0;

  constructor(gameManager) {
    this.gameManager = gameManager;
    this.app = gameManager.app;
    this.init();
  }

  init = () => {
    // this.x = this.app.renderer.width / 2 - this.gameManager.gameWidth / 2;
    // this.y = this.app.renderer.height / 2 - this.gameManager.gameHeight / 2;
    this.initContainer();
    this.initDebugger();
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x + BMS_X;
    this.container.y = this.y + BMS_Y;
    this.app.stage.addChild(this.container);

    this.initBoxes();
    this.initBlocks();
  };

  initBoxes = () => {
    // bms box line
    const boxLine = new Graphics()
      .lineStyle(BOX_LINE_WIDTH, BOX_LINE_COLOR, BOX_LINE_ALPHA)
      .drawRect(0, 0, BMS_WIDTH, BMS_HEIGHT);
    this.container.addChild(boxLine);

    // bms guide line
    const scratchWidth = BMS_WIDTH * SCRATCH_RATIO;
    const spaceWidth = BMS_WIDTH * SPACE_RATIO;
    const scratchLine = new Graphics()
      .lineStyle(GUIDE_LINE_WIDTH, GUIDE_LINE_COLOR, GUIDE_LINE_ALPHA)
      .moveTo(scratchWidth, BMS_Y)
      .lineTo(scratchWidth, BMS_HEIGHT);
    this.container.addChild(scratchLine);
    let currentX = scratchWidth;
    for (let i = 0; i < this.gameManager.key - 1; i++) {
      let guideLineX =
        currentX +
        (BMS_WIDTH - scratchWidth - spaceWidth) / (this.gameManager.key - 1);
      if (isSpace(i, this.gameManager.key)) {
        guideLineX = currentX + spaceWidth;
      }
      const guideLine = new Graphics()
        .lineStyle(GUIDE_LINE_WIDTH, GUIDE_LINE_COLOR, GUIDE_LINE_ALPHA)
        .moveTo(guideLineX, BMS_Y)
        .lineTo(guideLineX, BMS_HEIGHT);
      this.container.addChild(guideLine);
      currentX = guideLineX;
    }
  };

  initBlocks = () => {
    this.blockContainer = new Container();
    this.blockContainer.x = this.x + BMS_X;
    this.blockContainer.y = this.y + BMS_Y;
    this.app.stage.addChild(this.blockContainer);

    const blocks = this.gameManager.bmsData;
    // const blocks = this.gameManager.bms.blocks;
    for (let i = 0; i < blocks.length; i++) {
      const bmsChannel = blocks[i].bmsChannel;
      if (bmsChannel.startsWith("PLAYER1")) {
        // 1p
        const currentKeyIndex = getCurrentKeyIndex(bmsChannel.split("_")[1]);
        const x = getBlockXByKey(currentKeyIndex, this.gameManager.key);
        const width = getBlockWidthByKey(currentKeyIndex, this.gameManager.key);
        const sprite = new Graphics()
          .lineStyle(1, 0xffa500, 1)
          .drawRect(x, 0, width, 14);
        this.blockContainer.addChild(sprite);
      } else if (bmsChannel.startsWith("PLAYER2")) {
        // 2p
      }

      // todo
    }
  };

  initDebugger = () => {
    this.debugContainer = new Container();
    this.debugContainer.x = this.x + BMS_X;
    this.debugContainer.y = this.y + BMS_Y;
    this.app.stage.addChild(this.debugContainer);

    // bms area
    const debugArea = new Graphics()
      .beginFill(0x00ff00, 0.04)
      .drawRect(0, 0, BMS_WIDTH, BMS_HEIGHT)
      .endFill();
    this.debugContainer.addChild(debugArea);
  };

  updateBlocks = (now) => {
    const elapsedTime = this.gameManager.elapsedTime;
    // todo bms position 계산 - 핵심!!!
    // const blocks = this.gameManager.bms.blocks;
    // for (let i = this.latestBlockIndex; i < blocks.length; i++) {
    //   const block = blocks[i];
    //   const y = elapsedTime - block.time + BMS_Y + BMS_HEIGHT;
    //   if (y < 0) {
    //     return;
    //   }
    //   if (y > this.gameManager.gameHeight) {
    //     this.latestBlockIndex = i + 1;
    //   }
    //   this.blockContainer.getChildAt(i).y = y;
    // }
  };

  updateDebugState = () => {
    if (GameUtils.isDebug(this.gameManager)) {
      this.debugContainer.visible = true;
      return;
    }
    this.debugContainer.visible = false;
  };

  update = (now) => {
    this.updateBlocks(now);
    this.updateDebugState();
  };

  render = () => {};
}
