import {
  BMS_WIDTH,
  SCRATCH_RATIO,
  SPACE_RATIO,
} from "../scene/game/BmsContainer";

export function isSpace(index, key) {
  return index === getSpaceIndex(key);
}

export function getSpaceIndex(key) {
  if (key === 7) {
    return 3;
  }
  if (key === 5) {
    return 2;
  }
  throw new Error("Unavailable key types");
}

export function getBlockXByKey(currentKeyIndex, key) {
  const scratchWidth = BMS_WIDTH * SCRATCH_RATIO;
  const spaceWidth = BMS_WIDTH * SPACE_RATIO;
  if (currentKeyIndex === null) {
    return 0;
  }
  if (currentKeyIndex === -1) {
    return 0;
  }
  let currentX = scratchWidth;
  for (let i = 0; i < currentKeyIndex; i++) {
    let guideLineX =
      currentX + (BMS_WIDTH - scratchWidth - spaceWidth) / (key - 1);
    if (isSpace(i, key)) {
      guideLineX = currentX + spaceWidth;
    }
    currentX = guideLineX;
  }
  return currentX;
}

export function getBlockWidthByKey(currentKeyIndex, key) {
  const scratchWidth = BMS_WIDTH * SCRATCH_RATIO;
  const spaceWidth = BMS_WIDTH * SPACE_RATIO;

  if (currentKeyIndex === null) {
    return 0;
  }
  if (currentKeyIndex === -1) {
    return scratchWidth;
  }
  if (isSpace(currentKeyIndex, key)) {
    return spaceWidth;
  }
  return (BMS_WIDTH - scratchWidth - spaceWidth) / (key - 1);
}

export function getCurrentKeyIndex(currentKey) {
  if ("1" === currentKey) {
    return 0;
  } else if ("2" === currentKey) {
    return 1;
  } else if ("3" === currentKey) {
    return 2;
  } else if ("4" === currentKey) {
    return 3;
  } else if ("5" === currentKey) {
    return 4;
  } else if ("6" === currentKey) {
    return -1; // turn table (scratch)
  } else if ("7" === currentKey) {
    return null; // paddle
  } else if ("8" === currentKey) {
    return 5;
  } else if ("9" === currentKey) {
    return 6;
  }
}
