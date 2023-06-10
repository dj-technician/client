export class Keyboard {
  constructor(throttle, ...keys) {
    this.throttle = throttle;
    this.keys = new Map();
    for (let i = 0; i < keys.length; i++) {
      this.keys.set(keys[i].value, keys[i]);
    }
    this.init();
  }

  init = () => {
    window.addEventListener("keydown", (e) => {
      console.log(e.key);
      const key = this.keys.get(e.key);
      if (key) {
        e.stopPropagation();
        e.preventDefault();
        key.press();
      }
    });
    window.addEventListener("keyup", (e) => {
      const key = this.keys.get(e.key);
      if (key) {
        e.stopPropagation();
        e.preventDefault();
        key.release();
      }
    });
  };
}

export class Key {
  constructor(value, press, release) {
    this.value = value;
    this.press = press;
    this.release = release;
  }
}
