export default class Slice {
    #name;
    #state;

    constructor(name, initialState) {
        this.#name = name;
        this.#state = initialState;
    }

    getState() {
        return this.#state;
    }

    getName() {
        return this.#name;
    }
}
