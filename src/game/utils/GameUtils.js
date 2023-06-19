import { Howler } from "howler";

export function isDebug(gameManager) {
  return gameManager.debugMode === true;
}

export function nextScene(context, sceneName, query, params) {
  setTimeout(() => {
    Howler.unload();
    context.keyboard.destroy();
    context.vue.$router.replace({
      name: sceneName,
      query: query,
      params: params,
    });
  }, 500);
}
