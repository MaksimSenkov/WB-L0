import Slice from "../slice.js";

const initialState = [
    {
        id: 1,
        amount: 1,
        isFavorite: false,
        isSelected: false,
    },
    {
        id: 2,
        amount: 100,
        isFavorite: false,
        isSelected: false,
    },
    {
        id: 3,
        amount: 1,
        isFavorite: false,
        isSelected: false,
    },
];

export default class BasketSlice extends Slice {
    constructor() {
        super("basket", initialState);
    }

    getName() {
        return super.getName();
    }

    getState() {
        return super.getState();
    }

    getSelected() {
        return this.getState().filter((elem) => elem.isSelected);
    }

    changeAmount(id, amount) {
        const elem = this.#findElementById(id);

        elem.amount = amount;
    }

    toggleIsSelected(id) {
        const elem = this.#findElementById(id);

        elem.isSelected = !elem.isSelected;
    }

    setAllIsSelectedTo(isSelected) {
        for (let item of super.getState()) {
            item.isSelected = isSelected;
        }
    }

    #findElementById(id) {
        return initialState.find((elem) => elem.id === id);
    }
}
