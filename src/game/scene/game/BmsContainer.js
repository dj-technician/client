import { Container, Graphics, Text } from "pixi.js";
import * as GameUtils from "../../utils/GameUtils";
import {
  getBlockWidthByKey,
  getBlockXByKey,
  getCurrentKeyIndex,
  isSpace,
} from "../../utils/BmsUtils";
import { WHITE } from "../../consts/Color";
import { DEBUG_TEXT_STYLE } from "@/game/consts/DebugConfig";

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

  // bms
  bpm;
  beat; // bar 단위
  bars; // bar 객체
  barHeight = 1; // bar

  constructor(gameManager) {
    this.gameManager = gameManager;
    this.app = gameManager.app;
    this.init();
  }

  init = () => {
    // this.x = this.app.renderer.width / 2 - this.gameManager.gameWidth / 2;
    // this.y = this.app.renderer.height / 2 - this.gameManager.gameHeight / 2;
    this.initBms();
    this.initContainer();
    this.initDebugger();
  };

  initBms = () => {
    const header = this.gameManager.bmsHeader;
    const data = this.gameManager.bmsData;
    this.bpm = header.startBpm;
    this.beats = 0;

    this.bars = data.reduce((acc, cur) => {
      if (acc[cur.bar]) {
        acc[cur.bar].push(cur);
        return acc;
      }
      acc[cur.bar] = [cur];
      return acc;
    }, []);
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x + BMS_X;
    this.container.y = this.y + BMS_Y;
    this.app.stage.addChild(this.container);

    this.initBoxes();
    this.initBlocks();
    this.initBars();
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
      } else {
        // managing blocks
        const x = getBlockXByKey(null, this.gameManager.key);
        const width = 100;
        const sprite = new Graphics()
          .lineStyle(1, 0x00a5ff, 1)
          .drawRect(x, 0, width, 14);
        this.blockContainer.addChild(sprite);
      }

      // todo
    }
  };

  initBars = () => {
    this.barContainer = new Container();
    this.barContainer.x = this.x + BMS_X;
    this.barContainer.y = this.y + BMS_Y;
    this.app.stage.addChild(this.barContainer);

    const bars = this.bars;
    // const blocks = this.gameManager.bms.blocks;
    console.log(bars.length);
    for (let i = 0; i < bars.length; i++) {
      const sprite = new Graphics()
        .lineStyle(GUIDE_LINE_WIDTH, GUIDE_LINE_COLOR, 1)
        .moveTo(0, 0)
        .lineTo(BMS_WIDTH, 0);
      this.barContainer.addChild(sprite);
    }
  };

  initDebugger = () => {
    this.debugContainer = new Container();
    this.debugContainer.x = this.x + BMS_X;
    this.debugContainer.y = this.y + BMS_Y;
    this.app.stage.addChild(this.debugContainer);

    // music info
    const bpm = new Text("bpm : ", DEBUG_TEXT_STYLE);
    bpm.x = 0;
    bpm.y = BMS_HEIGHT + 20;
    bpm.name = "debugBpm";
    this.debugContainer.addChild(bpm);

    // bms area
    const debugArea = new Graphics()
      .beginFill(0x00ff00, 0.04)
      .drawRect(0, 0, BMS_WIDTH, BMS_HEIGHT)
      .endFill();
    this.debugContainer.addChild(debugArea);

    this.updateDebugState();
  };

  updateBars = (now) => {
    const elapsedTime = this.gameManager.elapsedTime;

    for (let i = 0; i < this.bars.length; i++) {
      const targetTime =
        this.gameManager.initialTime +
        (60000 / this.bpm) * this.barHeight * 4 * i;
      const remained = (targetTime - elapsedTime) * this.gameManager.speed;
      this.barContainer.getChildAt(i).y = BMS_HEIGHT - remained;
    }
  };

  updateBlocks = (now) => {
    const elapsedTime = this.gameManager.elapsedTime;
    // todo bms position 계산 - 핵심!!!
    const blocks = this.gameManager.bmsData;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const y = elapsedTime;
    }

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
      this.debugContainer.getChildByName("debugBpm").text = "BPM : " + this.bpm;
      return;
    }
    this.debugContainer.visible = false;
  };

  update = (now) => {
    this.updateBars(now);
    this.updateBlocks(now);
    this.updateDebugState();
  };

  render = () => {};
}
