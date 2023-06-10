import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { BLACK, MAGENTA_CRIMSON, WHITE } from "../../consts/Color";
import * as AssetUtils from "../../utils/AssetUtils";

export const X = 400;
export const Y = 360;
export const CIRCLE_X = 140;
export const CIRCLE_Y = 0;
export const CIRCLE_LINE_WIDTH = 16;
export const CIRCLE_LINE_ALPHA = 1;
export const CIRCLE_COLOR = WHITE;
export const CIRCLE_RADIUS = 440;
export const BOX_X = 100;
export const BOX_Y = 360;
export const BOX_WIDTH = 460;
export const BOX_HEIGHT = 300;
export const BOX_TEXT_STYLE = new TextStyle({
  fill: WHITE,
  fontFamily: "Aldrich",
  fontSize: 20,
});
export const BOX_TEXT_STYLE_RIGHT = new TextStyle({
  fill: WHITE,
  fontFamily: "Aldrich",
  fontSize: 20,
  align: "right",
});
export const BACKGROUND_COLOR = BLACK;
export const BACKGROUND_ALPHA = 0.9;

export class MusicDetailContainer {
  x = X;
  y = Y;

  constructor(manager) {
    this.manager = manager;
    this.app = manager.app;
    this.init();
  }

  init = () => {
    this.initContainer();
  };

  initContainer = () => {
    this.container = new Container();
    this.container.x = this.x;
    this.container.y = this.y;

    const circle = new Graphics()
      .lineStyle(CIRCLE_LINE_WIDTH, CIRCLE_COLOR, CIRCLE_LINE_ALPHA)
      .drawCircle(CIRCLE_X, CIRCLE_Y, CIRCLE_RADIUS);
    this.container.addChild(circle);

    this.initDetailTexture();
    this.initDetailSummaryBox();
    this.showDetailView();
  };

  initDetailTexture = () => {
    // image circle mask
    const circleMask = new Graphics()
      .beginFill(CIRCLE_COLOR)
      .drawCircle(CIRCLE_X, CIRCLE_Y, CIRCLE_RADIUS - 20)
      .endFill();
    this.container.addChild(circleMask);

    // image sprite
    const bmsHeaders = this.manager.bmsHeaders;
    const id = bmsHeaders[this.manager.currentIndex].id;
    this.bmsSprite = new Sprite();
    this.bmsSprite.texture = AssetUtils.getOrDefault("bmp01_" + id, "default");
    this.bmsSprite.anchor.set(0.5);
    this.bmsSprite.x = CIRCLE_X;
    this.bmsSprite.y = CIRCLE_Y;
    this.bmsSprite.width = CIRCLE_RADIUS * 2;
    this.bmsSprite.height = CIRCLE_RADIUS * 2;
    this.bmsSprite.mask = circleMask;
    this.container.addChild(this.bmsSprite);
  };

  initDetailSummaryBox = () => {
    const detailBoxContainer = new Container();
    detailBoxContainer.x = BOX_X;
    detailBoxContainer.y = BOX_Y;
    detailBoxContainer.width = BOX_WIDTH;
    detailBoxContainer.height = BOX_HEIGHT;

    detailBoxContainer.addChild(
      new Graphics()
        .beginFill(BACKGROUND_COLOR, BACKGROUND_ALPHA)
        .drawRect(0, 0, BOX_WIDTH, BOX_HEIGHT)
        .endFill()
    );

    detailBoxContainer.addChild(
      new Graphics()
        .lineStyle(4, MAGENTA_CRIMSON, 0.8)
        .moveTo(0, 0)
        .lineTo(0, BOX_HEIGHT)
        .moveTo(BOX_WIDTH, 0)
        .lineTo(BOX_WIDTH, BOX_HEIGHT)
    );

    const bmsGenreTitle = new Text("genre", BOX_TEXT_STYLE);
    bmsGenreTitle.x = 20;
    bmsGenreTitle.y = 20;
    detailBoxContainer.addChild(bmsGenreTitle);

    const bmsArtistTitle = new Text("artist", BOX_TEXT_STYLE);
    bmsArtistTitle.x = 20;
    bmsArtistTitle.y = 80;
    detailBoxContainer.addChild(bmsArtistTitle);

    const bmsBpmTitle = new Text("bpm", BOX_TEXT_STYLE);
    bmsBpmTitle.x = 20;
    bmsBpmTitle.y = 140;
    detailBoxContainer.addChild(bmsBpmTitle);

    const bmsPlayLevelTitle = new Text("playlevel", BOX_TEXT_STYLE);
    bmsPlayLevelTitle.x = 20;
    bmsPlayLevelTitle.y = 200;
    detailBoxContainer.addChild(bmsPlayLevelTitle);

    const bmsTotalTitle = new Text("total", BOX_TEXT_STYLE);
    bmsTotalTitle.x = 20;
    bmsTotalTitle.y = 260;
    detailBoxContainer.addChild(bmsTotalTitle);

    this.bmsGenre = new Text("", BOX_TEXT_STYLE_RIGHT);
    this.bmsGenre.anchor.set(1, 0);
    this.bmsGenre.x = BOX_WIDTH - 20;
    this.bmsGenre.y = 20;
    detailBoxContainer.addChild(this.bmsGenre);

    this.bmsArtist = new Text("", BOX_TEXT_STYLE);
    this.bmsArtist.anchor.set(1, 0);
    this.bmsArtist.x = BOX_WIDTH - 20;
    this.bmsArtist.y = 80;
    detailBoxContainer.addChild(this.bmsArtist);

    this.bmsBpm = new Text("", BOX_TEXT_STYLE);
    this.bmsBpm.anchor.set(1, 0);
    this.bmsBpm.x = BOX_WIDTH - 20;
    this.bmsBpm.y = 140;
    detailBoxContainer.addChild(this.bmsBpm);

    this.bmsPlayLevel = new Text("", BOX_TEXT_STYLE_RIGHT);
    this.bmsPlayLevel.anchor.set(1, 0);
    this.bmsPlayLevel.x = BOX_WIDTH - 20;
    this.bmsPlayLevel.y = 200;
    detailBoxContainer.addChild(this.bmsPlayLevel);

    this.bmsTotal = new Text("", BOX_TEXT_STYLE);
    this.bmsTotal.anchor.set(1, 0);
    this.bmsTotal.x = BOX_WIDTH - 20;
    this.bmsTotal.y = 260;
    detailBoxContainer.addChild(this.bmsTotal);

    this.container.addChild(detailBoxContainer);
  };

  showDetailView = () => {
    const bmsHeaders = this.manager.bmsHeaders;
    const id = bmsHeaders[this.manager.currentIndex].id;
    this.bmsSprite.texture = AssetUtils.getOrDefault("bmp01_" + id, "default");

    this.bmsGenre.text = bmsHeaders[this.manager.currentIndex].genre;
    this.bmsArtist.text = bmsHeaders[this.manager.currentIndex].artist;
    this.bmsBpm.text = bmsHeaders[this.manager.currentIndex].startBpm;
    this.bmsPlayLevel.text = bmsHeaders[this.manager.currentIndex].playLevel;
    this.bmsTotal.text = bmsHeaders[this.manager.currentIndex].total;
  };

  update = (deltaTime) => {};
}
