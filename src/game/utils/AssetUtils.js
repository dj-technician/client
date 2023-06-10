import { Assets } from "pixi.js";

export function getOrDefault(name, sub) {
  try {
    const asset = Assets.get(name);
    if (!asset) {
      throw new Error();
    }
    return asset;
  } catch (e) {
    return Assets.get(sub);
  }
}