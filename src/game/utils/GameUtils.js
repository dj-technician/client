import {
  BMS_WIDTH,
  SCRATCH_RATIO,
  SPACE_RATIO,
} from "../scene/game/BmsContainer";

export function isDebug(gameManager) {
  return gameManager.debugMode === true;
}

export function isSpace(index, key) {
  return index === getSpaceIndex(key);
}

export function getSpaceIndex(key) {
  if (key == 7) {
    return 3;
  }
  if (key == 5) {
    return 2;
  }
  throw new Error("Unavailable key types");
}

export function getBlockXByKey(currentKey, key) {
  const scratchWidth = BMS_WIDTH * SCRATCH_RATIO;
  const spaceWidth = BMS_WIDTH * SPACE_RATIO;
  let currentX = scratchWidth;
  for (let i = 0; i < currentKey; i++) {
    let guideLineX =
      currentX + (BMS_WIDTH - scratchWidth - spaceWidth) / (key - 1);
    if (isSpace(i, key)) {
      guideLineX = currentX + spaceWidth;
    }
    currentX = guideLineX;
  }
  return currentX;
}

export function getBlockWidthByKey(currentKey, key) {
  const scratchWidth = BMS_WIDTH * SCRATCH_RATIO;
  const spaceWidth = BMS_WIDTH * SPACE_RATIO;
  if (isSpace(currentKey, key)) {
    return spaceWidth;
  }
  return (BMS_WIDTH - scratchWidth - spaceWidth) / (key - 1);
}