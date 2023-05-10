export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.classList.add('tile');
    this.#tileElement.classList.add('show');
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  get tileElement() {
    return this.#tileElement;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - 10 * power;
    this.updateFontSize();
    this.#tileElement.style.setProperty('--background-lightness', `${backgroundLightness}%`);
    this.#tileElement.style.setProperty('--text-lightness', `${backgroundLightness <= 50 ? 90 : 10}%`);
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty('--x', value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty('--y', value);
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(animation ? 'animationend' : 'transitionend', resolve, {
        once: true,
      });
    });
  }

  remove() {
    this.#tileElement.remove();
  }

  // base on the number of digit update the font size
  updateFontSize() {
    const digits = Math.ceil(Math.log10(this.value));

    switch (digits) {
      case 1:
        this.#tileElement.style.fontSize = '7.5vmin';
        break;
      case 2:
        this.#tileElement.style.fontSize = '6.75vmin';
        break;
      case 3:
        this.#tileElement.style.fontSize = '6vmin';
        break;
      case 4:
        this.#tileElement.style.fontSize = '5.25vmin';
        break;
    }
  }
}
