import {Container, Graphics, Text} from "pixi.js";
import * as GameUtils from "../../utils/GameUtils";
import {
  getBlockWidthByKey,
  getBlockXByKey,
  getCurrentKeyIndex,
  isSpace,
} from "../../utils/BmsUtils";
import {WHITE} from "../../consts/Color";
import {DEBUG_TEXT_STYLE} from "@/game/consts/DebugConfig";

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

  // bms
  startBpm;
  bpm;
  bars; // bar 객체
  stop = 0; // stop 기준 시간

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
    this.startBpm = header.startBpm;
    this.bpm = header.startBpm;

    console.log('data : ', data);

    this.bars = data.reduce((acc, cur) => {
      if (acc[cur.bar]) {
        acc[cur.bar].push(cur);
        return acc;
      }
      acc[cur.bar] = [cur];
      return acc;
    }, []);

    for (let i = 0; i < this.bars.length; i++) {
      if (!this.bars[i]) {
        this.bars[i] = []
      }
    }
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x + BMS_X;
    this.container.y = this.y + BMS_Y;
    this.app.stage.addChild(this.container);

    this.initBoxes();
    this.initBlocks();
    this.initBars();

    this.bpm = this.startBpm;
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
        .drawRect(x, -7, width, 14);
        this.blockContainer.addChild(sprite);
      } else if (bmsChannel.startsWith("PLAYER2")) {
        // 2p
        const sprite = new Graphics()
        this.blockContainer.addChild(sprite);
      } else if (bmsChannel === "BPM") {
        // const x = getBlockXByKey(null, this.gameManager.key) + 60;
        // const width = 50;
        const sprite = new Graphics()
        // .lineStyle(1, 0xffa5ff, 1)
        // .drawRect(x, -7, width, 14);
        this.blockContainer.addChild(sprite);
      } else if (bmsChannel === "BACKGROUND") {
        const sprite = new Graphics()
        this.blockContainer.addChild(sprite);
      } else if (bmsChannel === "SEQUENCE_STOP") {
        // const x = getBlockXByKey(null, this.gameManager.key) + 110;
        // const width = 50;
        const sprite = new Graphics()
        // .lineStyle(1, 0xff00ff, 1)
        // .drawRect(x, -7, width, 14);

        this.blockContainer.addChild(sprite);
      } else {
        // managing blocks
        // const x = getBlockXByKey(null, this.gameManager.key);
        // const width = 50;
        const sprite = new Graphics()
        // .lineStyle(1, 0x00a5ff, 1)
        // .drawRect(x, -7, width, 14);
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

    this.calculateBarTime();
    console.log('bars : ', this.bars);
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

  calculateBarTime = () => {
    const elapsedTime = this.gameManager.elapsedTime;

    let lastTime = this.gameManager.initialTime;
    let lastPos = 0;
    let lastY = 0;
    let bpm = this.startBpm;
    let isFirstShow = true;
    for (let i = 0; i < this.bars.length; i++) {
      let barShorten = 1;

      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];
        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BAR_SHORTEN') {
          barShorten = block['value'];
          continue;
        }
        block['time'] = lastTime + (block['position'] - lastPos) * (1 / bpm
            * 60000 * 4) * barShorten;
        if (block['time'] > elapsedTime) {
          let time;
          if (isFirstShow) {
            time = elapsedTime;
            isFirstShow = false;
          } else {
            time = lastTime;
          }

          if (this.stop < block['time']) {
            block['y'] = lastY + (block['time'] - Math.max(time, this.stop)) * bpm * 0.005
                * this.gameManager.speed;
            lastY = block['y']
          }
        }

        lastTime = block['time'];
        lastPos = block['position'];

        if (bmsChannel === 'BPM') {
          bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          bpm = this.gameManager.bmsHeader.bpm[block['value']];
        } else if (bmsChannel === 'SEQUENCE_STOP') {
          if (this.gameManager.bmsHeader.stop[block['value']]) {
            const stopTime = this.gameManager.bmsHeader.stop[block['value']]
                / 192 / bpm * 60000 * 4;
            block['stop'] = stopTime;
            lastTime += stopTime;
          }
        }
      }

      this.bars[i]['time'] = lastTime + (1 - lastPos) * barShorten * (60000
          / bpm) * 4;
      if (this.bars[i]['time'] > elapsedTime) {
        let time;
        if (isFirstShow) {
          time = elapsedTime;
          isFirstShow = false;
        } else {
          time = lastTime;
        }

        this.bars[i]['y'] = lastY + (this.bars[i]['time'] - time) * bpm * 0.005
            * this.gameManager.speed;
        lastY = this.bars[i]['y'];
      }
      lastTime = this.bars[i]['time'];
      lastPos = 0;
    }
  }

  drawBlocks = () => {
    let idx = 0;
    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];
        const bmsChannel = block['bmsChannel'];
        if (bmsChannel.startsWith('PLAYER') || bmsChannel === "BPM"
            || bmsChannel === "SEQUENCE_STOP" || bmsChannel
            === "BPM_EXTENDED") {
          this.blockContainer.getChildAt(idx).y = BMS_HEIGHT
              - this.bars[i][j].y;
          if (block['time'] < this.gameManager.elapsedTime) {
            this.blockContainer.getChildAt(idx).y = -14;
          }
        }
        idx++;
      }
    }
  };

  drawBars = () => {
    for (let i = 0; i < this.bars.length; i++) {
      this.barContainer.getChildAt(i).y = BMS_HEIGHT - this.bars[i].y;
      if (this.bars[i]['time'] < this.gameManager.elapsedTime) {
        this.barContainer.getChildAt(i).y = -14;
      }
    }
  };

  processBlocks = () => {
    const elapsedTime = this.gameManager.elapsedTime;

    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars[i].length; j++) {
        const block = this.bars[i][j];

        if (block['played'] === true) {
          continue;
        }

        if (block['time'] > elapsedTime) {
          return;
        }

        const bmsChannel = block['bmsChannel'];
        if (bmsChannel === 'BPM') {
          this.bpm = block['value'];
        } else if (bmsChannel === 'BPM_EXTENDED') {
          this.bpm = this.gameManager.bmsHeader.bpm[block['value']];
        } else if (bmsChannel == "SEQUENCE_STOP") {
          this.stop = block['time'] + block['stop'];
          console.log('stop : ', block['stop']);
        } else if (bmsChannel.startsWith('PLAYER') || bmsChannel.startsWith(
            'BACKGROUND')) {
          try {
            this.gameManager.bmsSounds.get(block['value']).play();
          } catch (e) {
            console.error(e)
          }
          if (Math.abs(block.y) > 5) {
            console.log('not 근접 : ', block.y);
          }
        }

        block['played'] = true;
      }
    }

  }

  updateDebugState = () => {
    if (GameUtils.isDebug(this.gameManager)) {
      this.debugContainer.visible = true;
      this.debugContainer.getChildByName("debugBpm").text = "BPM : " + this.bpm;
      return;
    }
    this.debugContainer.visible = false;
  };

  update = (now) => {
    this.calculateBarTime();
    this.drawBars();
    this.drawBlocks();
    this.processBlocks();
    this.updateDebugState();
  };
}
