class Coordinate {
  #x;
  #y;

  constructor(xCord, yCord) {
    this.#x = xCord;
    this.#y = yCord;
  }

  set x(xCord) {
    this.#x = xCord;
  }

  set y(yCord) {
    this.#y = yCord;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

export default Coordinate;
