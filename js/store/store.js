import AddressesSlice from "./addresses/slice.js";
import BasketSlice from "./basket/slice.js";
import CardSlice from "./cards/slice.js";

export default class Store {
    #slices = [];

    constructor() {
        this.#slices.push(new BasketSlice());
        this.#slices.push(new CardSlice());
        this.#slices.push(new AddressesSlice());
    }

    getSliceByName(name) {
        return this.#slices.find((elemet) => {
            return elemet.getName() === name;
        });
    }
}
