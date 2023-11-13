import BD from "../store/bd.js";
import Store from "../store/store.js";

export default class Model {
    #store;

    constructor() {
        this.#store = new Store();
    }

    getBD() {
        return BD;
    }

    getSliceByName(name) {
        return this.#store.getSliceByName(name);
    }

    getSelectedItems() {
        return this.#store.getSliceByName("basket").getSelected();
    }

    getCards() {
        return this.#store.getSliceByName("card").getCards();
    }

    getCurrentCard() {
        return this.#store.getSliceByName("card").getCurrentCard();
    }

    getAddresses() {
        return this.#store.getSliceByName("delivery").getAddresses();
    }

    getCurrentDelivery() {
        return this.#store.getSliceByName("delivery").getCurrentDelivery();
    }

    setCurrentCard(cardLabel) {
        this.#store.getSliceByName("card").setCurrentCard(cardLabel);
    }

    setAllIsSelectedTo(isSelected) {
        this.#store.getSliceByName("basket").setAllIsSelectedTo(isSelected);
    }

    setCurrentDelivery(deliveryType, address) {
        this.#store.getSliceByName("delivery").setCurrentDeliveryData(deliveryType, address);
    }

    changeBasketItemAmount(id, amount) {
        this.#store.getSliceByName("basket").changeAmount(id, amount);
    }

    changeBasketItemToggleIsSelected(id) {
        this.#store.getSliceByName("basket").toggleIsSelected(id);
    }
}
