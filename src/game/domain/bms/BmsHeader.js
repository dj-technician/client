export class BmsHeader {
  id;
  player;
  genre;
  title;
  artist;
  startBpm;
  playLevel;
  rank;
  total;
  stageFile;
  bmp01;
  wav;
  bpm;
  stop;
  difficulty;
  random;

  constructor(jsonObject) {
    Object.assign(this, jsonObject["bmsHeader"]);
    this.id = jsonObject["id"];
  }
}
