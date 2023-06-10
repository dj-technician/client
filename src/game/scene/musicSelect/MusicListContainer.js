import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { BLACK, MAGENTA_CRIMSON, WHITE } from "../../consts/Color";

export const X = 1000;
export const Y = 300;
export const BORDER_LINE_WIDTH = 4;
export const LINE_WIDTH = 0.1;
export const LINE_COLOR = MAGENTA_CRIMSON;
export const LINE_ALPHA = 0.8;
export const WIDTH = 800;
export const HEIGHT = 720;
export const ITEM_HEIGHT = 60;
export const PADDING = 20;
export const TEXT_PADDING = 16;
export const ITEM_TEXT_STYLE = new TextStyle({
  fill: WHITE,
  fontFamily: "Aldrich",
  // fontFamily: "Electrolize",
  // fontFamily: "Changa",
  // fontFamily: "Orbitron",
  fontSize: 24,
});

export class MusicListContainer {
  x = X;
  y = Y;

  constructor(manager) {
    this.manager = manager;
    this.app = manager.app;
    this.init();
  }

  init = () => {
    this.initContainer();
    this.initMenuContainer();
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x;
    this.container.y = this.y;

    const background = new Graphics()
      .beginFill(BLACK, 0.9)
      .drawRect(0, 0, WIDTH, HEIGHT)
      .endFill();
    this.container.addChild(background);

    const topLine = new Graphics()
      .lineStyle(BORDER_LINE_WIDTH, LINE_COLOR, LINE_ALPHA)
      .moveTo(0, 0)
      .lineTo(WIDTH, 0);
    this.container.addChild(topLine);

    const bottomLine = new Graphics()
      .lineStyle(BORDER_LINE_WIDTH, LINE_COLOR, LINE_ALPHA)
      .moveTo(0, HEIGHT)
      .lineTo(WIDTH, HEIGHT);
    this.container.addChild(bottomLine);

    const selectBox = new Graphics()
      // .beginFill(0xff007f, 0.2)
      .beginFill(MAGENTA_CRIMSON, 0.8)
      .drawRect(0, 5 * ITEM_HEIGHT, WIDTH, ITEM_HEIGHT)
      .endFill();
    this.container.addChild(selectBox);
  };

  initMenuContainer = () => {
    this.menuContainer = new Container();
    this.menuContainer.x = 0;
    this.menuContainer.y = 0;
    this.container.addChild(this.menuContainer);

    const bmsHeaders = this.manager.bmsHeaders;
    for (let i = 0; i < bmsHeaders.length; i++) {
      const itemContainer = new Container();
      itemContainer.x = PADDING;
      itemContainer.y = ITEM_HEIGHT * i;
      this.menuContainer.addChild(itemContainer);

      const title = new Text(
        "" +
          i.toString().padStart(2, "0") +
          ". [" +
          bmsHeaders[i].playLevel.toString().padStart(2, "0") +
          "]  " +
          bmsHeaders[i].title,
        ITEM_TEXT_STYLE
      );

      title.y += TEXT_PADDING;
      itemContainer.addChild(title);

      const subLine = new Graphics()
        .lineStyle(LINE_WIDTH, LINE_COLOR, 0.3)
        .moveTo(0, ITEM_HEIGHT)
        .lineTo(WIDTH - PADDING * 2, ITEM_HEIGHT);
      itemContainer.addChild(subLine);
    }
    this.showOnlyInList();
  };

  showOnlyInList = () => {
    const bmsHeaders = this.manager.bmsHeaders;
    const listSize = HEIGHT / ITEM_HEIGHT;
    const centerIndex = listSize / 2 - 1;
    const currentMusicIndex = this.manager.currentIndex;
    const startMusicIndex =
      currentMusicIndex > centerIndex
        ? currentMusicIndex - centerIndex
        : (bmsHeaders.length + currentMusicIndex - centerIndex) %
          bmsHeaders.length;

    for (let i = 0; i < bmsHeaders.length; i++) {
      this.menuContainer.getChildAt(i).visible = false;
    }

    let cnt = 0;
    for (
      let i = startMusicIndex;
      cnt < listSize;
      i = (startMusicIndex + ++cnt) % bmsHeaders.length
    ) {
      const itemContainer = this.menuContainer.getChildAt(i);
      itemContainer.y = ITEM_HEIGHT * cnt;
      itemContainer.visible = true;
    }
  };

  update = (deltaTime) => {};
}
