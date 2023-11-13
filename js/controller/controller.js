import Model from "../model/model.js";

export default class Controller {
    #model;

    constructor() {
        this.#model = new Model();
    }

    getBasketItems() {
        const BD = this.#model.getBD();
        const result = {};

        const slice = this.#model.getSliceByName("basket");

        for (let item of slice.getState()) {
            result[item.id] = {
                ...BD[item.id],
                availableAmount: this.#countTotal(BD[item.id].deliveryDates),
                amount: item.amount,
            };
        }

        return result;
    }

    #countTotal(dates) {
        return dates.reduce((acc, curr) => {
            return (acc += curr.amount);
        }, 0);
    }

    getTotalPrice() {
        const BD = this.#model.getBD();
        const state = this.#model.getSliceByName("basket").getState();

        let totalPrice = 0;

        for (let item of state) {
            totalPrice += +(item.amount * BD[item.id].price).toFixed(0);
        }

        return totalPrice;
    }

    getSelectedItems() {
        const BD = this.#model.getBD();
        const result = {};

        const state = this.#model.getSelectedItems();

        for (let item of state) {
            result[item.id] = {
                ...BD[item.id],
                availableAmount: this.#countTotal(BD[item.id].deliveryDates),
                amount: item.amount,
            };
        }

        return result;
    }

    getSelectedItemsPrice() {
        const BD = this.#model.getBD();
        const state = this.#model.getSelectedItems();

        let totalPrice = 0;

        for (let item of state) {
            totalPrice += +(item.amount * BD[item.id].price).toFixed(0);
        }

        return totalPrice;
    }

    getSelectedItemsAmount() {
        const state = this.#model.getSelectedItems();

        return state.reduce((acc, curr) => (acc += curr.amount), 0) ?? 0;
    }

    getItemById(id) {
        const BD = this.#model.getBD();
        const state = this.#model.getSliceByName("basket").getState();

        const amount = state.find((elem) => elem.id === id).amount;

        return { ...BD[id], ...{ amount: amount } };
    }

    getCards() {
        return this.#model.getCards();
    }

    getCurrentCard() {
        return this.#model.getCurrentCard();
    }

    getAddresses() {
        return this.#model.getAddresses();
    }

    getCurrentDelivery() {
        return this.#model.getCurrentDelivery();
    }

    setCurrentCard(cardLabel) {
        this.#model.setCurrentCard(cardLabel);
    }

    setAllIsSelectedTo(isSelected) {
        this.#model.setAllIsSelectedTo(isSelected);
    }

    setCurrentDelivery(deliveryType, address) {
        this.#model.setCurrentDelivery(deliveryType, address);
    }

    changeBasketItemAmount(id, amount) {
        this.#model.changeBasketItemAmount(id, amount);
    }

    changeBasketItemtoggleIsSelected(id) {
        this.#model.changeBasketItemToggleIsSelected(id);
    }
}
