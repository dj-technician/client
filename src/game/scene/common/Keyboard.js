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
    window.addEventListener("keydown", this.handleKeyDown, true);
    window.addEventListener("keyup", this.handleKeyUp, true);
  };

  handleKeyDown = (e) => {
    console.log(e.key);
    const key = this.keys.get(e.key);
    if (key) {
      e.stopPropagation();
      e.preventDefault();
      key.press();
    }
  };

  handleKeyUp = (e) => {
    const key = this.keys.get(e.key);
    if (key) {
      e.stopPropagation();
      e.preventDefault();
      key.release();
    }
  };

  destroy = () => {
    window.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("keyup", this.handleKeyUp, true);
    console.log("removed eventlistner");
  };
}

export class Key {
  constructor(value, press, release) {
    this.value = value;
    this.press = press;
    this.release = release;
  }
}
